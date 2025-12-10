/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // required for React tests
    globals: true,        // allows `expect`, `vi`, etc. without imports
    setupFiles: "./vitest.setup.ts",
  },
});
