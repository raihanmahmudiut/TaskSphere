import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: ["**/dist", "**/build", "**/.next", "**/.turbo"],
  },

  {
    files: ["**/*.{ts,tsx,js}"],

    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];