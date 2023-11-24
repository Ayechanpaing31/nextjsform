/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-floating-promises":"off",
    "@typescript-eslint/await-thenable":"off",
    "react-hooks/rules-of-hooks":"off",
    "@typescript-eslint/no-unused-vars":"off",
    "@typescript-eslint/no-misused-promises":"off",
    "@typescript-eslint/no-unsafe-member-access":"off",
    "@typescript-eslint/no-unsafe-assignment":"off",
    "@typescript-eslint/no-explicit-any":"off",
    "@typescript-eslint/restrict-plus-operands":"off",
    "@typescript-eslint/no-unsafe-call":"off",
    "@next/next/no-img-element":"off",
    "@typescript-eslint/no-unsafe-argument": "off",





    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],


  },
};

module.exports = config;