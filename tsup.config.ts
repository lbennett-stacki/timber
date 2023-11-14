import { Options, defineConfig } from "tsup";

export const config: Options = {
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs"],
  noExternal: ["superjson"],
  splitting: true,
  sourcemap: true,
  clean: false,
  dts: true,
};

export default defineConfig(config);
