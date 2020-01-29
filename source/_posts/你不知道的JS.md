---
title: 你不知道的JS
date: 2019-12-28 17:53:30
tags: 读书笔记
---

你不知道的JavaScript分为 上、中、下 卷，耐心阅读哦~

[你不知道的JavaScript](https://kingyinliang.github.io/PDF/%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript%EF%BC%88%E4%B8%8A%E5%8D%B7%EF%BC%89.pdf)

<!-- more -->

### 作用域
> 所谓编译：分词/词法分析， 解析/语法分析， 代码生成
**分词/词法分析**
字符串分解为有意义的代码块，这些代码块被分为词法单元
**解析/语法分析**
将词法单元流转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树（抽象语法树AST）
**代码生成**
将AST转换成可执行的代码

#### 函数作用域

#### 块作用域
### 上
```js
/**
 * 如果将函数（访问它们各自的词法作用域）当作第一
 * 级的值类型并到处传递，你就会看到闭包在这些函数中的应用。在定时器、事件监听器、
 * Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步（或者同步）任务中，只要使
 * 用了回调函数，实际上就是在使用闭包！
 */

var obj = {
  id: "awesome",
  cool: function coolFn() {
    console.log(this.id);
  }
};
var id = "not awesome";
obj.cool();
setTimeout(obj.cool, 1000);

function foo(num) {
  console.log("foo: " + num);
  this.count++;
}
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}

this隐式绑定;

function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments);
  };
}
var obj = {
  a: 2
};
var bar = bind(foo, obj);
var b = bar(3);
console.log(b);

function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: "awesome"
}

[1, 2, 3].forEach(foo, obj);

```

### 中


### 下