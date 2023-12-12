import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist/browser"),
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Timber",
      fileName: "timber",
    },
    rollupOptions: {
      external: ["superjson", "deepmerge"],
      output: {
        globals: {
          superjson: "superjson",
          deepmerge: "deepmerge",
        },
      },
    },
  },
  plugins: [dts()],
});
