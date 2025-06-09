import { app, BrowserWindow } from "electron";
import electronServe from "../index.js";

(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    title: "app1",
    webPreferences: {
      webSecurity: false, // disable the same-origin policy
    },
  });

  const loadUrl = electronServe({
    directory: import.meta.dirname,
    file: "index",
  });

  await loadUrl(mainWindow);
  console.log(mainWindow.webContents.getURL()); // app://-
})();

(async () => {
  await app.whenReady();
  const otherWindow = new BrowserWindow({
    title: "app2",
    webPreferences: {
      webSecurity: false, // disable the same-origin policy
    },
  });

  // using the same schema to register repeatedly will trigger a warning(but it will work):
  // Protocol [app] is already registered.
  // It is recommended to use the same loadURL function or use a different scheme.
  const loadUrl = electronServe({
    directory: import.meta.dirname,
    // scheme: "app", // should be different from the first one
    file: "index2",
  });

  await loadUrl(otherWindow);
  console.log(otherWindow.webContents.getURL()); // app://-
})();
