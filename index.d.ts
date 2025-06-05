import { type BrowserWindow } from "electron";
interface ServeOptions {
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
 * Create a function that loads a URL
 * @param {ServeOptions} options The configuration options
 * @returns The function that loads the URL
 */
export default function electronServe(options: ServeOptions): (_window: BrowserWindow, searchParams?: Record<string, string | number | boolean>) => Promise<void>;
export {};
