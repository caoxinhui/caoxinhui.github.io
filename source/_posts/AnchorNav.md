---
title: AnchorNav
date: 2019-12-28 17:40:11
tags: 项目经历
---
## 分享内容

    首先用纯node.js实现一个文件管理系统
    用express实现文件管理系统
    用koa实现文件管理系统
    比较使用上的体验，自己实现一个express或者一个koa

实现一个 codesandbox

webpack 产生的背景： - 多 js 文件下全局对象冲突 - 模块加载顺序 - 解决模块或库的依赖 - 大工程模块过多，难以管理。
webpack 作用

- 将所有的依赖拆分成块且按需加载
- 首屏渲染耗时少
- 所有的静态文件都是一个模块
- 第三方也可以作为一个模块被加载
- 自定义程度高，可以按需自定义打包的整个流程
- 适用于大 project 的开发场景。

webpack 可以通过 CLI 指定配置文件,不指定配置文件的情况下，webpack 会自动在当前目录寻找文件名为 webpack.config.js 的配置文件

关于 npm 代理设置(让 npm 走翻墙代理加快海外源下载/发布速度)
应该是上面设置的代理导致的，以下是删除 npm 代理
npm config delete proxy
npm config delete https-proxy

子网隔离

命令行打开浏览器窗口 - windows：start https://www.baidu.com - mac: open https://www.baidu.com - Linux: x-www-browser https://www.baidu.com

使用 & 运算符判断一个数的奇偶性

```javascript
//偶数 & 1 = 0
//奇数 & 1 = 1
```

使用 & | 来设计一个权限或者状态等等，

在 vscode 中，当在命令行中打开了，但是找不到文件路径，可以用 code .在编辑器中打开该项目

今天重新用 mac 重新配置了 github，需要在.ssh 文件夹下面新增一个 config 文件，加上一些配置

今天在家打算登陆公司的账号看一下项目，发现本机的账号没有公司的权限，所以应该如何设置使自己能够登上公司的系统，并使用公司的设置呢？将自己本机的 ssh key 增加到公司的 gitlab ssh key 配置里面 打开 ssh 文件快捷键 open ～/.ssh
安装插件 gitlens 显示当前行的 commit 信息

延展操作符...属于浅拷贝，只会复制一层

<!-- 滴滴前端框架 -->

https://github.com/didi/chameleon
https://cmljs.org/#/
https://jakearchibald.com/2016/fun-hacks-faster-content/
https://github.com/myliang/x-spreadsheet web 版电子表格

- 探索 npm 代理

  发布系统使用的代理


  删除 NPM 代理

  ```bash
    npm config delete proxy
    npm config delete https-proxy
  ```


- React 黑科技

  - 纯函数组件可以拥有生命周期吗？（答案：可以）

  ```javascript
  // 普通的纯函数组件
  function View() {
    return <h1>.....</h1>;
  }

  // 带有生命周期的纯函数组件
  function ViewWithLifeCycle() {
    return {
      componentDidMount() {
        console.log("didMount");
      },
      render() {
        return <h1>.....</h1>;
      }
    };
  }
  ```

今天的锚点导航项目，投机取巧使用了固定值，造成了样式显示的问题。
项目中，不能信任拿到的值，需要对拿到的值作兼容考虑，有可能拿到的值是老的页面配置。值有可能是不合理的。需要充分考虑兼容情况

scroll-behavior: smooth
css 控制滚动动画

锚点导航锚不中的问题：今天又迎来了新进展

通过 componentDidUpdate 这个方法，当楼层有加载的时候，重新触发点击锚点事件 -----> 看上去确实解决了问题，因为楼层更新的时候，确实会引起页面高度的变化，当高度变化完了之后，再重新点击用户选中的锚点

以上方案的问题在于，接口请求到数据，更新了 productHasLoaded，状态是更新了，但是 render 过程还没有执行，导致页面并没有发生变化
而这个时候去计算该滑动的高度，其实是没有意义的。滚动的高度也是当前的楼层的高度，实际上根本不会滑动到对应的位置。滑动的距离还是新加载楼层并没有加载进来的错误高度。

骚操作来了：setTimeout(()=>{this.fixScroll()},0)

javascript 的过程是单线程，状态更新了之后，何时 render 页面我们并不知道，大概是放在事件队列里面等待执行，那么 setTimeout 就是等事件队列里面的事情执行结束后，再执行滚动操作

那么问题是： react 更新状态和 render 的先后顺序是怎么样的
setState（）不会立即改变 this.state，但会创建挂起状态转换
更：

状态更新一定会 render，但是 render 不表示页面已经根据状态发生改变

问题：页面 loading 的时候为何 window.scrollTo(0,height)会不起作用呢

锚点导航添加蒙层之后的点击穿透问题：
点击了蒙层，触发了下面的产品链接，导致蒙层关闭同时会跳转到另一个页面。
原代码里添加了

```js
onClick={e => {
  this.handleFoldAnchor();
}}
onTouchStart={e => {
  this.handleFoldAnchor();
}}


// e.stopPropagation() 起到阻止捕获和冒泡阶段中当前事件的进一步传播
// event.preventDefault()可以取消默认事件

// 使用touchstart事件在某些场景下会出现点击穿透的现象。
// 点击穿透：假如页面上有两个元素A和B。B元素在A元素之上。我们在B元素的touchstart事件上注册了一个回调函数，该回调函数的作用是隐藏B元素。我们发现，当我们点击B元素，B元素被隐藏了，随后，A元素触发了click事件。


// 这是因为在移动端浏览器，事件执行的顺序是touchstart > touchend > click。而click事件有300ms的延迟


// 一开始这种写法为何会穿透呢，touchStart之后，蒙层消失，然后触发了click事件，click点击了产品的链接，从而跳转。


// 注：浏览器事件触发的顺序
// touchstart --> mouseover(有的浏览器没有实现) --> mousemove(一次) -->mousedown --> mouseup --> click -->touchend

// Touch 事件中，常用的为 touchstart, touchmove, touchend 三种。除此之外还有touchcancel

```

换成
```js
onTouchMove = { e => {
  this.handleFoldAnchor()
}}
onClick={e => {
  this.handleFoldAnchor();
}}
```


 实现数组快速浅拷贝
 arr.slice()


 函数名首字母大写，蠢哭


作用域：块语句（大括号"{}"中间的语句），如if 和 switch 条件语句或for和while循环语句，不像函数，它们不会创建一个新的作用域。在块语句中定义的变量将保留它们已经存在的作用域中

块级作用域可通过新增命令 let 和 const 声明，所声明的变量在指定块的作用域外无法被访问。块级作用域在如下情况被创建：

在一个函数内部
在一个代码块（由一对花括号包裹）内部


```js
var x = 10
function fn() {
  console.log(x)
}
function show(f) {
  var x = 20
  (function() {
    f() //10，而不是20
  })()
}
show(fn)
```
要到创建 fn 函数的那个作用域中取，无论 fn 函数将在哪里调用。<font color="red">静态作用域</font>
