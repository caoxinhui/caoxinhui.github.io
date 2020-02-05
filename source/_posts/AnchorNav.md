---
title: 锚点导航
date: 2019-12-28 17:40:11
tags: 项目经历
---

## 分享内容

**锚点导航功能点**（功能拆分）

* 点击锚点滚动到指定楼层
* 滚动楼层自动切换到当前对应的锚点
* 导航栏吸顶，计算吸顶时机
* 吸顶高度坍塌问题，包裹层加一个高度
* 展开锚点：导航栏滚动到吸顶位置，切选中当前的锚点

<!-- more -->

### 遇到的问题

* **当点击锚点导航栏的时候，需要页面滚动到对应的位置。但是，页面数据又是动态加载的，所以一次计算并不能准确滚动**

通过 componentDidUpdate 这个方法，当楼层有加载的时候，重新触发点击锚点事件 

以上方案的问题在于，接口请求到数据，更新了 productHasLoaded，状态是更新了，但是 render 过程还没有执行，导致页面并没有发生变化
而这个时候去计算该滑动的高度，其实是没有意义的。滚动的高度也是当前的楼层的高度，实际上根本不会滑动到对应的位置。滑动的距离还是新加载楼层并没有加载进来的错误高度。

骚操作来了：setTimeout(()=>{this.fixScroll()}, 0)

javascript 的过程是单线程，状态更新了之后，何时 render 页面我们并不知道，大概是放在事件队列里面等待执行，那么 setTimeout 就是等事件队列里面的事情执行结束后，再执行滚动操作

那么问题是： react 更新状态和 render 的先后顺序是怎么样的
setState（）不会立即改变 this.state，但会创建挂起状态转换
更：

状态更新一定会 render，但是 render 不表示页面已经根据状态发生改变

* **页面 loading 的时候为何 window.scrollTo(0, height)会不起作用呢**

页面加载完之后scrollTo才会起作用，否则会一直自动滚动到起始位置。浏览器特性。

* **锚点导航添加蒙层之后的点击穿透问题** 

点击了蒙层，触发了下面的产品链接，导致蒙层关闭同时会跳转到另一个页面。
原代码里添加了

``` js
onClick = {
    e => {
        this.handleFoldAnchor();
    }
}
onTouchStart = {
    e => {
        this.handleFoldAnchor();
    }
}

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

``` js
onTouchMove = {
    e => {
        this.handleFoldAnchor()
    }
}
onClick = {
    e => {
        this.handleFoldAnchor();
    }
}
```

