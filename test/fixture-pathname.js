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
    directory: join(import.meta.dirname, "index 3.html"),
  });

  await loadUrl(mainWindow, "name=dami&age=18", "pathname");
  console.log(mainWindow.webContents.getURL()); // app://-/pathname?name=dami&age=18
  setTimeout(app.quit, 1000);
})();
