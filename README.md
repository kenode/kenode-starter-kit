# kenode-starter-kit
Kenode Starter Kit 是一个前端模块化快速开发套件

## Install

```
npm install kenode-starter-kit --save-dev
```

`package.json`
```json
{
  "entry": {
    "index": "./source/index.jsx"
  },
  "paths": {
    "dist": "./dist",
    "assets": "./assets",
    "source": "./source"
  },
  "externals": {
    "react": "React",
    "react-dom": "ReactDOM"
  }
}
```

`config.js`

```javascript
'use strict';

var pkg = require('./package');
var webpackConfig = require('kenode-starter-kit/webpack.config')(pkg);
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
  	  title: 'Starter Kit',
  	  appId: 'wrap'
  	}
  },
  vendor: {
  	file: 'vendor.js',
    modules: [
      'node_modules/react/dist/react.js',
      'node_modules/react-dom/dist/react-dom.js'
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
```

`gulpfile.js`
```javascript
'use strict';

var config = require('./config');
var pkg = require('./package');

// require('./libs/gulp.config')(pkg, config);
require('kenode-starter-kit')(pkg, config);
```

## Install `kskit`

```
npm install kenode-starter-kit -g
```

## License

MIT