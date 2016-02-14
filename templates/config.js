'use strict';

var pkg = require('./package');
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
      title: '{{appname}}',
      appId: 'wrap'
    }
  },
  vendor: {
    file: 'vendor.js',
    modules: [
{{modules}}
    ]
  },
{{entry}},
{{externals}},
  server: {
    host: 'localhost',
    port: {{port}},
    livereload: false,
    directoryListing: false,
    open: true
  }
};