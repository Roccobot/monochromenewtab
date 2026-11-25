# Monochrome New Tab

A browser extension that turns every new tab into a single flat color: the color of your toolbar,
so the empty page looks like part of the window. You pick one color for light mode and one for
dark mode, and the new tab follows the mode by itself.

Made for Vivaldi first, and it works in Chrome and other Chromium browsers too. No search box, no
shortcuts, no images: just the color.

## Install

### From the source (load unpacked)

1. Download this repository (Code, Download ZIP) and unzip it, or clone it.
2. Open the extensions page: `vivaldi://extensions` in Vivaldi, `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and choose the `extension` folder.
5. The options page opens by itself: set your two colors there.

### The Vivaldi step

Vivaldi only hands the new tab to an extension when you allow it:

1. Open Settings, then **Tabs**, then **New Tab Page**.
2. Choose **Start Page** and tick **Controlled by Extension**. Without this, Vivaldi keeps showing
   its Speed Dial.
3. Leave **Focus Page Content on New Tab** off, so the address bar keeps the cursor.
4. In Settings, **Appearance**, keep **Website Appearance** on **Auto**: the new tab then switches
   between light and dark together with your system.

### Chrome

The new tab changes as soon as the extension is installed. If Chrome asks whether to keep the
change, keep it. Chrome may add a footer with the extension name to the new tab: right-click it
to hide it.

## Choosing the colors

Open the extension options (right-click the extension icon, then Options). For each mode you can:

- use the color picker;
- type a hex color, like `#0f0f0f`;
- click **Pick from screen** and then the empty part of your toolbar, to copy its exact color
  (where the browser supports the EyeDropper API);
- go back to the defaults: `#f6f6f6` for light and `#0f0f0f` for dark.

Chrome's own toolbar is `#ffffff` in light mode and `#3c3c3c` in dark mode. In Vivaldi the toolbar
follows your theme, so the eyedropper is the quickest way to match it.

## Privacy

Monochrome New Tab collects no data. It asks for one permission, `storage`, to keep your two
colors on your computer, and it has no access to the websites you visit and makes no network
requests. The full policy is in [PRIVACY.md](PRIVACY.md).

## Build the store package

```sh
python3 scripts/package.py
```

writes `monochromenewtab-<version>.zip` from the `extension` folder. The version people see is
`version_name` in `extension/manifest.json`; the script derives the `version` field from it.

## License

MIT, see [LICENSE](LICENSE). Made by Rocco Casadei, a.k.a. Roccobot.
