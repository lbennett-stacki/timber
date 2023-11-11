import deepmerge from "deepmerge";
import { Palette, Printer, TruncateOptions } from "./printer";

export type Message<T> = T | undefined | null;
export type Messages<T> = Message<T>[];

export interface Console {
  log<T extends unknown[]>(...args: T): void;
  error<T extends unknown[]>(...args: T): void;
  warn<T extends unknown[]>(...args: T): void;
}

export interface HookOptions {
  onLog?: <T extends unknown[]>(...args: T) => void;
  onWarn?: <T extends unknown[]>(...args: T) => void;
  onError?: <T extends unknown[]>(...args: T) => void;
}

export class Logger extends Printer implements Console {
  constructor(
    namespace: string,
    protected readonly hookOptions?: HookOptions,
    truncateOptions?: TruncateOptions,
    console?: Console,
    palette?: Palette,
    isBrowser?: boolean,
  ) {
    super(namespace, console, palette, isBrowser, truncateOptions);
  }

  scope(scope: string): Logger {
    return new Logger(
      `${this.namespace}:${scope}`,
      this.hookOptions,
      this.truncateOptions,
      this.console,
      this.palette,
      this.isBrowser,
    );
  }

  merge(logger?: Logger): Logger {
    if (!logger) {
      return this;
    }

    return new Logger(
      `${this.namespace}:${logger.namespace}`,
      deepmerge(this.hookOptions ?? {}, logger.hookOptions ?? {}),
      deepmerge(this.truncateOptions, logger.truncateOptions),
      this.console || logger.console,
      deepmerge(this.palette, logger.palette),
      this.isBrowser || logger.isBrowser,
    );

    // return new Logger(
    //   `${this.namespace}:${logger.namespace}`,
    //   { ...this.hookOptions, ...logger.hookOptions },
    //   {...this.truncateOptions, ...logger.truncateOptions},
    //   ( this.console  || logger.console),
    //   { ...this.palette, ...logger.palette },
    //   this.isBrowser || logger.isBrowser,
    // );
  }

  log<T extends unknown[]>(...args: T): void {
    this.hookOptions?.onLog?.(...args);
    this.print("log", args);
  }

  warn<T extends unknown[]>(...args: T): void {
    this.hookOptions?.onWarn?.(...args);
    this.print("warn", args);
  }

  error<T extends unknown[]>(...args: T): void {
    this.hookOptions?.onError?.(...args);
    this.print("error", args);
  }

  thrown<E extends Error | string>(error: E): E extends string ? Error : E {
    const err = (
      typeof error === "string" ? new Error(error) : error
    ) as E extends string ? Error : E;
    this.error(err);
    return err;
  }
}
