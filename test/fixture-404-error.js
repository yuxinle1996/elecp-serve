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

  const loadUrl = electronServe({
    directory: join(import.meta.dirname, "aa/bb"),
    file: "cc",
  });

  loadUrl(mainWindow); // Not found: E:\...path\test\aa\bb\cc.html
  setTimeout(app.quit, 1000);
})();
