---
title: Proxy
date: 2020-04-04 13:07:07
tags:
categories: ES6
---


Proxy用于修改某些操作的默认行为，可以理解成在目标对象前拦截。
```js
var proxy = new Proxy(target,handler)
```
```js
var obj = new Proxy({}, {
    get: function (target, key, receiver) {
        console.log(`getting ${key}!`)
        return Reflect.get(target, key, receiver)
    },
    set: function (target, key, value, receiver) {
        console.log(`setting ${key}!`)
        return Reflect.set(target, key, value, receiver)
    }
})
obj.count = 1
++obj.count
```

以上代码说明，Proxy 实际上重载了点运算符，即用自己的定义覆盖了语言的原始定义。
