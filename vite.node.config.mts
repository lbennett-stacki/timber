import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist/node"),
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Timber",
      fileName: "timber",
    },
    rollupOptions: {
      external: ["superjson", "chalk", "deepmerge"],
      output: {
        globals: {
          superjson: "superjson",
          chalk: "chalk",
          deepmerge: "deepmerge",
        },
      },
    },
  },
  plugins: [dts()],
});
