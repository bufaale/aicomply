import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/eu-ai-act/**/*.ts",
        "src/lib/security/**/*.ts",
        "src/components/aicomply/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.config.*",
        "**/node_modules/**",
        "**/.next/**",
      ],
      // Coverage gates: realistic baseline as of pre-launch May 9, 2026.
      // We're at 9.6% lines / 16.6% functions / 14.8% branches / 8.7% statements
      // covering security headers + cross-walk + atoms only. The aspirational
      // 80% target is post-launch — increase incrementally as we add tests
      // without breaking CI for everyone.
      thresholds: {
        lines: 8,
        functions: 15,
        branches: 14,
        statements: 8,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
