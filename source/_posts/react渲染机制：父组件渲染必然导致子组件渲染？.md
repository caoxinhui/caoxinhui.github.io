---
title: react渲染机制：父组件渲染必然导致子组件渲染？
date: 2020-02-10 23:21:18
tags:
categories: 基础
---

在项目中，由于父组件的方法会监听父组件离页面顶部的高度，所以滚动过程中，父组件一直会重新渲染
如题：父组件 re-render 一定会导致子组件 re-render 吗？

<!-- more -->

一些情况下，我们并不希望子组件受到父组件 re-render 的影响
- 子组件无状态渲染
- 父组件传给子组件的 props 没有变化

### 父组件渲染，如何保持子组件状态不受影响

- shoudComponentUpdate
```js
class FancyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  handleClick = () => {
    const nowWrod = this.state.count;
    this.setState({ count: nowWrod });
  };
  render() {
    return (
      <>
        <button type="button" onClick={this.handleClick}>
          {this.state.count}
        </button>
        <NumberTemp count={this.state.count} />
      </>
    );
  }
}

class NumberTemp extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.count === nextProps.count) {
      return false;
    }
    return true;
  }
  render() {
    console.log("render");
    return <div>{this.props.count}</div>;
  }
}
```
 如果是引用类型的数据，只会比较是不是同一个地址，而不会比较数据值是否是一样的🤔
 👇例子中，组件始终不会 re-render，因为 this.state.count 值与 nextState.count 值始终保持一致。
 ```js
class FancyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: ["rapper"] };
  }
  handleClick = () => {
    const words = this.state.count;
    words.push("hello ");
    this.setState({ count: words });
  };
  render() {
    return (
      <>
        <button type="button" onClick={this.handleClick}>
          {this.state.count}
        </button>
        <NumberTemp count={this.state.count} />
      </>
    );
  }
}

class NumberTemp extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.count === nextProps.count) {
      return false;
    }
    return true;
  }
  render() {
    return <div>{this.props.count}</div>;
  }
}

 ```
如果想让数据变化，`const words = this.state.count;` 改为 const words = this.state.count.slice(0)，就行了，因为改变了引用地址。



- React.memo

```js
class FancyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  handleClick = () => {
    const words = this.state.count;
    this.setState({ count: words });
  };
  render() {
    return (
      <>
        <button type="button" onClick={this.handleClick}>
          {this.state.count}
        </button>
        <MemoNumb count={this.state.count} />
      </>
    );
  }
}

const NumberTemp = props => {
  console.log("render");
  return <div>{props.count}</div>;
};

const MemoNumb = React.memo(NumberTemp);

```

引用数据类型，子组件中的count值不改变
```js
class FancyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: ["wrapper"] };
  }
  handleClick = () => {
    const words = this.state.count;
    words.push("hello ");
    this.setState({ count: words });
  };
  render() {
    return (
      <>
        <button type="button" onClick={this.handleClick}>
          {this.state.count}
        </button>
        <MemoNumb count={this.state.count} />
      </>
    );
  }
}
const NumberTemp = props => {
  return <div>{props.count}</div>;
};
function areEqual(prevProps, nextProps) {
}
const MemoNumb = React.memo(NumberTemp, areEqual);
```
