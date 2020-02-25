---
title: 关于 this
date: 2020-02-25 20:58:44
tags:
categories: 基础
---

JavaScript中所有的函数都是对象？🤔这句话该怎么理解呢？
下面例子中的函数 foo 和对象 foo 指代的是同一个对象？ 

```js
function foo(num) {
    console.log({num})
    foo.count++
}

foo.count = 0
for (let i = 0; i < 10; i++) {
    if (i > 5) {
        foo(i)
    }
}

console.log(foo.count)
```

forEach、map、filter 第二个参数，用来绑定回调函数的 this

如果把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值
在调用时会被忽略，实际应用的是默认绑定规则。
那什么情况下会传入 null 呢？
👇展开数组
```js
function foo(a,b){
    console.log("a: " + a + "b: "+ b)
}
foo.apply(null,[1,2])


// 等同于

function foo(a,b){
    console.log("a: " + a + ",b: "+ b)
}
foo(...[1,2])
```

❤️ bind 可以对参数进行柯里化
```js
function foo(a,b){
    console.log("a: " + a + ",b: "+ b)
}
let bar = foo.bind(null,2)
bar(3)
```

bind 简易实现

```js
// TODO
function bind(fn,obj){
    return function (){
        return fn.apply(obj,arguments)
    }
}
```

Object.create(null) 和 空对象一样吗❓

Object.create(null) 创建了一个空对象，但是它比{}更空，他不会创建 Object.prototype 这个委托


箭头函数根据外层的作用域来决定 this

```js
function foo(){
    setTimeout(()=>{
        console.log(this.a)
    },100)
}

let obj = {
    a:3
}

foo.apply(obj)
```


同箭头函数一样的模式
```js
function foo() {
    let self = this
    setTimeout(function(){
        console.log(self.a)
    },100)
}

let obj = {
    a: 3
}

foo.apply(obj)
```

setTimeout中的function是个回调函数，本质上与包裹她的foo函数没有关系。