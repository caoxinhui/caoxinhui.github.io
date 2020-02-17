---
title: Typescript
date: 2019-12-28 17:52:28
tags: Typescript
---

## Typescript 学习教程

<!-- more -->

### typescript 通过类型注解提供编译时的静态类型检查

``` js
// 声明数组
let arr: number[] = [1, 2]
// 数组泛型
let arr: Array < number > = [1, 2]

// 元祖：表示已知元素数量和类型的数组
let x: [string, number]
x = ["Runoob", 1]

// 枚举，用于定义数值集合
enum Color {
    Red,
    Green,
    Blue
}
let c: Color = Color.Blue
```

### typescript 变量声明

``` js
var [变量名]: [类型] = 值
```

### 类型断言 （Type Assertion）

``` js
< 类型 > 值

值 as 类型
```

### 带参数函数

``` js
function func_name(param1[: datatype], param2[: datatype]) {}

function add(x: number, y: number): number {
    return x + y
}

// 可选参数 若我们定义了参数，则必须要传入这些参数，除非讲参数设为可选，可选参数使用问号标识
function buildName(firstName: string, lastName ? : string) {}

// 默认参数
function function_name(param1[: type], param2[: type] = default_value) {}

function calculate_discount(price: number, rate: number = 0.5) {}

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {}

function addNumbers(...nums: number[]) {}

// 函数重载 方法名字相同，而参数不同，返回类型可以相同也可以不相同
```

### 联合类型(通过管道将变量设置成多种类型，赋值时可以根据设置的类型来赋值)

``` js
Type1 | Type2 | Type3
```

### 接口(一系列抽象方法的声明，一些方法特征的集合)

``` js
interface IPerson {
    firstName: string,
        lastName: string,
        sayHi: () => string
}

var customer: IPerson = {
    firstName: "Tom",
    lastName: "Hanks",
    sayHi: (): string => {
        return "Hi there"
    }
}

console.log(customer.firstName)
console.log(customer.sayHi())
```

### 联合类型和接口

``` js
interface RunOptions {
    program: string
    commandline: string[] | string | (() => string)
}
var options: RunOptions = {
    program: "text1",
    commandline: "Hello"
}
var options: RunOptions = {
    program: "text1",
    commandline: ["Hello", "world"]
}
var options: RunOptions = {
    program: "text1",
    commandline: () => {
        return "**Hello world**"
    }
}
```

### 接口和数组

``` js
interface namelist {
    [index: number]: string
}
var list2: namelist = ["John", "s", "Bran"]
interface ages {
    [index: string]: number
}
var agelist: ages
```

### 接口继承（接口可以通过其他接口来扩展自己）

``` js
// 单接口继承
child_interface_name extends super_interface_name
// 多接口继承
child_interface_name extends super_interface1_name, super_interface2_name, ..., super_interfaceN_name
// 单继承
interface Person {
    age: number
}
interface Musician extends Person {
    instrument: string
}
var drummer = < Musician > {};
```

``` js
// 多继承
interface IParent1 {
    v1: number
}
interface IParent2 {
    v2: number
}
interface Child extends IParent1, IParent2 {}
var Iobj: Child = {
    v1: 12,
    v2: 23
}

class Car {
    engine: string
    constructor(engine: string) {
        this.engine = engine
    }
    disp(): void {

    }
}

// 继承类的方法重写
class PrinterClass {
    doPrint(): void {}
}
class StringPrinter extends PrinterClass {
    doPrint(): void {
        super.doPrint()
    }
}

// static 关键字用于定义类的数据成员为静态的，静态成员可以通过类名调用
class StaticMem {
    static num: number
    static disp(): void {}
}
```

### 访问控制修饰符

  + public 公有，可以在任何地方被访问
  + protected 受保护的，可以被其自身以及其子类和父类访问
  + private 私有，只能被其定义所在的类访问

### typescript 模块

我们使用 ` |= ` 来添加一个标志
组合使用 ` &= ` 和 ` ~ ` 来清理一个标志
使用 ` | ` 来合并标志 

## [官方文档](https://www.tslang.cn/docs/handbook/basic-types.html)

### 基础类型

* 数组

定义方式有如下两种：

``` js
    let list: number[] = [1, 2, 3]
```

``` js
let list: Array < number >= [1, 2, 3]
```

* 元组 Tuple

> 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

``` js
let list: [string, number]
```

当访问一个越界的元素，会使用联合类型替代

* 类型断言
👇尖括号语法
```js
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
👇as 语法
```js
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```
👇给对象元素指定类型
```js
let {a, b}: {a: string, b: number} = o;
```

* 类类型
