// The two colors: their defaults, where the user's choice is stored, and how a page paints it.
// chrome.storage.local is the source of truth; localStorage keeps a synchronous copy, so the new
// tab sets its color before the first frame, while chrome.storage answers only later.
// Loaded as a classic script at the top of <head>: a module would be deferred past the first paint.
// Author: Rocco Casadei, a.k.a. Roccobot
const Colors = {
  // Light: a soft neutral; dark: the toolbar of Rocco's 'Roccobot Dark' Vivaldi theme.
  defaults: { light: "#f6f6f6", dark: "#0f0f0f" },
  key: "colors",
  hex: /^#[0-9a-f]{6}$/i,

  // Sets --light and --dark on the root element; a missing or invalid color uses its default.
  apply(colors) {
    const root = document.documentElement;
    for (const mode of ["light", "dark"]) {
      const value = colors?.[mode];
      root.style.setProperty(`--${mode}`, Colors.hex.test(value ?? "") ? value : Colors.defaults[mode]);
    }
  },

  cached() {
    try {
      return JSON.parse(localStorage.getItem(Colors.key));
    } catch {
      return null;
    }
  },

  cache(colors) {
    if (colors) {
      localStorage.setItem(Colors.key, JSON.stringify(colors));
    } else {
      localStorage.removeItem(Colors.key);
    }
  },

  async load() {
    const stored = await chrome.storage.local.get(Colors.key);
    return stored[Colors.key] ?? null;
  },

  save(colors) {
    Colors.cache(colors);
    return colors
      ? chrome.storage.local.set({ [Colors.key]: colors })
      : chrome.storage.local.remove(Colors.key);
  },

  // Paints from the cache at once, then corrects from storage and follows later changes.
  follow() {
    Colors.apply(Colors.cached());
    Colors.load().then((colors) => {
      Colors.cache(colors);
      Colors.apply(colors);
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && Colors.key in changes) {
        const colors = changes[Colors.key].newValue ?? null;
        Colors.cache(colors);
        Colors.apply(colors);
      }
    });
  },
};

Colors.follow();
