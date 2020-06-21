module.exports = {
    env: { browser: true, es6: true, node: true, commonjs: true },
    extends: ['airbnb-base'],
    globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
    parserOptions: { ecmaVersion: 11, sourceType: 'module' },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-unused-vars': 0,
        'class-methods-use-this': 0,
        'no-param-reassign': 0,
        'no-useless-escape': 0,
        'no-plusplus': 0,
        'no-constant-condition': 0
    },
    parser: '@typescript-eslint/parser',
};
