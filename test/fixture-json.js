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
  // When the directory is a file(has suffix), the "file" option will be ignored.
  const loadUrl = electronServe({
    directory: join(import.meta.dirname, "assets/test-json.json"),
  });

  loadUrl(mainWindow);
})();
