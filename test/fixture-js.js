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

  mainWindow.webContents.on("did-finish-load", async () => {
    try {
      const jsContent = await mainWindow.webContents.executeJavaScript(`
        document.body.textContent
      `);
      console.log("JS 内容:", jsContent);
    } catch (error) {
      console.error("获取内容失败:", error);
    }
  });
  // When the directory is a file, the "file" option will be ignored.
  const loadUrl = electronServe({
    directory: join(import.meta.dirname, "/assets/func.js"),
  });

  loadUrl(mainWindow);
  setTimeout(app.quit, 1000);
})();
