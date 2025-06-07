import { app, BrowserWindow } from "electron";
import electronServe from "../index.js";
import { join } from "path";

let mainWindow;

(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // must disable the same-origin policy
    },
  });
  const loadUrl = electronServe({
    directory: join(import.meta.dirname),
    file: "index 3",
  });

  await loadUrl(mainWindow);
  console.log(mainWindow.webContents.getURL()); // app://-
  setTimeout(app.quit, 1000);
})();
