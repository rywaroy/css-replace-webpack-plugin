module.exports = {
    mode: 'development',
    output: {
        filename: 'bundle.js',
    },
    devServer: {
        hot: true,
        compress: true,
        port: 8080,
    },
    module: {
        rules: [
            /* config.module.rule('babel') */
            {
                test: /\.(j|t)s(x?)$/,
                exclude: [/node_modules/],
                use: [
                    /* config.module.rule('babel').use('babel-loader') */
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        /* config.plugin('html-template') */
        new (require('html-webpack-plugin'))({
            template: 'src/index.html',
        }),
        /* config.plugin('clean-webpack-plugin') */
        new (require('clean-webpack-plugin').CleanWebpackPlugin)(),
    ],
    entry: {
        index: ['./src/index.js'],
    },
};
