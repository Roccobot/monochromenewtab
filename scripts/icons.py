#!/usr/bin/env python3
"""Draw the extension icons: a rounded tile, half in the light default and half in the dark one.

Usage: python3 scripts/icons.py   (writes extension/icons/icon-<size>.png)

The 128 icon follows the Chrome Web Store guideline: 96x96 artwork with 16 transparent pixels on
every side; the same file is uploaded as the store icon.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import pathlib
import re

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent / "extension"
SIZES = (16, 32, 48, 128)
SCALE = 8  # drawn large, then reduced, for smooth edges


def defaults():
    """Read the two default colors from colors.js, their only home."""
    js = (ROOT / "colors.js").read_text()
    return [re.search(rf'{mode}: "(#[0-9a-fA-F]{{6}})"', js).group(1) for mode in ("light", "dark")]


def tile(size, light, dark, margin=0.06):
    big = size * SCALE
    inset, radius, border = big * margin, big * 0.22, max(SCALE, big // 40)
    box = (inset, inset, big - inset, big - inset)
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle(box, radius, fill=255)
    art = Image.new("RGBA", (big, big), light)
    ImageDraw.Draw(art).polygon([(big, 0), (big, big), (0, big)], fill=dark)
    out = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    out.paste(art, mask=mask)
    ImageDraw.Draw(out).rounded_rectangle(box, radius, outline="#7f7f7f", width=border)
    return out.resize((size, size), Image.LANCZOS)


def main():
    light, dark = defaults()
    (ROOT / "icons").mkdir(exist_ok=True)
    for size in SIZES:
        if size == 128:
            icon = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
            icon.paste(tile(96, light, dark, margin=0), (16, 16))
        else:
            icon = tile(size, light, dark)
        icon.save(ROOT / "icons" / f"icon-{size}.png", optimize=True)


if __name__ == "__main__":
    main()
