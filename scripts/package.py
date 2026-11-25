#!/usr/bin/env python3
"""Keep the manifest version in step with version_name, and build the ZIP for the stores.

Usage:
    python3 scripts/package.py --check   only verify that version matches version_name
    python3 scripts/package.py [OUTDIR]  sync version, then write monochromenewtab-<x.xx>.zip

version_name is the only number written by hand: SlimVer x.xx, the one people read. The manifest
`version` field is what Chrome and Vivaldi compare for updates, and it rejects leading zeros
(1.05 is invalid), so it is derived as x.<integer of xx>: 0.10 -> 0.10, 1.05 -> 1.5,
1.10 -> 1.10. The mapping keeps the order of SlimVer.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import json
import pathlib
import re
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
EXTENSION = ROOT / "extension"
MANIFEST = EXTENSION / "manifest.json"


def derived(version_name):
    match = re.fullmatch(r"(\d+)\.(\d\d)", version_name)
    if not match:
        sys.exit(f"version_name {version_name!r} is not SlimVer x.xx")
    return f"{int(match.group(1))}.{int(match.group(2))}"


def main(args):
    manifest = json.loads(MANIFEST.read_text())
    want = derived(manifest["version_name"])
    if "--check" in args:
        if manifest["version"] != want:
            sys.exit(f"manifest version {manifest['version']} should be {want}")
        print(f"version {want} matches version_name {manifest['version_name']}")
        return
    if manifest["version"] != want:
        # Only the version line changes, so the hand-written layout of the manifest stays.
        text = re.sub(r'("version":\s*)"[^"]*"', rf'\g<1>"{want}"', MANIFEST.read_text(), count=1)
        MANIFEST.write_text(text)
    out = pathlib.Path(args[0]) if args else ROOT
    target = out / f"monochromenewtab-{manifest['version_name']}.zip"
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(EXTENSION.rglob("*")):
            if path.is_file() and path.name != ".DS_Store":
                archive.write(path, path.relative_to(EXTENSION).as_posix())
    print(target)


if __name__ == "__main__":
    main(sys.argv[1:])
