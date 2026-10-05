#!/usr/bin/env python3
"""Builds a labelled contact sheet from rendered stills (visual QA)."""
import sys, pathlib
from PIL import Image, ImageDraw
src = pathlib.Path(sys.argv[1]); out = sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
files = sorted(src.glob('f*.jpg'))
tw, th = 640, 360
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * th), (0, 0, 0))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 70, y + 22], fill=(0, 0, 0))
    d.text((x + 6, y + 5), f.stem, fill=(255, 255, 0))
sheet.save(out, quality=88)
