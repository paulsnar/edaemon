'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var minify = require('gulp-minify');
var webpack = require('webpack');

gulp.task('js.pack', function(cb) {
    webpack({
        context: __dirname + '/src',
        entry: './entry.js',
        output: {
            path: __dirname + '/dist',
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
            })
        ]
    }, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({ }));
        cb();
    });
});

gulp.task('js.minify', ['js.pack'], function() {
    gulp.src('dist/bundle.js')
        .pipe(minify())
        .pipe(gulp.dest('dist'));
});

gulp.task('js.copy', ['js.pack', 'js.minify'], function() {
    gulp.src('dist/*.js')
        .pipe(gulp.dest('../static/mgmt/'));
});

gulp.task('js', ['js.pack', 'js.minify', 'js.copy']);
gulp.task('js.watch', function() {
    return gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', ['js']);
