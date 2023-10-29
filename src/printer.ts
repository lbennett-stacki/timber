import chalk, { type Color } from "chalk";
import superjson from "superjson";

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

export type Message = string | number | object | undefined | null;
export interface Console {
  log(...args: Message[]): void;
  error(...args: Message[]): void;
  warn(...args: Message[]): void;
}

const jsConsole: Console = console;

export abstract class Printer {
  constructor(
    protected readonly namespace: string = "Logger",
    protected readonly console: Console = jsConsole,
    protected readonly palette: Palette = defaultPalette(),
    private readonly isBrowser = typeof window === "object",
  ) {}

  protected print(fn: LogTypes, args: Message[]): void {
    const [formattedTitle, ...rest] = this.formatParts(fn, args);
    const stylize = this.createStyler(fn);
    this.console[fn](
      ...stylize(
        formattedTitle,
        ...rest.map((item) => this.strongify(item)),
      ),
    );
  }

  private strongify(input: unknown) {
    try {
      return JSON.stringify(input, null, 2);
    } catch (error) {
      return superjson.stringify(input);
    }
  }

  private formatParts(fn: LogTypes, args: Message[]) {
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

  private createStyler(fn: LogTypes): (...args: Message[]) => Message[] {
    if (this.isBrowser) {
      return (...args: Message[]) => {
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
      return (...args: Message[]) => {
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
