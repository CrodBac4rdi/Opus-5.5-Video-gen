#!/usr/bin/env python3
"""Turns approved raw generations (production/raw/*_final.png) into render-ready
assets in public/assets/EP01/:

  * plates  -> 2x Lanczos upscale + light unsharp mask (JPEG q92)
  * bloom   -> pre-baked highlight bloom layer per plate (screen-blended in Remotion,
               far cheaper than live CSS blur on a 2.7K plate)
  * sprites -> background key (flood fill from the border, soft alpha band,
               colour decontamination against the known background colour),
               tight crop, 2x upscale (PNG with alpha)
  * ui      -> small portrait crop of Kaelan for the HUD
  * grain   -> tileable film-grain texture

Also writes src/assets/manifest.generated.json with pixel sizes and the
sprite crop offsets so the Remotion code can place everything exactly.
"""
import json
import pathlib

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "production/raw"
OUT = ROOT / "public/assets/EP01"
MANIFEST = ROOT / "src/assets/manifest.generated.json"
SCALE = 2

PLATES = [
    "S01_SH01_awakening_topdown_v01_final",
    "S01_SH02_puddle_reflection_v02_final",
    "S01_SH03_system_glow_v01_final",
    "ENV_meadow_groundlevel_v01_final",
    "S03_SH01_throw_action_v01_final",
    "S04_SH01_hero_analyse_v01_final",
]
SPRITES = {"CREA_ShadowWeasel_sprite_v01_final": (255, 255, 255)}


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


def key_sprite(im, bg):
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
    rgba = np.dstack([rgb, alpha])
    ys, xs = np.where(alpha > 0.02)
    pad = 6
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, a.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, a.shape[1])
    crop = Image.fromarray((rgba[y0:y1, x0:x1] * 255).astype(np.uint8), "RGBA")
    big = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS)
    return big, (int(x0), int(y0), int(x1), int(y1))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    man = {"scale": SCALE, "plates": {}, "sprites": {}}
    for name in PLATES:
        im = Image.open(RAW / f"{name}.png").convert("RGB")
        up = upscale(im)
        up.save(OUT / f"{name}.jpg", quality=92, subsampling=0)
        bloom(up).save(OUT / f"{name}_bloom.jpg", quality=88)
        man["plates"][name] = {"file": f"assets/EP01/{name}.jpg", "bloom": f"assets/EP01/{name}_bloom.jpg",
                               "w": up.width, "h": up.height, "rawW": im.width, "rawH": im.height}
        print("plate", name, up.size)
    for name, bg in SPRITES.items():
        im = Image.open(RAW / f"{name}.png")
        spr, box = key_sprite(im, bg)
        spr.save(OUT / f"{name}.png", optimize=True)
        man["sprites"][name] = {"file": f"assets/EP01/{name}.png", "w": spr.width, "h": spr.height,
                                "rawBox": box, "rawW": im.width, "rawH": im.height}
        print("sprite", name, spr.size, "crop", box)

    ref = Image.open(RAW / "CHAR_Kaelan_ref_v01_final.png").convert("RGB")
    portrait = ref.crop((640, 120, 1100, 580)).resize((320, 320), Image.LANCZOS)
    portrait.save(OUT / "UI_Kaelan_portrait_v01_final.jpg", quality=92)
    man["ui"] = {"portrait": "assets/EP01/UI_Kaelan_portrait_v01_final.jpg"}

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
