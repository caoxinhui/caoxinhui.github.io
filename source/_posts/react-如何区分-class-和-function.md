---
title: react 如何区分 class 和 function
date: 2020-02-29 13:11:20
tags:
categories: 
---

常规 React 组件的定义方式

```js
function Greeting() {
    return <p>Hello</p>
}

class Greeting extends React.Component{
    render(){
        return <p>Hello</p>
    }
}
```

如果 Greeting 是一个函数，React 需要调用它

```js
function Greeting() {
    return <p>Hello</p>
}

const result = Greeting(props)
```

但如果 Greeting 是一个类，React 需要先用 new 操作符将其实例化，然后 调用刚才生成实例的 render 方法：

```js
class Greeting extends React.Component{
    render(){
        return <p>Hello</p>
    }
}

const instance = new Greeting(props)
const result = instance.render()
```


只要在函数调用前加上 new 操作符，你就可以把任何函数当做一个类的构造函数来用

```js
function Person(name) {
    this.name = name
}
//创建一个 {} 对象并把 Person 中的 this 指向那个对象，以便我可以通过类似 this.name 的形式去设置一些东西，然后把这个对象返回给我
const fred = new Person("fred") // Person { name: 'fred' }
const geroge = Person("geroge") // undefined
```

new 操作符同时也把我们放在 Person.prototype 上的东西放到了 fred 对象上

```js
function Person(name) {
    this.name = name
}
const fred = new Person("fred") // Person { name: 'fred' }
Person.prototype.sayHi = function () {
    console.log("hello, I' m " + this.name)
}
fred.sayHi()
```


通过类来实现相同的功能

```js
class Person {
    constructor(name) {
        this.name = name
    }
    sayHi(){
        console.log("hello, I'm " + this.name)
    }
}

const fred = new Person("fred")
fred.sayHi()
```
- 对于类，如果忘记加 new ，会导致程序报错
- 对于函数，如果忘记加 new ，会导致 this 指向全局或者 undefined

| | new Person() | Person() |
|  ----  | ----  |   ----  |  
| class  | ✅this 是一个 Person 实例 | ❌TypeError |
| function  | ✅this 是一个 Person 实例 | ⚠️this 是 window 或 undefined |


如果 React 每次调用前都加 new 会怎么样呢？

对于箭头函数，会抛出一个错误

```js
const Greeting = () => <p>Hello</p>;
new Greeting(); // 🔴 Greeting 不是一个构造函数
```


- 箭头函数的一个附带作用是它没有自己的 this 值 —— this 解析自离得最近的常规函数

- 箭头函数没有 this，意味着他作为构造函数是无用的。

- 箭头函数没有 prototype
```js
(()=>{}).prototype
(function () {}).prototype
```

另一个我们不能总是使用 new 的原因是它会妨碍 React 支持返回字符串或其它原始类型的组件。
```js

function Greeting() {
    return 'Hello'
}
console.log(Greeting())  // Hello
console.log(new Greeting()) // Greeting {}
```


如果一个函数的返回值不是一个对象，它会被 new 完全忽略。如果你返回了一个字符串或数字，就好像完全没有 return 一样

```js
function Answer() {
    return 42;
}

Answer(); // ✅ 42
new Answer(); // 🔴Answer {}
```

检查 Greeting 是否是一个 React 组件类的最符合语言习惯的方式是测试 Greeting.prototype instanceof React.Component
```js

class A {}
class B extends A {}

console.log(B.prototype instanceof A); // true
```

一个函数的 prototype 并不指向他的原型，
```js

function Person() {}
Person.prototype // Person {} 🔴 不是 Person 的原型
Person.__proto__  // f(){[native code]} ✅ Person 的原型

```

因此「原型链」更像是 __proto__.__proto__.__proto__ 而不是 prototype.prototype.prototype

那么函数和类的 prototype 属性又是什么？是用 new 调用那个类或函数生成的所有对象的 __proto__

```js

function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function() {
    alert('Hi, I am ' + this.name);
}

var fred = new Person('Fred'); // 设置 `fred.__proto__` 为 `Person.prototype`
```

```js

class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}

let c = new Greeting();
console.log(c.__proto__); // Greeting.prototype
console.log(c.__proto__.__proto__); // React.Component.prototype
console.log(c.__proto__.__proto__.__proto__); // Object.prototype

c.render();      // 在 c.__proto__ (Greeting.prototype) 上找到
c.setState();    // 在 c.__proto__.__proto__ (React.Component.prototype) 上找到
c.toString();    // 在 c.__proto__.__proto__.__proto__ (Object.prototype) 上找到
```
