module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-console": ["warn", { allow: ["error"] }],
    "no-shadow": "off",
    "no-return-assign": "off",
    "no-sequences": "off",
    "no-nested-ternary": "off",
    "no-unused-expressions": "off",
  },
};
