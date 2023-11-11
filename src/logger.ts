import { Printer } from "./printer";

export type Message<T> = T | undefined | null;
export type Messages<T> = Message<T>[];

export interface Console {
  log<T>(...args: Messages<T>): void;
  error<T>(...args: Messages<T>): void;
  warn<T>(...args: Messages<T>): void;
}

export class Logger extends Printer implements Console {
  static log<T>(...args: Message<T>[]) {
    const logger = new Logger();
    return logger.log(...args);
  }

  static error<T>(...args: Message<T>[]) {
    const logger = new Logger();
    return logger.error(...args);
  }

  static warn<T>(...args: Messages<T>) {
    const logger = new Logger();
    return logger.warn(...args);
  }

  log<T>(...args: Message<T>[]): void {
    this.print("log", args);
  }

  error<T>(...args: Message<T>[]): void {
    this.print("error", args);
  }

  warn<T>(...args: Message<T>[]): void {
    this.print("warn", args);
  }

  thrown<E extends Error | string>(error: E): E extends string ? Error : E {
    const err = (
      typeof error === "string" ? new Error(error) : error
    ) as E extends string ? Error : E;
    this.error(err);
    return err;
  }

  scope(scope: string): Logger {
    return new Logger(`${this.namespace}:${scope}`, this.console, this.palette);
  }
}
