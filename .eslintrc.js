module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:fsd/all',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'fsd', 'import'],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'no-underscore-dangle': 0,
    'linebreak-style': 0,
    'import/extensions': [
      'error',
      'never',
      { js: 'ignorePackages', scss: 'always' },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
