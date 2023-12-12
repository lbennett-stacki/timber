import { PrinterOptions } from "../printer/types";

export type Message<T> = T | undefined | null;
export type Messages<T> = Message<T>[];

export interface TimberConsole {
  log<T extends unknown[]>(...args: T): void;
  error<T extends unknown[]>(...args: T): void;
  warn<T extends unknown[]>(...args: T): void;
}

export interface HookOptions {
  onLog?: <T extends unknown[]>(...args: T) => void;
  onWarn?: <T extends unknown[]>(...args: T) => void;
  onError?: <T extends unknown[]>(...args: T) => void;
}

export interface LoggerOptions extends PrinterOptions {
  hook?: HookOptions;
}
