module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // Don't check formatting with eslint. This is less intrusive during dev,
    // e.g. eslint won't block you on badly formatted WIP
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};

