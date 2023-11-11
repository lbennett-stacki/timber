import chalk, { type Color } from "chalk";
import superjson from "superjson";
import { Console, Message } from "./logger";

export type LogTypes = "log" | "warn" | "error";

export type Palette = {
  [key in LogTypes]: { text: typeof Color; background: typeof Color };
};

export const defaultPalette = (): Palette => {
  return {
    log: { text: "white", background: "blue" },
    warn: { text: "black", background: "yellow" },
    error: { text: "white", background: "red" },
  };
};

const jsConsole: Console = console;

const TRUNCATED = "░--TRUNCATED--░";

const isDev = process.env.NODE_ENV === "development";

export abstract class Printer {
  constructor(
    protected readonly namespace: string = "Logger",
    protected readonly console: Console = jsConsole,
    protected readonly palette: Palette = defaultPalette(),
    private readonly isBrowser = typeof window === "object",
    protected readonly config = {
      maxPartLength: isDev ? 1000 : 50000,
      maxPartLines: isDev ? 100 : 5000,
    },
  ) {}

  protected print<T extends unknown[]>(fn: LogTypes, args: T): void {
    const [formattedTitle, ...rest] = this.formatParts(fn, args);
    const stylize = this.createStyler(fn);
    this.console[fn](
      ...stylize(
        formattedTitle,
        ...rest.map((item) => this.parseComplex(item)),
      ),
    );
  }

  private parseComplex<T>(item: T): string {
    let result = this.strongify(item);

    if (result.length > this.config.maxPartLength) {
      result =
        result.slice(0, this.config.maxPartLength + TRUNCATED.length) +
        TRUNCATED;
    }

    const lines = result.split(/\n/);
    if (lines.length > this.config.maxPartLines) {
      result = [
        ...lines.slice(0, this.config.maxPartLines - 1),
        TRUNCATED,
      ].join("\n");
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
    const parts = [this.isBrowser && "%c", this.getIcon(fn), this.namespace];
    if (typeof title === "string") {
      parts.push(`| ${title}`);
    } else {
      rest.push(title);
    }
    this.isBrowser && parts.push("%O");

    return [parts.join(" "), ...rest];
  }

  private capitalize(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  private createStyler(fn: LogTypes) {
    if (this.isBrowser) {
      return <T>(...args: Message<T>[]) => {
        return [
          `
      background-color: ${this.palette[fn].background}; 
      color: ${this.palette[fn].text};
      padding: 2px;
      font-weight: bold;
    `,
          ...args,
        ];
      };
    } else {
      return <T>(...args: Message<T>[]) => {
        return [
          chalk[this.palette[fn].text][
            `bg${this.capitalize(this.palette[fn].background)}` as typeof Color
          ](...args),
        ];
      };
    }
  }

  private getIcon(fn: LogTypes) {
    switch (fn) {
      case "error":
        return "💩";
      case "warn":
        return "❗️";
      case "log":
        return "🔎";
      default:
        return "❓";
        break;
    }
  }
}
