---
title: ES6
date: 2020-01-01 13:56:44
tags: 读书笔记
---


### 第16章 Promise 对象
> promise 是一个对象，用来传递异步操作的消息

- promise 构造函数接受一个函数作为参数，该函数的两个参数分别是resolve，reject
```js
var promise = new Promise(function(resolve,reject){
  if(/* 异步操作成功*/) {
    resolve(value)
  } else {
    reject(error)
  }
})
```
- promise实例生成之后，可以用then方法指定resolved和rejected状态的回调函数
```js
promise.then(function(value){
  // success
},function(value){
  // failue
})
```

#### Promise.prototype.catch()
> .then(null,rejection) 的别名，用于指定发生错误时的回调

#### Promise.all()
promise.all 用于将多个promise实例包装成一个新的promise实例。Promise.all 方法的参数不一定是数组，但是必须具有Iterator接口，且返回的每一个成员都是Promise实例
```js
var p = Promise.all([p1,p2,p3])

var promises= [2,3,5,7,11,13].map(function(id){
  return getJSON("/post/" + id + ".json")
})
Promise.all(promises).then(function(posts){

}).catch(function(reason){
  
})
```


promise对象的错误就有冒泡性质，会一直向后传递，直到被捕获为止

> 一般不要在then方法中定义rejected状态的回调函数，而应总是使用catch方法，理由是更接近同步写法。

### 第20章 Module
- CommonJS 用于服务器
- AMD 用于浏览器

ES6 模块的设计思想是尽量静态化，使得编译时就能确定模块的依赖关系，以及输入输出变量。CommonJS和AMD都只能在运行时确定这些东西

- CommonJS模块就是对象，输入时必须查找对象属性
```js
// 运行时加载
let { stat, exists, readFile } = requre('fs')
```

- ES6 模块不是对象，而是通过export命令显示指定输出的代码，输入时也采用静态命令的形式
```js
// 编译时加载
import { stat,exists, readFile } from 'fs'
```


- export 使用 as 重命名
```js
export {
  v1 as streamV1,
  v2 as streamV2
}
```

- import 使用 as 重命名
```js
import { lastname as surname } from './profile'
```

- import 命令具有提升效果，会提升到模块的头部首先执行。



```js
export { es6 as default } from './someModule'
====> 等价 
import { es6 } from './someMudule'
export default es6 
```

- 整体加载
```js
import * as circle from './circle'
```

#### ES6 模块加载的实质
CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用。

#### 循环加载
- require 命令第一次加载脚本就会执行整个脚本，然后内存中生成一个对象。CommonJS对待循环加载，只会输出已经执行的部分，还未执行的部分不会输出