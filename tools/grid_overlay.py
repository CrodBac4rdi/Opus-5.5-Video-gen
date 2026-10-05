#!/usr/bin/env python3
"""Draws a labelled 100px coordinate grid over raw generations (for measuring anchor points)."""
import sys, pathlib
from PIL import Image, ImageDraw
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
for f in sys.argv[2:]:
    im = Image.open(f).convert('RGBA')
    bg = Image.new('RGBA', im.size, (40, 160, 70, 255)) if 'CREA_' in f or 'sprite' in f else None
    if bg is not None:
        bg.alpha_composite(im); im = bg
    d = ImageDraw.Draw(im)
    for x in range(0, im.width, 100):
        d.line([(x, 0), (x, im.height)], fill=(255, 0, 255, 160), width=1); d.text((x + 2, 2), str(x), fill=(255, 255, 0, 255))
    for y in range(0, im.height, 100):
        d.line([(0, y), (im.width, y)], fill=(255, 0, 255, 160), width=1); d.text((2, y + 2), str(y), fill=(255, 255, 0, 255))
    im.convert('RGB').save(out / (pathlib.Path(f).stem + '_grid.jpg'), quality=85)
