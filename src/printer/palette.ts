import { Palette } from "./types";

export const defaultPalette = (): Palette => {
  return {
    log: { text: "white", background: "blue" },
    warn: { text: "black", background: "yellow" },
    error: { text: "white", background: "red" },
    debug: { text: "white", background: "green" },
  };
};
