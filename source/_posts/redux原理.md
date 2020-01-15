---
title: redux原理
date: 2020-01-15 18:55:49
tags:
---

[原文链接](https://github.com/brickspert/blog/issues/22)
<!-- more -->

```js
// 修改count值后，使用count的地方都能收到通知。使用发布-订阅模式
let state = {
  count: 1
}

let listeners = []
function subscribe(listener) {
  listeners.push(listener)
}

function changeCount(count) {
  state.count = count
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }
}


subscribe(() => {
  console.log(state.count)
})

changeCount(2)
changeCount(3)
changeCount(4)

```


```js
const createStore = function (initState) {
  let state = initState
  let listeners = []
  function subscribe(listener) {
    listeners.push(listener)
  }
  function changeState(newState) {
    state = newState
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }
  function getState() {
    return state
  }
  return {
    getState,
    changeState,
    subscribe
  }
}
```


```js
function plan(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}

const createStore = function (plan, initState) {
  let state = initState
  let listeners = []
  function subscribe(listener) {
    listeners.push(listener)
  }
  function changeState(action) {
    state = plan(state, action)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }
  function getState() {
    return state
  }
  return {
    subscribe,
    getState,
    changeState
  }
}
```