---
title: 从零实现react全家桶
date: 2020-01-17 17:11:13
tags:
---

### 简介

> [参考教程](https://github.com/brickspert/blog/issues/1)，本文在传统react全家桶架构基础上，对react-imvc解析

### 带着问题去学习

* react-imvc中打包生成的文件，包括vendor.js、index.js 是有哪些内容打包生成的
* 项目中生成的打包内容 `js/number.[hash].js` ，可以修改命名吗？

<!-- more -->

### init 项目

1. `mkdir react-init & cd react-init` 
2. `npm init` 
3. `touch webpack.dev.config.js` 编写基础配置文件

``` js
const path = require('path');
module.exports = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    }
};
```

``` js
// src/index.js
document.getElementById('app').innerHTML = "This is index.html"
```

在打包生成的 `bundle.js` 文件目录下，新建index.html，将bundle.js 插入HTML中

``` js
< !doctype html >
    <
    html lang = "en" >
    <
    head >
    <
    meta charset = "UTF-8" >
    <
    title > Document < /title> <
    /head> <
    body >
    <
    div id = "app" > < /div> <
    script type = "text/javascript"
src = "./bundle.js"
charset = "utf-8" > < /script> <
    /body> <
    /html>
```

执行 webpack --config webpack.dev.config.js 生成打包文件，打开index.html 查看页面

### babel

> 使用babel对JSX，ES6，ES7进行编译，转换成ES5

* babel-core 调用Babel的API进行转码
* babel-loader
* babel-preset-es2015 用于解析 ES6
* babel-preset-react 用于解析 JSX
* babel-preset-stage-0 用于解析 ES7 提案

`npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0` 

配置.babelrc文件

``` js
{
    "presets": [
        "es2015",
        "react",
        "stage-0"
    ],
    "plugins": []
}
```

修改webpack.dev.config.js，增加babel-loader！

``` js
/*cacheDirectory是用来缓存编译结果，下次编译加速*/
module: {
    rules: [{
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.join(__dirname, 'src')
    }]
}
```

### react 

`cnpm install react react-dom` 

``` js
//  src/index.js
import React from 'react';
import ReactDom from 'react-dom';
import Hello from './Hello/Hello.js'

ReactDom.render( <
        div > < Hello / > < /div>, document.getElementById('app'));
```

### react-router

`cnpm install --save react-router-dom` 

``` js
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import Home from '../pages/Home/Home';
import Page1 from '../pages/Page1/Page1';
const getRouter = () => ( <
    Router >
    <
    div >
    <
    ul >
    <
    li > < Link to = "/" > 首页 < /Link></li >
    <
    li > < Link to = "/page1" > Page1 < /Link></li >
    <
    /ul> <
    Switch >
    <
    Route exact path = "/"
    component = {
        Home
    }
    /> <
    Route path = "/page1"
    component = {
        Page1
    }
    /> <
    /Switch> <
    /div> <
    /Router>
);

export default getRouter;
```

### webpack-dev-server

> 配置服务器

`npm install webpack-dev-server@2 --save-dev` 

``` js
// webpack.dev.config.js
devServer: {
    contentBase: path.join(__dirname, './dist'),
    historyApiFallback: true
}
```

> contentBase : URL的根目录。如果不设定的话，默认指向项目根目录。
> historyApiFallback : 让所有的404定位到index.html
> progress : 将编译进度输出到控制台

执行 `webpack-dev-server --config webpack.dev.config.js` 
目前：当我们修改代码的时候，浏览器会自动刷新

### 热模块替换

> hot : 启用Webpack的模块热替换特性。

 
`webpack-dev-server --config webpack.dev.config.js --color --progress --hot` 

 

``` js
// index.js 增加
if (module.hot) {
    module.hot.accept();
}
```

 效果：不刷新页面的情况下，内容更新

 --hot 效果可以用以下配置来替代：
 

``` js
const webpack = require('webpack');
devServer: {
    hot: true
}
plugins: [
    new webpack.HotModuleReplacementPlugin()
]
```

### redux

[入门教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
[详细教程](http://cn.redux.js.org/index.html)
action / reducer /

``` js
export function increment() {
    return {
        type: INCREMENT
    }
}
```

reducer 是一个纯函数，接收action和旧的state, 生成新的state

``` js
export default function reducer(state = initState, action) {
    switch (action.type) {
        case INCREMENT:
            return {
                count: state.count + 1
            };
        default:
            return state
    }
}
```

一个项目有很多的reducers, 我们要把他们整合到一起

``` js
export default function combineReducers(state = {}, action) {
    return {
        counter: counter(state.counter, action)
    }
}
```

#### 创建store

store 有以下职责：

* 维持应用的 state；
* 提供 getState() 方法获取 state；
* 提供 dispatch(action) 触发reducers方法更新 state；
* 通过 subscribe(listener) 注册监听器; 
* 通过 subscribe(listener) 返回的函数注销监听器。

``` js
import {
    createStore
} from 'redux';
import combineReducers from './reducers.js';
let store = createStore(combineReducers);
export default store;
```

用法

``` js
import {
    increment
} from './actions/counter';
import store from './store';
console.log(store.getState());
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);
store.dispatch(increment());
unsubscribe();
```

[redux数据流](http://cn.redux.js.org/docs/basics/DataFlow.html)
react-redux提供了一个方法connect
connect接收两个参数，一个mapStateToProps, 就是把redux的state，转为组件的Props，还有一个参数是mapDispatchToprops, 就是把发射actions的方法，转为Props属性函数。

``` js
import React, {
    Component
} from 'react';
import {
    increment,
    decrement,
    reset
} from 'actions/counter';

import {
    connect
} from 'react-redux';

class Counter extends Component {
    render() {
        return ( <
            div >
            <
            div > 当前计数为 {
                this.props.counter.count
            } < /div> <
            button onClick = {
                () => this.props.increment()
            } > 自增 <
            /button> <
            button onClick = {
                () => this.props.decrement()
            } > 自减 <
            /button> <
            button onClick = {
                () => this.props.reset()
            } > 重置 <
            /button> <
            /div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        counter: state.counter
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        increment: () => {
            dispatch(increment())
        },
        decrement: () => {
            dispatch(decrement())
        },
        reset: () => {
            dispatch(reset())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

传入store

``` js
// index.js

import {
    Provider
} from 'react-redux'
ReactDom.render( <
    AppContainer >
    <
    Provider store = {
        store
    } > {
        RootElement
    } <
    /Provider> <
    /AppContainer>,
    document.getElementById('app')
)
```

* Provider组件是让所有的组件可以访问到store。不用手动去传。也不用手动去监听。
* connect函数作用是从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。也传递dispatch(action)函数到props。

…… 

### 编译css

npm install css-loader style-loader --save-dev

* css-loader使你能够使用类似@import 和 url(... )的方法实现 require()的功能；
* style-loader将所有的计算后的样式加入页面中
* 二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。

``` js
{
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
},
```

### 编译图片

npm install --save-dev url-loader file-loader

``` js
// options limit 8192意思是，小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。
{
    test: /\.(png|jpg|gif)$/,
    use: [{
        loader: 'url-loader',
        options: {
            limit: 8192
        }
    }]
}
```

### 按需加载

`npm install bundle-loader --save-dev` 

``` js
import React, {
    Component
} from 'react'

class Bundle extends Component {
    state = {
        mod: null
    };
    componentWillMount() {
        this.load(this.props)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }
    load(props) {
        this.setState({
            mod: null
        });
        props.load((mod) => {
            this.setState({
                mod: mod.default ? mod.default : mod
            })
        })
    }
    render() {
        return this.props.children(this.state.mod)
    }
}
export default Bundle;
```

``` js
import Home from 'bundle-loader?lazy&name=home!pages/Home/Home';

const Loading = function() {
    return <div > Loading... < /div>
};

const createComponent = (component) => (props) => ( <
    Bundle load = {
        component
    } > {
        (Component) => Component ? < Component {
            ...props
        }
        /> : <Loading / >
    } <
    /Bundle>
);

<
Route exact path = "/"
component = {
    createComponent(Home)
}
/>
```

加个chunkFilename。chunkFilename是除了entry定义的入口js之外的js

``` js
output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].js'
}
```

### 缓存

``` js
output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
}
```

### 提取公共代码

``` js
entry: {
    app: [
        'react-hot-loader/patch',
        path.join(__dirname, 'src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
}
/*plugins*/
new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor'
})
```

### 文件压缩

``` js
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    plugins: [
        new UglifyJSPlugin()
    ]
}
```

### 指定坏境

``` js
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
}
```

### 打包优化

``` js
const CleanWebpackPlugin = require('clean-webpack-plugin');
plugins: [
    new CleanWebpackPlugin(['dist'])
]
```

### 抽取css

``` js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[contenthash:5].css',
            allChunks: true
        })
    ]
}
```

### 使用 CSS Modules

[教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

``` js
// webpack.dev.config.js
module: {
    rules: [{
        test: /\.css$/,
        use: ["style-loader", "css-loader?modules&localIdentName=[local]-[hash:base64:5]", "postcss-loader"]
    }]
}
```

``` js
// webpack.config.js
module: {
    rules: [{
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader?modules&localIdentName=[local]-[hash:base64:5]", "postcss-loader"]
        })
    }]
}
```

