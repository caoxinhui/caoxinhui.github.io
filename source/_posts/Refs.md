---
title: Refs
date: 2020-02-13 20:23:51
tags:
categories: 基础
---

### 本篇介绍 Refs 基础知识
<!-- more -->

### this.inputText.current 指代 input DOM

```js
class Next extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  componentDidMount() {
    console.log(this.input.current);
  }
  render() {
    return <input ref={this.input} />;
  }
}

```

### ref 可以直接添加到 组件上，ref.current 可以直接调用组件的方法

**仅在 Child 是 class 组件时有用**

**函数式组件没有实例**

```js
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = React.createRef();
  }
  componentDidMount() {
    console.log(this.inputText.current.click());
  }
  render() {
    return <Child ref={this.inputText} />;
  }
}

class Child extends React.Component {
  click() {
    console.log("clicked");
  }
  render() {
    return <input />;
  }
}
```

### 使用 forwardRef 使函数式组件可以实现 将 ref 传递给它的一个自组件

```js
function App() {
  const ref = React.createRef();

  return <FancyButton ref={ref} content={"hello"} />;
}

const FancyButton = React.forwardRef((props, ref) => {
  return <div ref={ref}>{props.content}</div>;
});

```


### 函数式组件使用ref

```js
function Func() {
  const inputRef = React.createRef()
  useEffect(()=>{
    console.log(inputRef.current)
  },[])
  return <input ref={inputRef}/>
}
```

### 回调 ref
> 它能助你更精细地控制何时 refs 被设置和解除。你会传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问
回调 ref 可直接通过 this.inputText 访问，而不是在 this.inputText.current 上访问 
```js
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = null;
  }
  componentDidMount() {
    this.inputText.value = "hello";
  }
  render() {
    return <Child InputRef={el => (this.inputText = el)} />;
  }
}
```



React 会在组件挂载时给 current 属性传入 DOM 元素，并在组件卸载时传入 null 值。ref 会在 componentDidMount 或componentDidUpdate 生命周期钩子触发前更新


###  组件间传递回调形式ref

**this.inputText 指代了 input DOM**
```js
const Child = props => {
  return <input ref={props.InputRef} />;
};

// 在父组件中，inputText 就是 子组件的引用
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = null;
  }
  componentDidMount() {
    this.inputText.value = "hello";
  }
  render() {
    return <Child InputRef={el => (this.inputText = el)} />;
  }
}
```