import { protocol, app, type BrowserWindow } from "electron";
import { join, resolve, relative, isAbsolute, extname } from "node:path";
import { stat, readFile } from "fs/promises";
import mime from "mime";

/**
 * The options for the electronServe function.
 */
export interface ServeOptions {
  /**
   * The directory to serve, relative to the application root.
   * When the directory is a file, the "file" option will be ignored.
   */
  directory: string;

  /**
   * Custom protocol
   * @default 'app'
   */
  scheme?: string;

  /**
   * Custom hostname
   * @default '-'
   */
  hostname?: string;

  /**
   * Custom HTML file name
   * @default 'index'
   */
  file?: string;
}

/**
 * The search params type
 */
export type SearchParams = string | Record<string, string | number | boolean>;

/**
 * Get the file path, if it's a directory, try to get the index.html inside it.
 * @param {string} _path The path to get the file path
 * @param {string} file The default file name
 * @returns {Promise<string | undefined>} The final path or undefined
 */
const getPath = async (
  _path: string,
  file: string
): Promise<string | undefined> => {
  try {
    const result = await stat(_path);

    if (result.isFile()) {
      return _path;
    }

    if (result.isDirectory()) {
      return getPath(join(_path, `${file}.html`), file);
    }
    return undefined;
  } catch {
    return undefined;
  }
};

/**
 * Create a function that loads a URL
 * @param {ServeOptions} options The configuration options
 * @returns The function that loads the URL
 */
export default function electronServe(
  options: ServeOptions
): (
  _window: BrowserWindow,
  searchParams?: SearchParams,
  pathname?: string
) => Promise<void> {
  if (!options.directory) {
    throw new Error("The `directory` option is required");
  }

  const { scheme = "app", hostname = "-", file = "index" } = options;

  // parse the directory path to an absolute path
  const directory = resolve(app.getAppPath(), options.directory);

  // ensure the app is ready
  if (!app.isReady()) {
    console.warn(
      "Protocol handler should be registered after app is ready. Will register it when ready."
    );
  }

  // ensure the protocol handler is registered after the app is ready
  const registerProtocol = (): void => {
    protocol.handle(scheme, async (request) => {
      try {
        // parse the request URL to get the path
        const pathname = decodeURIComponent(new URL(request.url).pathname);
        // build the full file path
        const filePath = join(directory, pathname);
        // the default index file path
        const indexPath = directory.endsWith(".html")
          ? directory
          : join(directory, `${file}.html`);
        // security check: ensure the requested file path does not exceed the specified directory
        const relativePath = relative(directory, filePath);
        const isSafe =
          !relativePath.startsWith("..") && !isAbsolute(relativePath);

        if (!isSafe) {
          return new Response("Path is not safe!!", {
            status: 500,
          });
        }

        // try to get the final file path
        const finalPath = await getPath(filePath, file);
        const fileExtension = extname(filePath);

        // if the file is not found and is not an HTML or ASAR file, return 404
        if (
          !finalPath &&
          fileExtension &&
          fileExtension !== ".html" &&
          fileExtension !== ".asar"
        ) {
          return new Response(`Not found: ${filePath}`, { status: 404 });
        }
        // read the file content
        const targetPath = finalPath || indexPath;
        let data;
        try {
          data = await readFile(targetPath);
        } catch (error) {
          return new Response(`Not found: ${targetPath}`, { status: 404 });
        }
        const ext = extname(targetPath);
        const contentType = mime.getType(ext) || "application/octet-stream";
        // build the response headers
        const headers: Record<string, string> = {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        };

        return new Response(data, { headers });
      } catch (error: any) {
        console.error("Error handling protocol request:", error);
        return new Response(error.message, { status: 500 });
      }
    });
  };

  // if the app is ready, register the protocol
  if (app.isReady()) {
    registerProtocol();
  } else {
    // otherwise, wait for the app to be ready before registering
    app.whenReady().then(registerProtocol);
  }

  // return the function that loads the URL
  return async (
    _window: BrowserWindow,
    searchParams?: SearchParams,
    pathname?: string
  ): Promise<void> => {
    let url = `${scheme}://${hostname}`;

    // add pathname if provided
    if (pathname) {
      url += pathname.startsWith("/") ? pathname : `/${pathname}`;
    }

    // add search params
    if (searchParams) {
      if (typeof searchParams === "string") {
        url += searchParams.startsWith("?") ? searchParams : `?${searchParams}`;
      } else if (
        typeof searchParams === "object" &&
        Object.keys(searchParams).length > 0
      ) {
        const urlSearchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams)) {
          urlSearchParams.append(key, String(value));
        }
        url += `?${urlSearchParams.toString()}`;
      }
    }

    await _window.loadURL(url);
  };
}
