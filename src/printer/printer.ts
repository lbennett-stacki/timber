import { LogTypes, PrinterOptions } from "./types";
import { jsConsole } from "./console";
import { icons } from "./icons";

export abstract class Printer {
  constructor(
    protected readonly namespace: string,
    protected readonly options: PrinterOptions = {},
  ) {}

  protected print<T extends unknown[]>(fn: LogTypes, args: T): void {
    const [formattedTitle, ...rest] = this.formatParts(fn, args);
    const consoleFn = this.getConsoleFn(fn);

    this.console[consoleFn](formattedTitle, ...rest);
  }

  get console() {
    return this.options.console ?? jsConsole;
  }

  private getConsoleFn(fn: LogTypes): Exclude<LogTypes, "debug"> {
    return fn === "debug" ? "log" : fn;
  }

  private formatParts<T extends unknown[]>(fn: LogTypes, args: T) {
    const rest = [...args];
    const title = rest.shift();
    const parts = [this.getIcon(fn), this.namespace];
    if (typeof title === "string") {
      parts.push(`| ${title}`);
    } else {
      rest.push(title);
    }

    return [parts.join(" "), ...rest];
  }

  private getIcon(fn: LogTypes) {
    return icons[fn];
  }
}
