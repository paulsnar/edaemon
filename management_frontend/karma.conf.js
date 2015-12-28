'use strict';

var webpackConfig = {
    plugins: [
        new (require('rewire-webpack'))
    ],
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    watch: true
}

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine', 'sinon'],

    files: [
      'tests.webpack.js'
    ],

    exclude: [
    ],


    preprocessors: {
        'tests.webpack.js': ['webpack']
    },


    reporters: ['mocha', 'html'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity,

    plugins: [
        'karma-jasmine',
        'karma-jasmine-html-reporter',
        'karma-mocha-reporter',
        'karma-chrome-launcher',
        'karma-sinon',
        require('karma-webpack')
    ],

    webpack: webpackConfig
  })
}
