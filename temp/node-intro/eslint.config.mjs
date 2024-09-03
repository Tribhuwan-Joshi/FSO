// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
      },
    },
    files: ["**/*.js"],

    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": 0,
    },
    plugins: {
      "@stylistic/js": {
        rules: {
          indent: ["error", 2],
          "linebreak-style": ["error", "windows"],
          quotes: ["error", "single"],
          semi: ["error", "never"],
        },
      },
    },
  },
];
