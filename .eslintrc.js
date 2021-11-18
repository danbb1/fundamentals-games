module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "prettier/prettier": "error",
  },
}
