import { app, BrowserWindow } from "electron";
import electronServe from "../index.js";

let mainWindow;

(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // disable the same-origin policy
    },
  });
  // app://-
  const loadUrl = electronServe({
    directory: import.meta.dirname,
  });

  loadUrl(mainWindow);
})();
