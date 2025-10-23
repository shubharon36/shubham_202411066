// frontend/eslint.config.mjs
import js from "@eslint/js";
import next from "eslint-config-next";

export default [
  // Next.js recommended flat config
  ...next(),
  // Optional: also include baseline JS rules
  js.configs.recommended,
  // Ignore build artifacts
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
    ],
  },
  // Your overrides (keep minimal)
  {
    rules: {
      // example: "no-console": "warn",
    },
  },
];
