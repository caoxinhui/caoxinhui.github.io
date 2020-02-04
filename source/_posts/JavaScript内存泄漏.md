---
title: JavaScript内存泄漏
date: 2020-01-21 10:54:39
tags:
---

平时工作中基本没有考虑过内存泄漏的情况，也是因为没有遇到过内存泄漏的情况。
有说JavaScript有自己的垃圾回收机制

### 带着问题去学习
1. 什么情况会引起内存泄漏
2. JavaScript内存泄漏机制
<!-- more -->

[参考文章](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)


### 什么是内存泄漏
当一个应用的内存不再被需要的时候，但是由于某些原因，内存没有被释放给操作系统或者内存区。编程语言倾向于通过不同的方式管理内存。这会减少内存泄漏的发生。然而，一片内存是否被使用是不确定事件。只有开发者可以判断清楚内存是否因为还给操作系统。一部分编程语言提供方法给开发者去做这件事情。另一部分希望开发者明确哪一部分内存是没有被使用的。


### JavaScript中的内存管理
JavaScript是一种GC语言。他通过周期性的检查，之前分配的内存是否还 在被使用，帮助开发者管理内存。


### 垃圾收集是如何决定内存回收
#### 内存泄漏的主要起因是引用
> 不合理的引用是导致内存泄漏的主要原因。

**标记清除**
1. 垃圾收集器建立一个roots列表。roots一般是全局变量，并且在代码中保存了引用。在JavaScript中，window就是其中一个root。window始终存在。垃圾收集器会认为window和window的子类会始终存在。
2. 所有的roots被检查并且被标记为active，子类也各自被检查。可以从root追踪到的都不被认为是垃圾。
3. 没有标记的内存会被认为是垃圾。收集器会释放内存。
现代收集器改进了算法，但本质是一样的：reachable 内存被标记，其他的内存当做垃圾。
不需要的引用是指：开发者不需要这些引用，但是由于某些原因，依然保存在root的子类中。

### 常见JavaScript内存泄漏
1. 意外的全局变量
```js
function foo(arg){
  bar = "this is an explicit global variable"
}
```
实际上：
```js
function foo(arg){
  window.bar = "this is an explicit global variable"
}
```
另一个可以意外创建全局变量的方式是通过this
```js
function foo(arg){
  this.bar = "this is an explicit global variable"
}
foo()
```
函数foo内部忘记使用var，意外创建了一个全局变量。
**全局变量注意事项**
> 当全局变量用于临时存储和处理大量信息时，需要小心。如果必须使用全局变量存储大量数据时，确保用完以后把它设置为null或者重新定义

2. 被遗忘的计时器或回调函数
```js
var someResource = getData()
setInterval(function(){
  var node = document.getElementById("Node")
  if(node){
    node.innerHTML = JSON.stringify(someResource)
  }
})
```
与节点或数据关联的计时器不再需要，node对象可以删除，整个回调函数也不需要了。可是，计数器回调函数要等计时器停止才会被回收。同时，someResource如果存储了大量的数据，也是无法被回收的。

对于观察者的例子，一旦不再需要他们，明确移除他们非常重要。老的IE6是无法处理循环引用的。如今，即使没有明确移除他们，一旦观察者对象变得不可达，大部分浏览器是可以回收观察者处理函数的。

**观察者代码示例**
```js
var element = document.getElementById('button')
function onClick(event){
  element.innerHTML = 'text'
}
element.addEventListener('click',onClick)
```
当对node添加了观察者之后，就会导致内存泄漏。但是，当前浏览器会监测循环引用并且正确的进行处理，调用removeEventListener不是必须的了。

3. 脱离DOM的引用
```js
var element = {
  button: document.getElementById('button'),
  image: document.getElementById('image'),
  text: document.getElementById('text')
}
function doStuff() {
  image.src = 'http://some.url/image'
  button.click()
  console.log(text.innerHTML)
}
function removeButton(){
  document.body.removeChild(document.getElementById('button'))
  // 当前，在全局依然有button的引用。button还会保存在内存中并且并不能被GC回收
}
```
```js
var refA = document.getElementById('refA')
document.body.removeChild(refA)
```
解决方法：refA = null
4. 闭包
**匿名函数可以访问父级作用域的变量**
```js
function bindEvent(){
  var obj = document.createElement("XXX")
  var unused = function(){
    console.log(obj,"闭包引用")
  }
}
```
```js
var theThing = null
var replaceThing = function () {
  var originalThing = theThing
  var unused = function () {
    if (originalThing) {
      console.log("hi")
    }
    theThing = {
      longStr: new Array(10000000).join('*'),
      someMethod: function () {
        console.log(someMessage)
      }
    }
  }
}
setInterval(replaceThing, 1000)
```
解决方法：手动解除引用obj = null