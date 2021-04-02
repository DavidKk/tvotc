module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['src/tsconfig.json'],
  },
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'max-len': [
      'error',
      {
        code: 180,
        tabWidth: 2,
        ignoreUrls: true,
      },
    ],
    semi: ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
  },
}
