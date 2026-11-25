// Opens the options page once, right after installation: in Vivaldi the new tab only changes
// after a manual setting, and the options page explains it.
// Author: Rocco Casadei, a.k.a. Roccobot
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
  }
});
