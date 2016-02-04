'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
console.log(process.cwd());

module.exports = function (pkg) {
  var paths = pkg.paths;
  return {
    entry: pkg.entry || {
      index: 'index.js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: path.join(process.cwd(), paths.dist || 'dist'),
      filename: '[name].min.js'
    },
    externals: pkg.externals || {},
    module: {
      loaders: [
        {
          test: /\.(jsx|js)?$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            cacheDirectory: true,
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    devtool: 'source-map'
  };
};