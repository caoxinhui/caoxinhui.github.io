---
title: Redux
date: 2020-04-04 14:54:04
tags:
categories: 极客时间
---

redux的核心概念，全局 store，所有的状态都会放在store中

产生 store，其中reducer是一个纯函数
`const store = createStore(reducer)
`
<!-- more -->

store的三个方法
1. getState()
2. dispatch(action)
UI上点击了一个button，可能产生一个action，store可以把它dispatch出去，dispatch给reducer，reducer是真正处理action的，并更新store
3. subscribe(listener)
监听store的变化，store有任何变化都会调用他的 callback-> listener
4. replaceReducer(nextReducer) 
更新当前store里的reducer


### 理解action
描述行为
```js
{
    type:ADD_TODO,
    text:'Build my first Redux app'
}
```

### 理解reducer
```js
function todoApp(state = initialState, action) {
    switch (action.type) {
        case ADD_TODO:
            return Object.assign({}, state, {
                todos: [
                    ...state.todos, {
                        text: action.text,
                        completed: false
                    }]
            })
      default:
        return store
    }
}
```
![flux](https://s3.amazonaws.com/media-p.slid.es/uploads/364812/images/2473907/ARCH-Classic-Flux__2_.png)
![redux](https://s3.amazonaws.com/media-p.slid.es/uploads/364812/images/2484555/ARCH-Redux2.png)
![redux状态流](https://s3.amazonaws.com/media-p.slid.es/uploads/364812/images/2484552/ARCH-Redux2-real.gif)



```js
(state,action)=>new state
```


### 理解 combineReducers
工具函数
```js
export default function todos(state = [], action) {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([action.text])
        default:
            return state
    }
}
export default function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}
import {combineReducers} from 'redux'
import todos from './todos'
import counter from './counter'

export default combineReducers({
    todos,
    counter
})
```

### 理解 bindActionCreators
```js
function addTodoWithDispatch(text) {
    const action = {
        type: ADD_TODO,
        text
}
    dispatch(action);
}

dispatch(addTodo(text))
dispatch(completeTodo(index))

const boundAddTodo = text => dispatch(addTodo(text));
const boundCompleteTodo = index => dispatch(completeTodo(index));
```

```js
function bindActionCreator(actionCreator, dispatch) {
    return function () {
        return dispatch(actionCreator.apply(this, arguments));
    };
}

function bindActionCreators(actionCreators, dispatch) {
    const keys = Object.keys(actionCreators);
    const boundActionCreators = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const actionCreator = actionCreators[key];
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
    }
    return boundActionCreators;
}
```


```js
import React from "react";
import {
  createStore,
  combineReducers,
  bindActionCreators
} from "redux";

function run() {
  // Store initial state
  const initialState = { count: 0 };

  // reducer
  const counter = (state = initialState, action) => {
    switch (action.type) {
      case "PLUS_ONE":
        return { count: state.count + 1 };
      case "MINUS_ONE":
        return { count: state.count - 1 };
      case "CUSTOM_COUNT":
        return {
          count: state.count + action.payload.count
        };
      default:
        break;
    }
    return state;
  };

  const todos = (state = {}) => state;

  // Create store
  const store = createStore(
    combineReducers({
      todos,
      counter
    })
  );

  // Action creator
  function plusOne() {
    // action
    return { type: "PLUS_ONE" };
  }

  function minusOne() {
    return { type: "MINUS_ONE" };
  }

  function customCount(count) {
    return { type: "CUSTOM_COUNT", payload: { count } };
  }

  plusOne = bindActionCreators(plusOne, store.dispatch);

  store.subscribe(() => console.log(store.getState()));
  // store.dispatch(plusOne());
  plusOne();
  store.dispatch(minusOne());
  store.dispatch(customCount(5));
}
export default () => (
  <div>
    <button onClick={run}>Run</button>
    <p>* 请打开控制台查看运行结果</p>
  </div>
);

```


### 将组件 connect 到 store 上
```js
import {connect} from 'react-redux'

class SidePanel extends Comment {

}

function mapStateToProps(state) {
    return {
        nextgen: state.nextgen,
        router: state.router,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...actions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
```

```js
import React from "react";
import { bindActionCreators, createStore } from "redux";
import { Provider, connect } from "react-redux";

// Store initial state
const initialState = { count: 0 };

// reducer
const counter = (state = initialState, action) => {
  switch (action.type) {
    case "PLUS_ONE":
      return { count: state.count + 1 };
    case "MINUS_ONE":
      return { count: state.count - 1 };
    case "CUSTOM_COUNT":
      return { count: state.count + action.payload.count };
    default:
      break;
  }
  return state;
};

// Create store
const store = createStore(counter);

// Action creator
function plusOne() {
  // action
  return { type: "PLUS_ONE" };
}

function minusOne() {
  return { type: "MINUS_ONE" };
}

export class Counter extends React.Component {
  render() {
    const { count, plusOne, minusOne } = this.props;
    return (
      <div className="counter">
        <button onClick={minusOne}>-</button>
        <span style={{ display: "inline-block", margin: "0 10px" }}>
          {count}
        </span>
        <button onClick={plusOne}>+</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    count: state.count
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ plusOne, minusOne }, dispatch);
}

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

export default class CounterSample extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedCounter />
      </Provider>
    );
  }
}

```


### 异步action
![redux异步请求](https://s3.amazonaws.com/media-p.slid.es/uploads/364812/images/2484714/ARCH-Redux2-extended-api.png)

### redux 中间件（Middleware）
1. 截获 action
2. 发出 action




