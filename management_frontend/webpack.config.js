'use strict';

const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';

let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 4
    }),
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
        'Promise': 'imports?this=>global!exports?global.Promise!native-promise-only'
    })
]

if (production) {
    plugins = plugins.concat([
        new webpack.optimize.DedupePlugin(),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false
            }
        })
    ]);
}

module.exports = {
    debug: !production,

    entry: './src/app.js',
    output: {
        path: '../static_admin',
        filename: !production ? '[name].js' : '[hash].[name].js',
        chunkFilename: !production ? '[name].js' : '[chunkhash].[name].js',
        publicPath: '/static_admin/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    plugins: plugins
}
