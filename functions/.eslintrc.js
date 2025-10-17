module.exports = {
  env: {
    es6: true,
    node: true,
    commonjs: true,
  },
  parserOptions: {
    "ecmaVersion": 2020,
    "sourceType": "script",
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "no-unused-vars": ["error", {"argsIgnorePattern": "^_"}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {
    "require": "readonly",
    "module": "readonly",
    "exports": "writable",
    "process": "readonly",
    "console": "readonly",
  },
};
