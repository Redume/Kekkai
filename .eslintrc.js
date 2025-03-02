module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        sourceType: 'commonjs',
        ecmaVersion: 'latest'
    },
    rules: {
        indent: 'off',
        semi: ['error', 'always'],
        'arrow-body-style': ['error', 'as-needed'],
        'prettier/prettier': [
          'error', {
            singleQuote: true,
            parser: "flow",
            tabWidth: 4,
            endOfLine: 'lf'
          },
          ],
    },
    overrides: [
        {
            files: ['*/*.js'],
        },
    ],
    ignorePatterns: ['.eslintrc.js'],
};