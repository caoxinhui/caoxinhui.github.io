---
title: 锚点导航
date: 2019-12-28 17:40:11
tags: 项目经历
---
## 分享内容


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


```javascript
//偶数 & 1 = 0
//奇数 & 1 = 1
```

使用 & | 来设计一个权限或者状态等等，

延展操作符...属于浅拷贝，只会复制一层


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
