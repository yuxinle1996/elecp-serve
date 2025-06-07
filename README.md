# elecp-serve

[English](#english) | [中文](#chinese)

# <a name="chinese"></a>中文版

静态文件服务器，用于 Electron 应用程序生产环境。
通常情况下，你会直接使用 `win.loadURL('file://…')` ，但当你开发单页 Web 应用时（如今大多数 Electron 应用都是如此），这种方法就行不通了，因为 `history.pushState()` 传入的 URL 并不存在于磁盘上。如果文件存在，它会加载文件；如果文件不存在，则会回退到 `index.html` ，这意味着你可以使用像 `react-router` 、 `vue-router` 等路由模块，而不必使用 `hash` 路由。

## 安装

```bash
npm install elecp-serve
```

## 使用方法

使用

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

  loadUrl(mainWindow); // 默认地址为 app://-
})();
```

自定义协议/主机名/文件名/路径/搜索参数

```javascript
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
    scheme: "test", // 自定义协议 默认为 app
    hostname: "custom", // 自定义主机名 默认为 -
    file: "index", // 默认文件名 默认为index, 无需加后缀
  });

  // 搜索参数 searchParams 可以是字符串(name=dami&age=18)或对象({name: "dami", age: 18})
  loadUrl(mainWindow, { name: "dami", age: 18 }, "/user"); // test://custom?name=dami&age=18
})();
```

## API

### electronServe(options: ServeOptions)

#### ServeOptions

##### directory

- 类型: `string`
- 必需: 是
- 描述: 要提供服务的目录路径。当 `directory` 是一个文件（有后缀）时，将忽略 `file` 选项。

##### scheme

- 类型: `string`
- 必需: 否
- 描述: 自定义协议，默认为 `app`

##### hostname

- 类型: `string`
- 必需: 否
- 描述: 自定义主机名，默认为 `-`

##### file

- 类型: `string`
- 必需: 否
- 描述: 默认文件名，默认为 `index`

### loadUrl(window: BrowserWindow, searchParams?: SearchParams, pathname?: string)

##### window

- 类型: `BrowserWindow`
- 必需: 是
- 描述: 浏览器窗口实例

##### searchParams

- 类型: `string` | `object`
- 必需: 否
- 描述: 搜索参数，可以是字符串(name=dami&age=18)或对象({name: "dami", age: 18})

##### pathname

- 类型: `string`
- 必需: 否
- 描述: 路径名

---

# <a name="english"></a>English Version

Static file server for Electron applications in production environment.
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

Custom protocol/hostname/filename/path/search parameters

```javascript
(async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // Disable same-origin policy
    },
  });

  // directory参数必填
  const loadUrl = electronServe({
    directory: join(__dirname, "public"),
    scheme: "test", // Custom protocol, defaults to app
    hostname: "custom", // Custom hostname, defaults to -
    file: "index", // Default filename, defaults to index, no suffix required
  });

  // The search parameter searchParams can be a string (name=dami&age=18) or an object ({name: "dami", age: 18})
  loadUrl(mainWindow, { name: "dami", age: 18 }, "/user"); // test://custom?name=dami&age=18
})();
```

## Configuration Options

### electronServe(options: ServeOptions)

#### ServeOptions

##### directory

- Type: `string`
- Required: Yes
- Description: Path to the directory to serve. When `directory` is a file (with extension), the `file` option will be ignored.

##### scheme

- Type: `string`
- Required: No
- Description: Custom protocol, defaults to `app`

##### hostname

- Type: `string`
- Required: No
- Description: Custom hostname, defaults to `-`

##### file

- Type: `string`
- Required: No
- Description: Default filename, defaults to `index`

### loadUrl(window: BrowserWindow, searchParams?: SearchParams, pathname?: string)

#### window

- Type: `BrowserWindow`
- Required: Yes
- Description: Browser window instance

#### searchParams

- Type: `string` | `object`
- Required: No
- Description: Search parameters, can be a string (name=dami&age=18) or an object ({name: "dami", age: 18})

#### pathname

- Type: `string`
- Required: No
- Description: Pathname
