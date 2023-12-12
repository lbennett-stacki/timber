import { TimberConsole } from "../logger/types";

export type LogTypes = "log" | "warn" | "error" | "debug";

export type Palette = {
  [key in LogTypes]: { text: string; background: string };
};

export interface TruncateOptions {
  maxPartLength?: number;
  maxPartLines?: number;
}

export interface PrinterOptions {
  truncate?: TruncateOptions;
  console?: TimberConsole;
  palette?: Palette;
}
