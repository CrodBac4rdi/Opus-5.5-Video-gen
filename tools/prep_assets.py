#!/usr/bin/env python3
"""Turns approved raw generations (production/raw/*_final.png) into render-ready
assets in public/assets/EP01/:

  * plates  -> every approved non-CHAR/CREA image: baked-in letterbox bars are
               detected and cropped (then re-cropped to the original aspect),
               2x Lanczos upscale + light unsharp mask (JPEG q92)
  * bloom   -> pre-baked highlight bloom layer per plate (screen-blended in Remotion,
               far cheaper than live CSS blur on a 2.7K plate)
  * sprites -> every approved CREA_* image: background key (flood fill from the
               border, soft alpha band, colour decontamination against the known
               background colour), tight crop, 2x upscale (PNG with alpha).
               Sheets listed in SPLIT are separated into one sprite per character
               (connected components, left to right -> _A, _B, ...)
  * ui      -> small portrait crops for the HUD
  * grain   -> tileable film-grain texture

Also writes src/assets/manifest.generated.json with pixel sizes, plate crop boxes
and sprite crop offsets so the Remotion code can place everything exactly using
coordinates measured on the ORIGINAL raw images.
"""
import json
import pathlib
import re

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "production/raw"
OUT = ROOT / "public/assets/EP01"
MANIFEST = ROOT / "src/assets/manifest.generated.json"
SCALE = 2
SPRITE_BG = (255, 255, 255)
SPLIT = {"CREA_Goblin_pair_sprite": 2}


def approved():
    return sorted(p.stem for p in RAW.glob("*_final.png"))


def base_name(stem):
    return re.sub(r"_v\d+_final$", "", stem)


def letterbox_crop(im):
    """Detects black bars baked into a generation and crops back to the raw aspect."""
    a = np.asarray(im.convert("L")).astype(np.float32)
    rows, cols = a.mean(1), a.mean(0)
    top = next(i for i, v in enumerate(rows) if v > 12)
    bot = len(rows) - next(i for i, v in enumerate(rows[::-1]) if v > 12)
    left = next(i for i, v in enumerate(cols) if v > 12)
    right = len(cols) - next(i for i, v in enumerate(cols[::-1]) if v > 12)
    if (top, bot, left, right) == (0, im.height, 0, im.width):
        return im, (0, 0, im.width, im.height)
    top, bot = top + 2, bot - 2  # eat the anti-aliased edge of the bar
    h = bot - top
    aspect = im.width / im.height
    w = min(right - left, int(round(h * aspect)))
    x0 = left + ((right - left) - w) // 2
    box = (x0, top, x0 + w, bot)
    return im.crop(box).resize(im.size, Image.LANCZOS), box


def upscale(im):
    w, h = im.size
    big = im.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    return big.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))


def bloom(im):
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255.0
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    k = np.clip((lum - 0.62) / 0.38, 0, 1)[..., None] ** 1.6
    hi = Image.fromarray((a * k * 255).astype(np.uint8))
    small = hi.resize((im.width // 4, im.height // 4), Image.BILINEAR)
    b = np.asarray(small.filter(ImageFilter.GaussianBlur(10))).astype(np.float32)
    b += np.asarray(small.filter(ImageFilter.GaussianBlur(28))).astype(np.float32)
    return Image.fromarray(np.clip(b, 0, 255).astype(np.uint8))


def key_rgba(im, bg):
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255.0
    bgc = np.array(bg, np.float32) / 255.0
    dist = np.abs(a - bgc).max(axis=2)
    near = dist < 0.16
    lab, _ = ndimage.label(near)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bgmask = np.isin(lab, border[border > 0])
    band = ndimage.binary_dilation(bgmask, iterations=2) & ~bgmask
    alpha = np.ones(dist.shape, np.float32)
    alpha[bgmask] = 0.0
    soft = np.clip((dist - 0.04) / 0.30, 0, 1)
    alpha[band] = soft[band]
    alpha = ndimage.gaussian_filter(alpha, 0.6)
    alpha[bgmask & (ndimage.distance_transform_edt(~bgmask) == 0) & (soft < 0.02)] = 0
    # un-blend the white background out of semi-transparent edge pixels
    al = np.clip(alpha, 1e-3, 1)[..., None]
    rgb = np.clip((a - (1 - al) * bgc) / al, 0, 1)
    return np.dstack([rgb, alpha])


def crop_sprite(rgba, mask=None, pad=6):
    alpha = rgba[..., 3] if mask is None else rgba[..., 3] * mask
    ys, xs = np.where(alpha > 0.02)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, rgba.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, rgba.shape[1])
    part = rgba[y0:y1, x0:x1].copy()
    if mask is not None:
        part[..., 3] *= mask[y0:y1, x0:x1]
    crop = Image.fromarray((part * 255).astype(np.uint8), "RGBA")
    big = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS)
    return big, (int(x0), int(y0), int(x1), int(y1))


