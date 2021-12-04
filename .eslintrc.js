/* eslint-env node */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  // do not extend `plugin:prettier/recommended` globally. it enables eslint-plugin-prettier which does not place nice with svelte currently.
  // prettier is enabled below for typescript files only
  // see https://github.com/sveltejs/prettier-plugin-svelte/issues/57
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        // running import plugin on svelte files is slow 🐢
        // therefore enable it for typescript only
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:prettier/recommended",
      ],
      rules: {
        "import/no-duplicates": "error",
        "prettier/prettier": "error",
      },
      settings: {
        "import/extensions": [".ts"],
      },
    },
    {
      files: ["*.config.js"],
      env: {
        node: true,
      },
    },
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
      plugins: ["svelte3", "@typescript-eslint"],
      settings: {
        "svelte3/typescript": require("typescript"),
      },
    },
  ],
};
