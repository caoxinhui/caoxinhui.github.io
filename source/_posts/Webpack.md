---
title: Webpack
date: 2019-12-29 16:31:58
tags: Webpack
---



[原文链接](https://github.com/ruanyf/webpack-demos)

webpack-dev-server提供了一个简单的Web服务器和实时热更新的能力

webpack-dev-server --open 告诉 dev-server 在 server 启动后打开浏览器。默认禁用。

webpack-dev-server 开发模式使用，打包的内容在内存中存在，不生成文件。

webpack -p 打包生成静态文件

<!-- more -->

webpack --mode production 打包命令

webpack-dev-server 配置

devServer: {
        contentBase: './dist',
        port: '8080',
        host: 'localhost'
    }
### 打包 jsx 文件

```js
module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      }
    ]
  }
```

### 打包 css 文件

```js
module: {
    rules:[
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
    ]
  }
```

### 打包图片

会将大图片生成一个 base64 格式的 文件，小图片则放在 bundle.js 文件中
````js
module: {
    rules:[
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
````

```js
module: {
    rules:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
             loader: 'css-loader',
             options: {
               modules: true
             }
          }
        ]
      }
    ]
  }
```

css-loader?modules 的作用 ❓

### webpack 插件系统 
    
uglifyjs-webpack-plugin 压缩 JS

```js
plugins: [
    new UglifyJsPlugin()
  ]
}
```


html-webpack-plugin 创建 index.html, open-browser-webpack-plugin 在webpack打包完成后，自动打开浏览器


### 区分开发环境和测试环境代码

```js
var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [devFlagPlugin]
};
```

设置环境
```.json
"scripts": {
    "dev": "npx cross-env DEBUG=true webpack-dev-server --open",
    "build": "npx cross-env DEBUG=false webpack"
  },
```


### 代码分割

```js
require.ensure(['./a'], function(require) {
  var content = require('./a');
  document.open();
  document.write('<h1>' + content + '</h1>');
  document.close();
});

```

require.ensure 告诉 Webpack ./a.js 应该从 bundle.js 中分离出来，生成一个单独的 bundle.js。 于是就生成了一个 1.bundle.js.
但是使用的时候并不需要单独引用 1.bundle.js， 他只是 webpack 帮忙做的操作


### 使用 bundle-loader 实现代码分割

```js
var load = require('bundle-loader!./a.js');

load(function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
});

```

### 提取公共包


```js
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",

      filename: "commons.js",
    })
  ]
```

把 jQuery 打包到 vendor 中
```js
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js',
    vendor: ['jquery'],
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    })
  ]
};
```

如果想让一个变量全局可用，而不用到处 import 
方法一
```js
module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
```

方法二
外层有 data.js 文件
```js
// data.js
var data = 'Hello World';
```
```js
// main.jsx
var data = require('data');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>{data}</h1>,
  document.body
);

```

```js
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
    ]
  },
  externals: {
    // require('data') is external and available
    //  on the global var data
    'data': 'data'
  }
};
```


### publicPath 上线时配置的是cdn的地址



为什么需要打包
- 编译ES6语法特性，编译jsx
- 整合资源，例如图片，Less/Sass
- 优化代码体积

