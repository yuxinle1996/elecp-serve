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
  // When the directory is a file, the "file" option will be ignored.
  const loadUrl = electronServe({
    directory: join(import.meta.dirname, "/assets/func.js"),
  });

  loadUrl(mainWindow);
})();