def split_masks(rgba, n):
    """One soft mask per character: connected components of the (dilated) alpha, left to right."""
    solid = ndimage.binary_dilation(rgba[..., 3] > 0.3, iterations=4)
    lab, cnt = ndimage.label(solid)
    sizes = ndimage.sum(solid, lab, range(1, cnt + 1))
    keep = (np.argsort(sizes)[::-1][:n] + 1).tolist()
    keep.sort(key=lambda k: np.where(lab == k)[1].mean())
    return [ndimage.binary_dilation(lab == k, iterations=2).astype(np.float32) for k in keep]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    man = {"scale": SCALE, "plates": {}, "sprites": {}}
    for stem in approved():
        if stem.startswith(("CHAR_", "CREA_")):
            continue
        raw = Image.open(RAW / f"{stem}.png").convert("RGB")
        im, box = letterbox_crop(raw)
        up = upscale(im)
        up.save(OUT / f"{stem}.jpg", quality=92, subsampling=0)
        bloom(up).save(OUT / f"{stem}_bloom.jpg", quality=88)
        man["plates"][stem] = {"file": f"assets/EP01/{stem}.jpg", "bloom": f"assets/EP01/{stem}_bloom.jpg",
                               "w": up.width, "h": up.height, "rawW": raw.width, "rawH": raw.height, "crop": list(box)}
        print("plate ", stem, up.size, "crop" if box != (0, 0, raw.width, raw.height) else "", box)

    for stem in approved():
        if not stem.startswith("CREA_"):
            continue
        raw = Image.open(RAW / f"{stem}.png")
        rgba = key_rgba(raw, SPRITE_BG)
        n = SPLIT.get(base_name(stem))
        parts = [(stem, None)] if not n else [(f"{stem}_{chr(65 + i)}", m) for i, m in enumerate(split_masks(rgba, n))]
        for name, mask in parts:
            spr, box = crop_sprite(rgba, mask)
            spr.save(OUT / f"{name}.png", optimize=True)
            man["sprites"][name] = {"file": f"assets/EP01/{name}.png", "w": spr.width, "h": spr.height,
                                    "rawBox": box, "rawW": raw.width, "rawH": raw.height}
            print("sprite", name, spr.size, "crop", box)

    man["ui"] = {}
    for key, (stem, box) in {
        "portrait": ("CHAR_Kaelan_ref_v01_final", (640, 120, 1100, 580)),
        "portraitElara": ("CHAR_Elara_ref_v01_final", (560, 60, 1060, 560)),
    }.items():
        if (RAW / f"{stem}.png").exists():
            ref = Image.open(RAW / f"{stem}.png").convert("RGB")
            out = f"UI_{stem.split('_')[1]}_portrait_v01_final.jpg"
            ref.crop(box).resize((320, 320), Image.LANCZOS).save(OUT / out, quality=92)
            man["ui"][key] = f"assets/EP01/{out}"

    rng = np.random.default_rng(42)
    g = rng.normal(0.5, 0.18, (512, 512))
    g = ndimage.gaussian_filter(g, 0.7)
    g = (np.clip((g - g.mean()) * 2.2 + 0.5, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(g, "L").convert("RGB").save(OUT / "FX_grain_tile.png")
    man["fx"] = {"grain": "assets/EP01/FX_grain_tile.png"}

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(man, indent=2) + "\n")
    print("manifest ->", MANIFEST.relative_to(ROOT))


if __name__ == "__main__":
    main()
