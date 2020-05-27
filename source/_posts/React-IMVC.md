---
title: React-IMVC
date: 2019-12-28 17:41:18
tags:
---

### 带着问题去学习

1. nodejs环境如何加载前端组件
2. 组件的数据如何获取
3. HMR怎么做
4. CSS如何处理
5. 如何拼接成完整的HTML结构返回
6. 双端渲染结果不一致怎么办
7. 如何进行路由分割
8. 如何降级为客户端渲染
9. 生产环境如何发布应用

<!-- more -->

[React 实现服务端渲染](https://juejin.im/post/5af443856fb9a07abc29f1eb)

[函数式编程思想推荐阅读](https://zhuanlan.zhihu.com/p/63744358?utm_source=wechat_session&utm_medium=social&utm_oi=940270556197728256)

[React setState 实现原理](https://imweb.io/topic/5b189d04d4c96b9b1b4c4ed6)

[开发网站](https://dev.to/)

[利用webpack搭建脚手架一套完整流程](https://mp.weixin.qq.com/s/23f64lu-qAEAK76lFYyzow)

[同构](https://mp.weixin.qq.com/s/-Il3V0dtDA3JR1okK2yJyw)

[css 整理](https://mp.weixin.qq.com/s/W8-Cu8Mjh00Rze5o4bFKag)


取消浏览器记录滚动条位置

```js
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
} else {
    window.onunload = () => window.scrollTo(0, 0);
}
```

history.scrollRestoration 是新增的一个属性，值为 auto|manual, 默认为 auto 记录滚动条位置, 设为 manual 时就禁用记录位置的功能

```js
componentDidMount() {
    history.scrollRestoration = 'manual';
}
componentWillUnMount() {
    history.scrollRestoration = 'auto';
}
```

```js
module.exports = {
    entry: {
        index: [path.resolve(__dirname, "../src/single/index.js")]
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].[chunkhash:8].js"
    }
};
```

webpack 中对代码进行了哪些操作？
1、 多文件时可以进行代码切割

* 若入口（pageA, pageB）都用到了 utilB，我们希望把它抽离成单独文件，并且当用户访问 pageA 和 pageB 的时候都能去加载 utilB 这个公共模块，而不是存在于各自的入口文件中。
* pageB 中 utilC 不是页面一开始加载时候就需要的内容，假如 utilC 很大，我们不希望页面加载时就直接加载 utilC，而是当用户达到某种条件(如：点击按钮)才去异步加载 utilC，这时候我们需要将 utilC 抽离成单独文件，当用户需要的时候再去加载该文件。

多文件打包示例

```js
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        pageA: [path.resolve(__dirname, "./src/multiple/pageA.js")],
        pageB: path.resolve(__dirname, "./src/multiple/pageB.js")
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].[chunkhash:8].js"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    }
};
```

打包出来分为：
1、 业务代码文件，
2、 共同模块文件
3、 异步加载的文件会直接抽离

react-imvc preload是如何实现的？ 

preload提前加载的方式

```html
<!-- 使用 link 标签静态标记需要预加载的资源 -->
<link rel="preload" href="/path/to/style.css" as="style">
```

```js
// 或使用脚本动态创建一个 link 标签后插入到 head 头部
// 当浏览器解析到这行代码就会去加载 href 中对应的资源但不执行，待到真正使用到的时候再执行
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'style';
link.href = '/path/to/style.css';
document.head.appendChild(link);
```

```jsx harmony
import React from 'react'

const CurrentRoute = React.createContext({
    path: '/welcome'
})
const CurrentUser = React.createContext({
    name: '33'
})
const IsStatic = React.createContext(false)

export default function App() {
    return <CurrentRoute.Consumer> {currentRoute =>
        <CurrentUser.Consumer> {currentUser =>
            <IsStatic.Consumer> {isStatic =>
                !isStatic &&
                currentRoute.path === '/welcome' &&
                (currentUser ?
                        `Welcome back, ${currentUser.name}!` :
                        'Welcome!'
                )
            } </IsStatic.Consumer>}
        </CurrentUser.Consumer>}
    </CurrentRoute.Consumer>
}
```

```jsx harmony
import React, {
    useContext
} from 'react'

const CurrentRoute = React.createContext({
    path: '/welcome'
})
const CurrentUser = React.createContext(undefined)
const IsStatic = React.createContext(false)

export default function App() {
    let currentRoute = useContext(CurrentRoute)
    let currentUser = useContext(CurrentUser)
    let isStatic = useContext(IsStatic)

    return (
        !isStatic &&
        currentRoute.path === '/welcome' &&
        (currentUser ?
`Welcome back, ${currentUser.name}!` :
            'Welcome!'
        )
    )
}
```


