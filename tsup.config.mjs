import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["./src/index.ts"],
  outDir: "./dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  ...options,
}));
