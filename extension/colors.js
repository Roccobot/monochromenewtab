// The user's two colors: where they are stored and how a page picks them up.
// chrome.storage.local is the source of truth; localStorage keeps a synchronous copy so the new
// tab can paint the right color before its first frame, since chrome.storage is asynchronous.
// Author: Rocco Casadei, a.k.a. Roccobot
const Colors = {
  key: "colors",
  hex: /^#[0-9a-f]{6}$/i,

  // Sets --light and --dark on the root element; a missing color falls back to its default.
  apply(colors) {
    const root = document.documentElement;
    for (const mode of ["light", "dark"]) {
      const value = colors?.[mode];
      if (Colors.hex.test(value ?? "")) {
        root.style.setProperty(`--${mode}`, value);
      } else {
        root.style.removeProperty(`--${mode}`);
      }
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
