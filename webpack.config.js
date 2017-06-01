const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist/js',
        filename: 'index.js'
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {presets: ['es2015']}
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    devServer: {
        contentBase: [path.join(__dirname, '/dist'), path.join(__dirname, '/node_modules')],
        //contentBase: __dirname + 'dist',
        compress: true,
        stats: "errors-only",
        open: true
    },
    target: 'node',
    node: {
        fs: "empty"
    }
}
