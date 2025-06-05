import { app, BrowserWindow } from "electron";
import electronServe from "../index.js";
import { join } from "path";

let mainWindow;

(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // disable the same-origin policy
    },
  });

  // Not found: E:\...path\test\aa\bb\cc.html
  const loadUrl = electronServe({
    directory: join(import.meta.dirname, "aa/bb"),
    file: "cc",
  });

  loadUrl(mainWindow);
})();
