import { Printer } from "./printer";

export type Message = string | number | object | bigint | boolean | undefined | null;
export interface Console {
  log(...args: Message[]): void;
  error(...args: Message[]): void;
  warn(...args: Message[]): void;
}

// function facadify(...methods: string[]) {
//   return (ctor: any) => {
//     return ctor;
//   };
// }

// @facadify("log", "error", "warn")
export class Logger extends Printer implements Console {
  static log(...args: Message[]) {
    const logger = new Logger();
    return logger.log(...args);
  }

  static error(...args: Message[]) {
    const logger = new Logger();
    return logger.error(...args);
  }

  static warn(...args: Message[]) {
    const logger = new Logger();
    return logger.warn(...args);
  }

  log(...args: Message[]): void {
    this.print("log", args);
  }

  error(...args: Message[]): void {
    this.print("error", args);
  }

  warn(...args: Message[]): void {
    this.print("warn", args);
  }

  thrown(error: Error | string): Error {
    const err = typeof error === "string" ? new Error(error) : error;
    this.error(err);
    return err;
  }

  scope(scope: string): Logger {
    return new Logger(`${this.namespace}:${scope}`, this.console, this.palette);
  }
}
