
/*
 build system to:
 - transform JSX into straight-up JS
 - serve it up for development on local machine

By using:
 - Babel, an ES6 to ES5 compiler with support for JSX
 - Browserify, a tool for bundling up JavaScript modules
 - Gulp, the streaming build system

Gulp roules:
 - Building and watching the JSX files
 - Copying HTML files into the build directory
 - Cleaning the build directory
 */

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var del = require('del');

gulp.task('build', function () {
    return browserify({
            entries: './src/js/index.jsx',
            extensions: ['.jsx'],
            debug: true
        })
        .transform(babelify)
        .bundle()
        .pipe(source('js/bundle.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('*.jsx', ['build']);
});

gulp.task('html', function() {
    return gulp.src(['./src/*.html','./src/favicon.ico'])
        .pipe(gulp.dest('build'));
});

gulp.task('del', function() {
    del('build/*');
});

gulp.task('default', ['build', 'html']);



