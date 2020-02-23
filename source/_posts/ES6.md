---
title: ES6
date: 2020-01-01 13:56:44
tags: 读书笔记
---

<!-- more -->

### 第二章

#### let 

> let 所声明的变量只在 let 命令所在的代码块中有效。

🤔如下代码块，最终输出10。如果 var 改成 let，输出6。
原因：var 声明的，在全局范围内都有效，所以，每循环一次，新的i值都会覆盖旧的i值，导致，最后输出的是旧的i值。
而 let 声明的，当前的 i 值只在本轮循环内有效，所以每一次循环的 i 其实都是一个新的变量。
🤔而且，当运行结束之后, var 声明的 i 会泄漏为全局变量

``` js
var a = []
for (var i = 0; i < 10; i++) {
    a[i] = function() {
        console.log(i)
    }
}
a[6]()
```

特性：

* **let 不存在变量提升**
* **暂时性死区**
* **不允许重复声明**

#### const 

> const 变量只是保证变量名指向的地址不变，并不保证该地址的数据不变

``` js
const a = []
a.c = 3
```

🧐如果真的想冻结对象，可以使用 Object.freeze

``` js
const b = Object.freeze({})
```

### 第三章 解构赋值

对于 Set 结构，也可以使用数组的解构赋值

``` js
let [a, b, c] = new Set(["a", "b", "c"])
```

只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

``` js
function* fibs() {
    let a = 0;
    let b = 1
    while (true) {
        yield a;
        [a, b] = [b, a + b]
    }
}
var [one, two, three, four, five, six] = fibs()
```

#### 默认值

> 解构函数允许指定默认值

``` js
var [a = 3] = []
// a = 3
```

如果默认值是一个表达式，那么这个表达式是惰性求值的。只有当值是 undefined 的时候，才会去求值。

#### 对象的解构赋值

> 对象解构赋值的内部机制，是先找到同名属性，然后再赋值给对应变量

``` js
var {
    foo: baz,
    bar
} = {
    foo: "aaa",
    bar: "bbb"
}
```

对象的解构赋值可以指定默认值。如果解构失败，变量的值等于 undefined

``` js
let {
    x = 3
} = {}
```

#### 字符串的解构赋值

``` js
const [a, b, c, d, e] = 'hello'
```

🧐类似数组的对象都有 length 属性，因此可以对这个属性解构赋值

``` js
const {
    length: len
} = 'hello'
len // 5
```

#### 数值和布尔值的解构赋值
> 解构赋值时，如果等号右边是数值或者布尔值，则会先转为对象。由于 undefined 和 null 都无法转为对象，所以对他们进行解构赋值会报错。


👇数值和布尔值的包装对象都有toString属性
``` js
let { toString: s } = 123
s === Number.prototype.toString
let { toString: s } = true
s === Boolean.prototype.toString
```

#### 遍历 map 结构
``` js
let map = new Map()
map.set("first", "hello")
map.set("second", "world")
for (let [key, value] of map) {
  console.log(key + " , " + value)
}

for (let [key] of map) {
  console.log(key)
}

for (let [, value] of map) {
  console.log(value)
}
```

### 第四章 字符串的扩展

- includes  
- startsWith
- endsWith
- repeat
- padStart
- padEnd

### 第六章 数值的扩展
- Number.isFinite
- Number.isNaN
- Number.parseInt
- Number.parseFloat
- Number.isInteger
- Number.EPSILON
- Number.isSafeInteger JavaScript能准确表示的整数范围在 -2^53 ~ 2^53 之间
- Number.MAX_SAFE_INTEGER
- Number.MIN_SAFE_INTEGER
- Math.trunc 返回整数部分
- Math.sign  判断正负
- ** 指数运算符 a ** b = a^b

### 第七章 数组的扩展

#### Array.from 将两类对象转换成数组👇
- 类似数组对象 (本质上：必须有 length 属性)
- 可遍历对象

