import { Printer } from "../printer/printer";
import { TimberConsole, LoggerOptions } from "./types";

export class Logger extends Printer implements TimberConsole {
  constructor(namespace: string, readonly options: LoggerOptions = {}) {
    super(namespace, options);
  }

  scope(scope: string): Logger {
    return new Logger(`${this.namespace}:${scope}`, this.options);
  }

  merge(logger?: Logger): Logger {
    if (!logger) {
      return this;
    }

    return new Logger(`${this.namespace}:${logger.namespace}`, {
      ...this.options,
      ...logger.options,
    });
  }

  debug<T extends unknown[]>(...args: T): void {
    this.options.hook?.onLog?.(...args);
    this.print<T>("debug", args);
  }

  log<T extends unknown[]>(...args: T): void {
    this.options.hook?.onLog?.(...args);
    this.print<T>("log", args);
  }

  warn<T extends unknown[]>(...args: T): void {
    this.options.hook?.onWarn?.(...args);
    this.print<T>("warn", args);
  }

  error<T extends unknown[]>(...args: T): void {
    this.options.hook?.onError?.(...args);
    this.print<T>("error", args);
  }

  thrown<E extends Error | string>(error: E): E extends string ? Error : E {
    const err = (
      typeof error === "string" ? new Error(error) : error
    ) as E extends string ? Error : E;

    this.error(err);

    return err;
  }
}
