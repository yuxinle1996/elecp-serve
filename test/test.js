import { jest } from "@jest/globals";
import { join } from "path";
import { fileURLToPath } from "url";

// 抑制控制台警告
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});

// 获取当前文件的目录
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// 模拟electron模块
const mockApp = {
  whenReady: jest.fn().mockResolvedValue(undefined),
  isReady: jest.fn().mockReturnValue(false),
  getAppPath: jest.fn().mockReturnValue("/mock/app/path"),
};

const mockBrowserWindow = jest.fn().mockImplementation(() => ({
  loadURL: jest.fn().mockResolvedValue(undefined),
}));

const mockProtocol = {
  handle: jest.fn(),
};

// 模拟electron模块
jest.unstable_mockModule("electron", () => ({
  app: mockApp,
  BrowserWindow: mockBrowserWindow,
  protocol: mockProtocol,
}));

// 模拟fs/promises模块
const mockStat = jest.fn();
const mockReadFile = jest.fn();

jest.unstable_mockModule("fs/promises", () => ({
  stat: mockStat,
  readFile: mockReadFile,
}));

// 导入被测试的模块
let electronServe;

// 在所有测试之前导入模块
beforeAll(async () => {
  electronServe = (await import("../index.js")).default;
});

// 在每个测试之前重置所有模拟
beforeEach(() => {
  jest.clearAllMocks();
  mockApp.isReady.mockReturnValue(false);
});

describe("electronServe 测试", () => {
  test("fixture-default.js - 默认配置测试", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: __dirname,
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证app.whenReady被调用
    expect(mockApp.whenReady).toHaveBeenCalled();

    // 验证protocol.handle被调用，且使用默认scheme
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-");
  });

  test("fixture-js.js - 加载JS文件测试", async () => {
    // 模拟stat返回文件
    mockStat.mockResolvedValue({
      isFile: () => true,
      isDirectory: () => false,
    });

    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "/assets/func.js"),
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-");
  });

  test("fixture-search-params-obj.js - 搜索参数测试(对象)", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "index 3.html"),
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数，传入搜索参数
    await loadUrl(mainWindow, { name: "dami", age: 18 });

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL和搜索参数
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-?name=dami&age=18");
  });

  // 在这里增加fixture-search-params-str.js测试
  test("fixture-search-params-str.js - 搜索参数测试(字符串)", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "index 3.html"),
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数，传入字符串格式的搜索参数
    await loadUrl(mainWindow, "name=dami&age=18");

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL和搜索参数
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-?name=dami&age=18");
  });

  // 在这里增加fixture-pathname.js测试
  test("fixture-pathname.js - 路径名测试", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "index 3.html"),
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数，传入搜索参数和路径名
    await loadUrl(mainWindow, "name=dami&age=18", "pathname");

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL、路径名和搜索参数
    expect(mainWindow.loadURL).toHaveBeenCalledWith(
      "app://-/pathname?name=dami&age=18"
    );
  });

  test("fixture-json.js - 加载JSON文件测试", async () => {
    // 模拟stat返回文件
    mockStat.mockResolvedValue({
      isFile: () => true,
      isDirectory: () => false,
    });

    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "assets/test-json.json"),
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-");
  });

  test("fixture-spacing.js - 文件名带空格测试", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname),
      file: "index 3",
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-");
  });

  test("fixture-404-error.js - 404错误测试", async () => {
    // 模拟readFile抛出错误
    mockReadFile.mockRejectedValue(new Error("File not found"));

    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "aa/bb"),
      file: "cc",
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-");
  });

  test("fixture-img.js - 加载图片文件测试", async () => {
    // 模拟stat返回文件
    mockStat.mockResolvedValue({
      isFile: () => true,
      isDirectory: () => false,
    });

    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "assets", "test-img.png"),
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://-");
  });

  test("fixture-custom-hostname.js - 自定义主机名测试", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname, "index2.html"),
      hostname: "custom-hostname",
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL和自定义主机名
    expect(mainWindow.loadURL).toHaveBeenCalledWith("app://custom-hostname");
  });

  test("fixture-custom-scheme.js - 自定义协议测试", async () => {
    // 创建loadUrl函数
    const loadUrl = electronServe({
      directory: join(__dirname),
      scheme: "love",
      file: "index2",
    });

    // 创建模拟的BrowserWindow实例
    const mainWindow = new mockBrowserWindow();

    // 调用loadUrl函数
    await loadUrl(mainWindow);

    // 验证protocol.handle被调用，且使用自定义scheme
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "love",
      expect.any(Function)
    );

    // 验证mainWindow.loadURL被调用，且使用正确的URL和自定义协议
    expect(mainWindow.loadURL).toHaveBeenCalledWith("love://-");
  });

  test("缺少必要参数时应抛出错误", () => {
    // 验证不提供directory参数时抛出错误
    expect(() => {
      electronServe({});
    }).toThrow("The `directory` option is required");
  });

  test("协议处理函数测试", async () => {
    // 设置app.isReady为true，确保protocol.handle被直接调用
    mockApp.isReady.mockReturnValue(true);

    // 模拟readFile返回数据
    mockReadFile.mockResolvedValue(Buffer.from("测试内容"));

    // 创建loadUrl函数
    electronServe({
      directory: __dirname,
    });

    // 确保protocol.handle被调用
    expect(mockProtocol.handle).toHaveBeenCalledWith(
      "app",
      expect.any(Function)
    );

    // 获取协议处理函数
    const handleFn = mockProtocol.handle.mock.calls[0][1];

    // 创建模拟请求
    const request = {
      url: "app://-/index.html",
    };

    // 调用协议处理函数
    const response = await handleFn(request);

    // 验证response是Response实例
    expect(response).toBeInstanceOf(Response);

    // 验证readFile被调用
    expect(mockReadFile).toHaveBeenCalled();
  });
});
