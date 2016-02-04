'use strict';

var pkg = require('./package');
var webpackConfig = require('./webpack.config')(pkg);
var paths = pkg.paths;

module.exports = {
  clean: [
    paths.dist + '/index.+(js|min.js|min.js.map)'
  ],
  html: {
    src: [
      paths.assets + '/*.html'
    ],
    assign: {
      title: 'Kenode Starter Kit',
      appId: 'wrap'
    }
  },
  vendor: {
    file: 'vendor.js',
    modules: [
      {{modules}}
    ]
  },
  webpack: webpackConfig,
  server: {
    host: 'localhost',
    port: 8989,
    livereload: false,
    directoryListing: false,
    open: true
  }
};