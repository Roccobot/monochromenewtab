#!/usr/bin/env python3
"""Draw the extension icons: a rounded tile, half in the light default and half in the dark one.

Usage: python3 scripts/icons.py   (writes extension/icons/icon-<size>.png)

Author: Rocco Casadei, a.k.a. Roccobot
"""
import pathlib
import re

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent / "extension"
SIZES = (16, 32, 48, 128)
SCALE = 8  # drawn large, then reduced, for smooth edges


def defaults():
    """Read the two default colors from defaults.css, their only home."""
    css = (ROOT / "defaults.css").read_text()
    return [re.search(rf"--default-{mode}:\s*(#[0-9a-fA-F]{{6}})", css).group(1)
            for mode in ("light", "dark")]


def tile(size, light, dark):
    big = size * SCALE
    inset, radius, border = big * 0.06, big * 0.22, max(SCALE, big // 40)
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
        tile(size, light, dark).save(ROOT / "icons" / f"icon-{size}.png", optimize=True)


if __name__ == "__main__":
    main()
