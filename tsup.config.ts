import { Options, defineConfig } from "tsup";

export const config: Options = {
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  sourcemap: true,
  clean: false,
  dts: true,
};

export default defineConfig(config);
