'use strict';
/*jshint ignore:start */

var gulp = require('gulp');
var gutil = require('gulp-util');

/* begin dist */
var webpack = require('webpack');
var minify = require('gulp-minify');

gulp.task('js.dist.pack', function(cb) {
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

gulp.task('js.dist.minify', ['js.dist.pack'], function() {
    gulp.src('dist/bundle.js')
        .pipe(minify())
        .pipe(gulp.dest('dist'));
});

gulp.task('js.dist.copy', ['js.dist.pack', 'js.dist.minify'], function() {
    gulp.src('dist/*.js')
        .pipe(gulp.dest('../static/mgmt/'));
});

gulp.task('js.dist', ['js.dist.pack', 'js.dist.minify', 'js.dist.copy']);

gulp.task('dist', ['js.dist']);

/* end dist */

/* begin dev */
var babel = require('gulp-babel');
var karma = require('karma');
var jshint = require('gulp-jshint');

gulp.task('js.babel', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('js/'));
});

gulp.task('js.hint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('js.test', function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
gulp.task('js.test.long', function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
})

/* end dev */

// gulp.task('js.watch', function() {
//     return gulp.watch('src/**/*.js', ['js']);
// });

// gulp.task('default', ['js']);
