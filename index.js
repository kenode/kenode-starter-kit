'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence').use(gulp);

module.exports = function (pkg, config) {

  var paths = pkg.paths;
  var clean = config.clean;
  var html = config.html;
  var vendor = config.vendor;
  // var webpack = config.webpack;
  var webpack = require('./webpack.config')({
    paths: paths,
    entry: config.entry,
    externals: config.externals
  });
  var server = config.server;

  gulp.task('cleanall', function () {
    del.sync(paths.dist, { dot: true });
  });

  gulp.task('clean', function () {
    del.sync(clean, { dot: true });
  });

  gulp.task('html', function () {
    return gulp.src(html.src)
      .pipe($.ejs(html.assign))
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('vendor', function () {
    return gulp.src(vendor.modules)
      .pipe($.concat(vendor.file || 'vendor.js'))
      .pipe($.sourcemaps.init())
      .pipe($.rename({ suffix: '.min' }))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('webpack', function () {
    return gulp.src(webpack.entry.index)
      .pipe($.webpack(webpack))
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('server', function () {
    return gulp.src(paths.dist)
      .pipe($.webserver(server));
  });

  gulp.task('init', function () {
    runSequence('cleanall', ['vendor', 'html']);
  });

  gulp.task('dev', function () {
    runSequence('webpack', ['server']);
  });

  gulp.task('build', function () {
    runSequence('webpack');   
  });

};