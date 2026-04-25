import root from "../../eslint.config.js";
import globals from "globals";

export default [
  ...root,

  {
    files: ["**/*.{ts,js}"],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];