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
      const jsonContent = await mainWindow.webContents.executeJavaScript(`
        document.body.textContent
      `);
      console.log("JSON 内容:", jsonContent);
    } catch (error) {
      console.error("获取内容失败:", error);
    }
  });

  // When the directory is a file(has suffix), the "file" option will be ignored.
  const loadUrl = electronServe({
    directory: join(import.meta.dirname, "assets/test-json.json"),
  });

  await loadUrl(mainWindow);
  setTimeout(app.quit, 1000);
})();
