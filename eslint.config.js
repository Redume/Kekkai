const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        sourceType: "commonjs",
        ecmaVersion: "latest",
        parserOptions: {},
    },

    extends: compat.extends("eslint:recommended", "plugin:prettier/recommended"),

    rules: {
        indent: "off",
        semi: ["error", "always"],
        "arrow-body-style": ["error", "as-needed"],

        "prettier/prettier": ["error", {
            singleQuote: true,
            parser: "flow",
            tabWidth: 4,
            endOfLine: "lf",
        }],
    },
}, {
    files: ["*/*.js"],
}, globalIgnores(["**/.eslintrc.js"])]);