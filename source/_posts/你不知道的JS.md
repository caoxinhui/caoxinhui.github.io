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

### 闭包

``` js
function foo() {
    var a = 2

    function bar() {
        console.log(a)
    }
    return bar
}
var baz = foo()
baz()
```

  &nbsp; &nbsp; 拜bar()所声明的位置所赐，它又有涵盖foo()内部作用域的闭包，使得该作用域能够一直存活，以供bar()在之后任何时间进行引用
  &nbsp; &nbsp; bar()依然持有对该作用域的引用，这个引用就叫闭包
  &nbsp; &nbsp; 这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域。

``` js
function wait(message) {
    setTimeout(function timer() {
        console.log(message)
    }, 1000)
}
wait("hello,closure!")
```

&nbsp; &nbsp; wait 执行1000ms后，它的内部作用域不会消失，timer函数依然保有wait作用域的闭包。setTimeout持有对一个参数的引用。这个参数叫fn或者func，或其他。引擎会调用这个函数。

``` js
btn.onClick = function() {
    console.log('btn clicked')
}
```

``` js
/**
 * 如果将函数（访问它们各自的词法作用域）当作第一
 * 级的值类型并到处传递，你就会看到闭包在这些函数中的应用。在定时器、事件监听器、
 * Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步（或者同步）任务中，只要使用了回调函数，实际上就是在使用闭包！
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
```

### this

#### 绑定规则

##### 默认绑定

> 独立函数调用

``` js
function foo() {
    console.log(this.a)
}
var a = 2
foo() // 2
```

##### 隐式绑定

> 调用位置是否包含上下文

``` js
function foo() {
    console.log(this.a)
}
var obj2 = {
    a: 42,
    foo: foo
}
var obj1 = {
    a: 2,
    obj2: obj2
}
obj1.obj2.foo() // 42
```

**隐式丢失**

``` js
function foo() {
    console.log(this.a)
}
var obj = {
    a: 2,
    foo: foo
}
var bar = obj.foo
var a = "oops, global"
bar()
```

##### 显式绑定

``` js
function foo() {
    console.log(this.a)
}
var obj = {
    a: 2
}

foo.call(obj) // 2
```

**硬绑定**

``` js
function foo(something) {
    console.log(this.a, something)
    return this.a + something
}

function bind(fn, obj) {
    return function() {
        return fn.apply(obj, arguments)
    }
}
var obj = {
    a: 2
}
var bar = bind(foo, obj)
var b = bar(3)
console.log(b) // 5 
```

**API调用的“上下文”**

``` js
function foo(el) {
    console.log(el, this.id);
}
var obj = {
    id: "awesome"
}

[1, 2, 3].forEach(foo, obj);
```

##### new绑定

``` js
function foo(a) {
    this.a = a
}
var bar = new foo(2)
console.log(bar.a)
```

**优先级**

> 显示绑定 > new 绑定 > 隐式绑定 > 默认绑定

##### 被忽略的this

&nbsp; &nbsp; 如果把null或者undefined作为this的绑定对象传入call，apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则。 

``` js
function foo(a, b) {
    console.log('a:' + a + 'b: ' + b)
}
foo.apply(null, [2, 3])
var bar = foo.bind(null, 2)
bar(3)
```

##### 软绑定

##### this词法
箭头函数根据外层作用域来决定this

``` js
function foo() {
    return (a) => {
        console.log(this.a)
    }
}
var obj1 = {
    a: 2
}
var obj2 = {
    a: 3
}
var bar = foo.call(obj1)
bar.call(obj2) // 2
```

### 中

### 下