```js
let arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3
}

let arr1 = [].slice.call(arrayLike) // ES5
let arr2 = Array.from(arrayLike)  // ES6
console.log(arr1, arr2)
```

👉扩展运算符也可将某些数据结构转为数组
> 扩展运算符调用的是遍历器接口 Symbol.iterator
```js
function foo() {
  const args = [...arguments]
}

[...document.querySelectorAll('div')]
```

Array.from 接收第二个参数
```js
Array.from(arr, (x) => x * x)
```
#### Array.of
> 将一组值转为数组

**Array** 只有当参数个数不少于2个，Array才返回由参数组成的新数组。参数只有一个时，代表的是数组的长度。 


#### copyWithin(target必须,start可选,end可选)


#### Object.is 

判断俩数是否相等
```js
Object.is(isNaN, isNaN) === true
Object.is(-0, +0) === false
```

**indexOf 内部使用 ==== 进行判断**

#### entries, keys, values

#### includes
```js
[NaN].includes(NaN) //true
```

#### has
Map 的 has 是用来查找键名的
Set 的 has 是用来查找键值的


#### 数组的空位
> 空位表示不含任何值 Array(3) 

Array.from，扩展运算符，entries，keys，values 会将空位转为 undefined


### 第八章 函数的扩展
#### 箭头函数

👇undefined，如果把匿名函数改成箭头函数，返回42 
```js

function foo() {
  setTimeout(function() {
    console.log(this.id)
  }, 100)
}
foo.call({ id: 42 })
```

#### 尾递归

尾调用就是指某个函数的最后一步是调用另一个函数。尾调用不一定出现在函数尾部，只要是最后一步操作即可。
函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用记录上方，还会形成一个B的调用记录。等到B运行结束，将结果返回到A，B的调用记录才会消失。如果函数B内部还调用函数C，那就还有一个C的调用记录栈，以此类推。所有的调用记录，就形成一个“调用栈”（call stack）。
尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。
递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误（stack overflow）。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。

### 第九章 

#### Object.assign 
> 将源对象的所有可枚举属性赋值到目标对象。




### 第14章 Iterator 和 for... of 循环

遍历器是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构，只要部署Iterator接口，就可以完成遍历操作

**Iterator遍历过程**

* 创建一个指针对象，指向当前数据结构的起始位置
* 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
* ... 

每一次调用next方法，都会返回数据结构的当前成员的信息（返回一个包含value和done两个属性的对象）

一个数据结构，只要具有Symbol.iterator属性，就可以认为是可遍历的，调用Symbol.iterator方法，就会得到当前数据接口默认的遍历器生成函数

``` js
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]()
iter.next()
iter.next()
iter.next()
iter.next()
```

首先在构造函数的原型链上部署Symbol.iterator方法，调用该方法会返回遍历器对象iterator，调用该方法的next方法，在返回一个值的时候自动把指针移到下一个实例。

``` js
function Obj(value) {
    this.value = value
    this.next = null
}
Obj.prototype[Symbol.iterator] = function() {
    var iterator = {
        next: next
    }
    var current = this

    function next() {
        if (current) {
            var value = current.value
            var done = current === null
            current = current.next
            return {
                done: false,
                value
            }
        } else {
            return {
                done: true
            }
        }
    }
    return iterator
}
var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)
var four = new Obj(4)
one.next = two
two.next = three
three.next = four
for (var i of one) {
    console.log(i)
}
```

为对象添加Iterator接口

``` js
let obj = {
    data: ['hello', 'world'],
    [Symbol.iterator]() {
        const self = this
        let index = 0
        return {
            next() {
                if (index < self.data.length) {
                    return {
                        value: self.data[index++],
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }
}
```

类似数组对象调用数组的Symbol.iterator方法

``` js
let iterator = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    length: 4,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
}
for (let iterm of iterable) {
    console.log(item)
}
```

#### 调用Iterator接口的场合

**解构赋值**

