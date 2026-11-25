// Options page: two colors, each with a picker, a hex field and, where the browser has the
// EyeDropper API, a button that samples the screen. Every change is saved at once.
// Author: Rocco Casadei, a.k.a. Roccobot
const MODES = ["light", "dark"];
const defaults = Object.fromEntries(
  MODES.map((mode) => [
    mode,
    getComputedStyle(document.documentElement).getPropertyValue(`--default-${mode}`).trim(),
  ]),
);
const rows = Object.fromEntries(
  MODES.map((mode) => [mode, document.querySelector(`.color-row[data-mode="${mode}"]`)]),
);
const status = document.getElementById("status");
let current = { ...defaults };

function show(colors) {
  current = { ...defaults, ...colors };
  for (const mode of MODES) {
    const row = rows[mode];
    row.querySelector('input[type="color"]').value = current[mode];
    const field = row.querySelector('input[type="text"]');
    field.value = current[mode];
    field.removeAttribute("aria-invalid");
  }
  Colors.apply(current);
}

async function store(mode, value) {
  show({ ...current, [mode]: value.toLowerCase() });
  await Colors.save(current);
  status.textContent = "Saved.";
}

for (const mode of MODES) {
  const row = rows[mode];
  row.querySelector('input[type="color"]').addEventListener("input", (event) => {
    store(mode, event.target.value);
  });
  row.querySelector('input[type="text"]').addEventListener("input", (event) => {
    const value = event.target.value.trim();
    if (Colors.hex.test(value)) {
      store(mode, value);
    } else {
      event.target.setAttribute("aria-invalid", "true");
      status.textContent = "Use a hex color like #0f0f0f.";
    }
  });
  if ("EyeDropper" in window) {
    const button = row.querySelector(".eyedropper");
    button.hidden = false;
    button.addEventListener("click", async () => {
      try {
        const { sRGBHex } = await new EyeDropper().open();
        store(mode, sRGBHex);
      } catch {
        // The user pressed Escape: nothing to change.
      }
    });
  }
}
document.getElementById("eyedropper-hint").hidden = !("EyeDropper" in window);

document.getElementById("reset").addEventListener("click", async () => {
  show(defaults);
  await Colors.save(null);
  status.textContent = "Defaults restored.";
});

document.getElementById("version").textContent = chrome.runtime.getManifest().version_name;
Colors.load().then(show);
