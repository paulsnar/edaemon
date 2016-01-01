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

var customLaunchers = {
    'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '47'
    },
    'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox'
    }
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


    reporters: ['dots', 'saucelabs'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,


    singleRun: true,
    sauceLabs: {
        testName: 'edaemon browser tests @ Sauce'
    },
    captureTimeout: 120000,
    browserDisconnectTimeout: 120000,
    browserNoActivityTimeout: 120000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),

    plugins: [
        'karma-jasmine',
        'karma-sauce-launcher',
        'karma-sinon',
        require('karma-webpack')
    ],

    webpack: webpackConfig
  })
}