**扩展运算符**
只要某个数据结构部署了Iterator接口，就可以对他使用扩展运算符，转换为数组

#### 字符串的Iterator接口

``` js
var iterator = someString[Symbol.iterator]()
```

#### iterator接口与generator函数

``` js
var myIterator = {}
myIterator[Symbol.iterator] = function*() {
    yield 1;
    yield 2;
    yield 3;
}
var c = [...myIterator]
```

或者

``` js
let obj = {
    *[Symbol.iterator]() {
        yield 'hello';
        yield 'world'
    }
}
```

javascript 原有的for... in 循环，只能获得对象的键名，不能直接获取键值，for... of 可以获取键值

### 第16章 Promise 对象

> promise 是一个对象，用来传递异步操作的消息

* promise 构造函数接受一个函数作为参数，该函数的两个参数分别是resolve，reject

``` js
var promise = new Promise(function(resolve, reject) {
    if ( /* 异步操作成功*/ ) {
        resolve(value)
    } else {
        reject(error)
    }
})
```

* promise实例生成之后，可以用then方法指定resolved和rejected状态的回调函数

``` js
promise.then(function(value) {
    // success
}, function(value) {
    // failue
})
```

#### Promise.prototype.catch()

> .then(null, rejection) 的别名，用于指定发生错误时的回调

#### Promise.all()

promise.all 用于将多个promise实例包装成一个新的promise实例。Promise.all 方法的参数不一定是数组，但是必须具有Iterator接口，且返回的每一个成员都是Promise实例

``` js
var p = Promise.all([p1, p2, p3])

var promises = [2, 3, 5, 7, 11, 13].map(function(id) {
    return getJSON("/post/" + id + ".json")
})
Promise.all(promises).then(function(posts) {

}).catch(function(reason) {

})
```

promise对象的错误就有冒泡性质，会一直向后传递，直到被捕获为止

> 一般不要在then方法中定义rejected状态的回调函数，而应总是使用catch方法，理由是更接近同步写法。

### 第17章 异步操作和 async 函数

ES6 前，异步编程方法：

* 回调函数
* 事件监听
* 发布/订阅
* promise 对象

** promise最大的问题是代码冗余，原来的任务被promise包装了一下，不管什么操作，一眼看上去都是一堆then，原来的语义变得很不清楚**

``` js
function* gen(x) {
    var y = yield x + 2
    return y
}
var g = gen(1)
g.next()
g.next()
```

调用 generator函数会返回一个内部指针（即遍历器）g，这是generator函数不同于普通函数的另一个地方，即执行他不会返回结果，返回的是指针对象
next方法的作用是分阶段执行generator函数，每次调用next方法，会返回一个对象，表示当前阶段的信息

#### generator函数的数据交换和错误处理

下面代码中，第一个next方法的value属性，返回表达式x+2的值，第二个next方法带有参数2，这个参数可以传入generator函数，作为上个阶段异步任务的返回结果被函数体内的y接收。因此，这一步value属性返回的就是2

``` js
function* gen(x) {
    var y = yield x + 2
    return y
}
var g = gen(1)
g.next()
g.next(2)
```

generator函数可以部署错误处理代码，捕获函数体外抛出的错误

``` js
function* gen(x) {
    try {
        var y = yield x + 2
    } catch (e) {
        console.log(e)
    }
    return y
}
var g = gen(1)
g.next()
g.throw('出错了')
```

**generator函数将异步操作表示得很简洁，但是流程管理却不方便**

### 第18章 Class

``` js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    toString() {
        return '(' + this.x + ',' + this.y + ')'
    }
}
// typeof Point === "function" true
// Point === Point.prototype.constructor true
```

类的所有方法都定义在类的prototype属性上。在类的实例上调用方法，实际是在调用类的原型上方法。
类的内部定义的所有方法都是不可枚举的

**constructor方法**
constructor方法是类的默认方法， 通过new命令生成对象实例时自动调用该方法，constructor方法默认返回实例对象（this），也可以指定返回另外一个对象

