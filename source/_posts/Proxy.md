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


要使proxy起作用，必须针对proxy实例进行操作，而不是目标对象。如果handler没有设置任何拦截，那就等同于直接通向原对象
```js
const target = {}
const handler = {}
const proxy = new Proxy(target, handler)
proxy.a = 'b'
console.log(target.a)
```

```js
const handler = {
    get: function (target, name) {
        if (name === 'prototype') return Object.prototype
        return 'Hello, ' + name
    },
    apply: function (target, thisBinding, args) {
        return args[0]
    },
    constructor: function (target, args) {
        return args[1]
    }
}
var fproxy = new Proxy(function (x, y) {
    return x + y
}, handler)

fproxy(1, 2)
new fproxy(1, 2)
fproxy.prototype
fproxy.foo
```
<<<<<<< HEAD
=======

```js
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey)
            if (index < 0) {
                propKey = String(target.length + index)
            }
            return Reflect.get(target, propKey, receiver)
        }
    }
    let target = []
    target.push(...elements)
    return new Proxy(target, handler)
}

let arr = createArray('a','b','c')
console.log(arr[-1])
```

>>>>>>> a8aa441fb77a94be9fa4c228e9e7986a180f191a
