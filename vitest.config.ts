/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default getViteConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@components": path.resolve(
        new URL(".", import.meta.url).pathname,
        "./src/components",
      ),
    },
  },
});
