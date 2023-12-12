import superjson from "superjson";
import { LogTypes, PrinterOptions } from "./types";
import { jsConsole } from "./console";
import { TRUNCATED_TEXT } from "./truncate";
import { icons } from "./icons";

export abstract class Printer {
  constructor(
    protected readonly namespace: string,
    protected readonly options: PrinterOptions = {},
  ) {}

  protected print<T extends unknown[]>(fn: LogTypes, args: T): void {
    const [formattedTitle, ...rest] = this.formatParts(fn, args);
    const consoleFn = this.getConsoleFn(fn);

    this.console[consoleFn](
      formattedTitle,
      ...rest.map((item) => this.parseComplex(item)),
    );
  }

  get console() {
    return this.options.console ?? jsConsole;
  }

  get truncateOptions() {
    return {
      maxPartLength: 50000,
      maxPartLines: 5000,
      ...this.options.truncate,
    };
  }

  private getConsoleFn(fn: LogTypes): Exclude<LogTypes, "debug"> {
    return fn === "debug" ? "log" : fn;
  }

  private parseComplex<T>(item: T): string {
    let result = this.strongify(item);

    const maxLength = this.truncateOptions.maxPartLength;
    const maxLines = this.truncateOptions.maxPartLines;

    if (result.length > maxLength) {
      result =
        result.slice(0, maxLength + TRUNCATED_TEXT.length) + TRUNCATED_TEXT;
    }

    const lines = result.split(/\n/);
    if (lines.length > maxLines) {
      result = [...lines.slice(0, maxLines - 1), TRUNCATED_TEXT].join("\n");
    }

    return result;
  }

  private strongify(input: unknown): string {
    let result: string | null;
    try {
      result = JSON.stringify(input, null, 2);
    } catch (error) {
      try {
        result = superjson.stringify(input);
      } catch (superjsonError) {
        return "🪵";
      }
    }

    return result ?? "";
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
