import { app, BrowserWindow } from "electron";
import electronServe from "../index.js";

// registering the protocol before app.whenReady() will trigger a warning(but it will work):
// Protocol handler should be registered after app is ready. Will register it when ready.
const loadUrl = electronServe({
  directory: import.meta.dirname,
});

(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // disable the same-origin policy
    },
  });

  await loadUrl(mainWindow);
  console.log(mainWindow.webContents.getURL()); // app://-
  setTimeout(app.quit, 1000);
})();
