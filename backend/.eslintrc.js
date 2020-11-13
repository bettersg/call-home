module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true

  },
  extends: ['plugin:@typescript-eslint/recommended', 'eslint:recommended', 'airbnb', 'prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'prettier/prettier': ['error'],
  },
};
