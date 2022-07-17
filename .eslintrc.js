module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
  rules: {
    'no-console': 0,
    'consistent-return': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-throw-literal': 0,
    'import/no-cycle': 0,
    radix: 0,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
