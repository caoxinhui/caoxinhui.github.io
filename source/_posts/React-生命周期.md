---
title: React 生命周期
date: 2020-02-14 11:32:17
tags:
categories: 基础
---

本文对 React 生命周期以及 setState 在各个生命周期中的使用作整理。
<!-- more -->

### UNSAFE_componentWillMount

### render
render 函数必须是纯的，没有任何副作用
在 render 中调用 setState 会产生无限循环

### componentDidMount
compentDidMount 方法会在元素 mount 之后 立即执行。调用 setState ，会引起另一次渲染

### UNSAFE_componentWillReceiveProps(nextProps)

### static getDerivedStateFromProps
它在 render 之前执行，getDerivedStateFromProps 返回一个对象 去更新 state。

### shouldComponentUpdate(nextProps, nextState)
**Should I re-render my component ？**
当组件的 state 或者 props 改变，但是不想组件 重新渲染的时候 使用。shouldComponentUpdate 是为了让 react 知道，组件不会被 state 或者 props 的改变影响。改变 state 或者 props 的时候不想让组件更新的时候可以使用这个生命周期。
在这个生命周期中不能 setState 。


### UNSAFE_componentWillUpdate(nextProps, nextState)
getSnapshotBeforeUpdate(prevProps, prevState)


### getSnapshotBeforeUpdate

```js
class FancyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return prevProps;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(snapshot);
  }
  render() {
    return (
      <button type="button" onClick={this.handleClick}>
        {this.state.count}
      </button>
    );
  }
}

```
### componentDidUpdate(prevProps, prevState)
可以在 componentDidUpdate 中 setState， 但是 必须被终止条件包裹，否则会引起无限循环

### componentWillUnmount


### forceUpdate
👇例子中 必须要对方法 bind this [why](https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/)
forceUpdate 直接对组件进行 re-render
forceUpdate 将跳过 shouldComponentUpdate 生命周期。但是对子组件，还是会正常触发生命周期的，包括 shouldComponentUpdate
```js
class FancyButton extends React.Component {
  constructor() {
    super();
    // 这里必须要bind this，否则会报错 🤔
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.forceUpdate();
  }
  render() {
    return (
      <div ref={this.refCallback} style={{ border: "1px solid red" }}>
        <button onClick={this.handleClick} />
        {Math.random()}
      </div>
    );
  }
}
```

### 为什么 react class component 中的方法，需要 bind this

- 如果不绑定 this，代码如下👇

```js
class FancyButton extends React.Component {
  handleClick() {
    console.log(this);
  }
  render() {
    return (
      <>
        <button onClick={this.handleClick}>hello</button>
      </>
    );
  }
}
```
打印内容
- 在严格模式下：undefined
- 非严格模式下：全局对象
![image.png](http://ww1.sinaimg.cn/large/92babc53gy1gbvysmvugpj20t605o74u.jpg)
handleClick 丢失了上下文 和 this 的值

原理同👇
```js
class Foo {
  constructor(name){
    this.name = name
  }
  
  display(){
    console.log(this.name);
  }
}

var foo = new Foo('Saurabh');
foo.display(); // Saurabh

var display = foo.display; 
display(); // TypeError: this is undefined
```
