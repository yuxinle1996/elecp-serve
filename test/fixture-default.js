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
  const loadUrl = electronServe({
    directory: import.meta.dirname,
  });

  await loadUrl(mainWindow);
  console.log(mainWindow.webContents.getURL()); // app://-
  setTimeout(app.quit, 1000);
})();
