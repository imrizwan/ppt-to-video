import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/wasm/worker.ts"],
  dts: true,
  sourcemap: false,
  splitting: false,
  clean: true,
  format: ["esm", "cjs"],
  outDir: "dist",
  outExtension({ format }) {
    return format === "cjs" ? { js: ".cjs" } : { js: ".js" };
  }
});
