import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    ignores: ["node_modules/**", "dist/**"],
    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": 0,
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
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
