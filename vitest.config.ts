import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "artifacts/wedding-app/src"),
      "@assets": path.resolve(rootDir, "attached_assets"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./artifacts/wedding-app/src/test/setup.ts"],
    include: ["artifacts/wedding-app/src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      include: ["artifacts/wedding-app/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "artifacts/wedding-app/src/main.tsx",
        "artifacts/wedding-app/src/components/ui/**",
      ],
    },
  },
});
