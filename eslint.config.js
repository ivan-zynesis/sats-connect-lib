module.exports = {
    extends: [
        "prettier",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint"
    ],
    ignorePatterns: [
        "node_modules/",
    ],
    parser: "@typescript-eslint/parser"
}
