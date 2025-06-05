# elecp-serve

[English](#english) | [中文](#chinese)

# <a name="chinese"></a>中文版

静态文件服务器，用于 Electron 应用程序。
通常情况下，你会直接使用 `win.loadURL('file://…')` ，但当你开发单页 Web 应用时（如今大多数 Electron 应用都是如此），这种方法就行不通了，因为 `history.pushState()` 传入的 URL 并不存在于磁盘上。如果文件存在，它会加载文件；如果文件不存在，则会回退到 `index.html` ，这意味着你可以使用像 `react-router` 、 `vue-router` 等路由模块，而不必使用 `hash` 路由。

## 安装

```bash
npm install elecp-serve
```

## 使用方法

基本用法

```javascript
import { app, BrowserWindow } from "electron";
import electronServe from "elecp-serve";
import { join } from "path";

let mainWindow;

(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // 禁用同源策略
    },
  });

  // directory参数必填
  const loadUrl = electronServe({
    directory: join(__dirname, "public"),
  });

  loadUrl(mainWindow);
})();
```

在 electron-vite 中演示

```javascript
import { app, BrowserWindow } from "electron";
import electronServe from "elecp-serve";
import { join } from "path";

let loadURL;

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    // ...other code
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      webSecurity: false, // 禁用同源策略
    },
  });
  // ...other code

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools();
  } else {
    await loadURL(mainWindow);
  }
}

app.whenReady().then(async () => {
  // 在 app 准备好后创建 loadURL 函数
  loadURL = electronServe({
    directory: join(__dirname, "../renderer"),
    scheme: "app", // 自定义协议 默认为 app
    hostname: "-", // 自定义主机名 默认为 -
    file: "index", // 默认文件名 默认为index, 无需加后缀
  });
  // 默认地址为 app://-
  // ...other code
});
```

## 配置选项

- `directory` (必需): 要提供服务的目录路径。当 `directory` 是一个文件（有后缀）时，将忽略 `file` 选项。
- `scheme` (可选): 自定义协议，默认为 `app`
- `hostname` (可选): 自定义主机名，默认为 `-`
- `file` (可选): 默认文件名，默认为 `index`

---

# <a name="english"></a>English Version

Static file server for Electron applications.
Normally you would just use `win.loadURL('file://…')`, but that doesn't work when you're making a single-page web app, which most Electron apps are today, as `history.pushState()` ed URLs don't exist on disk. It serves files if they exist, and falls back to `index.html` if not, which means you can use router modules like `react-router`, `vue-router`, etc, without using hash router.

## Installation

```bash
npm install elecp-serve
```

## Usage

```javascript
import { app, BrowserWindow } from "electron";
import electronServe from "elecp-serve";
import { join } from "path";

let mainWindow;

(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // Disable same-origin policy
    },
  });

  // Basic usage
  const loadUrl = electronServe({
    directory: join(__dirname, "public"),
  });

  loadUrl(mainWindow);
})();
```

Demonstration in electron-vite

```javascript
import { app, BrowserWindow } from "electron";
import electronServe from "elecp-serve";
import { join } from "path";

let loadURL;

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    // ...other code
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      webSecurity: false, // Disable same-origin policy
    },
  });
  // ...other code

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools();
  } else {
    await loadURL(mainWindow);
  }
}

app.whenReady().then(async () => {
  // Create the loadURL function after the app is ready
  loadURL = electronServe({
    directory: join(__dirname, "../renderer"),
    scheme: "app", // Custom protocol, defaults to app
    hostname: "-", // Custom hostname, defaults to -
    file: "index", // Default filename, defaults to index, no suffix required
  });
  // The default address is app://-
  // ...other code
});
```

## Configuration Options

- `directory` (required): Path to the directory to serve. When `directory` is a file (with extension), the `file` option will be ignored.
- `scheme` (optional): Custom protocol, defaults to `app`
- `hostname` (optional): Custom hostname, defaults to `-`
- `file` (optional): Default filename, defaults to `index`
