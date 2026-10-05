#!/usr/bin/env python3
"""Derived plates made in code (no AI call, no budget): continuity retouches.

  ENV_forest_road_nospear  - the spear lying at the roadside is painted out
                             (OpenCV Telea inpainting) for every shot after
                             Kaelan picked it up.
"""
import pathlib

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "production/raw"


def road_without_spear():
    src = cv2.imread(str(RAW / "ENV_forest_road_v01_final.png"))
    mask = np.zeros(src.shape[:2], np.uint8)
    # shaft + iron tip, measured on the raw 1344x768 generation
    cv2.line(mask, (198, 568), (472, 573), 255, 13)
    cv2.fillPoly(mask, [np.array([[392, 560], [486, 573], [392, 586]], np.int32)], 255)
    mask = cv2.dilate(mask, np.ones((5, 5), np.uint8))
    # texture-preserving fill, feathered: grass part takes the grass just above
    # (dy = -26), road part takes plain road texture from the same rows to the
    # right (dx = +170, +110 near the tip so no grass tuft is copied); the two
    # sources crossfade over x 290..350 so there is no seam
    h, w = mask.shape
    xs = np.arange(w, dtype=np.float32)[None, :, None]
    grass_src = np.roll(src, 26, axis=0).astype(np.float32)
    road_src = np.where(xs < 400, np.roll(src, -170, axis=1), np.roll(src, -110, axis=1)).astype(np.float32)
    wr = np.clip((xs - 290) / 60.0, 0, 1)
    fill = grass_src * (1 - wr) + road_src * wr
    a = np.clip(cv2.GaussianBlur(mask.astype(np.float32) / 255.0, (0, 0), 2.5)[..., None] * 1.7, 0, 1)
    out = (src.astype(np.float32) * (1 - a) + fill * a).astype(np.uint8)
    cv2.imwrite(str(RAW / "ENV_forest_road_nospear_v01_final.png"), out)
    crop = np.hstack([src[530:610, 170:520], out[530:610, 170:520]])
    cv2.imwrite(str(ROOT / "out/nospear_check.png"), cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST))


if __name__ == "__main__":
    road_without_spear()
    print("derived: ENV_forest_road_nospear_v01_final")