``` js
class Foo {
    constructor() {
        return Object.create(null)
    }
}
// new Foo() instanceof Foo false
```

#### class 表达式

``` js
let person = new class {
    constructor(name) {
        this.name = name
    }
    sayName() {
        console.log(this.name)
    }
}('zhang san')
person.sayName()
```

#### class 继承

``` js
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.color = color
    }
    toString() {
        return this.color + ' ' + super.toString()
    }
}
```

super 指代父类的实例（即父类的this对象）
子类必须在constructor方法中调用super对象，否则新建实例会报错。这是因为子类没有自己的this对象，而是继承了父类的this对象，然后对其加工。如果不调用super方法，子类就得不到this对象

#### 类的prototype属性和 __proto__ 属性

* 子类的__proto__ 属性表示构造函数的继承，指向父类
* 子类的prototype属性的__proto__表示方法的继承，指向父类的prototype属性。

``` js
class A {}
class B extends A {}
B.__proto__ === A
B.prototype.__proto__ === A.prototype
```

#### Object.getPrototypeOf()

Object.getPrototypeOf()方法可用于从子类上获取父类

#### 原生构造函数的继承

原生构造函数式语言内置的构造函数，通常用来生成数据结构

* Boolean()
* Number()
* String()
* Array()
* Date()
* Function()
* RegExp()
* Error()
* Object()

#### class 取值函数（getter）和存值函数（setter）

``` js
class MyClass {
    constructor() {}
    get prop() {
        return 'getter'
    }
    set prop(value) {
        console.log('setter：' + value)
    }
}
let inst = new MyClass()
inst.prop = 123
inst.prop
```

#### class 的 Generator 方法

如果在某个方法钱加上星号（*），就表示该方法时一个generator函数

``` js
class Foo {
    constructor(...args) {
            this.args = args
        }
        *[Symbol.iterator]() {
            for (let arg of this.args) {
                yield arg
            }
        }
}
for (let x of new Foo('hello', 'world')) {
    console.log(x)
}
```

#### class 的静态方法

类相当于实例的原型，所有在类中定义的方法都会被实例继承。如果在一个方法前加上static关键字，就表示该方法不会被实例继承，而是直接通过类调用，称为“静态方法”

``` js
class Foo {
    static classMethod() {
        return 'hello'
    }
}

class Bar extends Foo {
    static classMethod() {
        return super.classMethod() + ', too'
    }
}
```

#### new.target 属性

new.target 返回 new 命令作用的构造函数

### 第20章 Module

* CommonJS 用于服务器
* AMD 用于浏览器

ES6 模块的设计思想是尽量静态化，使得编译时就能确定模块的依赖关系，以及输入输出变量。CommonJS和AMD都只能在运行时确定这些东西

* CommonJS模块就是对象，输入时必须查找对象属性

``` js
// 运行时加载
let {
    stat,
    exists,
    readFile
} = requre('fs')
```

* ES6 模块不是对象，而是通过export命令显示指定输出的代码，输入时也采用静态命令的形式

``` js
// 编译时加载
import {
    stat,
    exists,
    readFile
} from 'fs'
```

* export 使用 as 重命名

``` js
export {
    v1 as streamV1,
    v2 as streamV2
}
```

* import 使用 as 重命名

``` js
import {
    lastname as surname
} from './profile'
```

* import 命令具有提升效果，会提升到模块的头部首先执行。

``` js
export {
    es6 as
    default
}
from './someModule' ===
    => 等价
import {
    es6
} from './someMudule'
export default es6
```

* 整体加载

``` js
import * as circle from './circle'
```

#### ES6 模块加载的实质

CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用。

#### 循环加载

* require 命令第一次加载脚本就会执行整个脚本，然后内存中生成一个对象。CommonJS对待循环加载，只会输出已经执行的部分，还未执行的部分不会输出

