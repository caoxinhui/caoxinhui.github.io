---
title: redux原理
date: 2020-01-15 18:55:49
tags:
---

本文介绍了 react-imvc 和 redux 对状态更新的原理

## react-imvc 状态原理

首先回顾一下 react-imvc 更新状态的使用方法。

将 更新状态的方法，放到 `this.store.actions` 中，例如 `UPDATE_COUNT_DOWN_DATA` 方法，然后通过 `UPDATE_COUNT_DOWN_DATA(countDownList)` 执行方法 `UPDATE_COUNT_DOWN_DATA` 中的方法。
其中，UPDATE_COUNT_DOWN_DATA 方法中的第一个参数是全局的state状态，后面一个参数就是传入的参数。 

``` js
const UPDATE_COUNT_DOWN_DATA = (state, payload) => {
    const {
        countdownlist
    } = payload
    return {
        ...state,
        countdownlist
    }
}
```

这样就增加了一个全局的状态countdownlist

<!-- more -->

## redux 状态管理

[redux原理原文链接](https://github.com/brickspert/blog/issues/22)

### 状态值 只有 count 值

``` js
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

### 将 count 值调整为 initState

``` js
const createStore = function(initState) {
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

### 对状态约束，只允许通过 action 操作。（明确改动范围）

``` js
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

const createStore = function(plan, initState) {
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

#### 使用

``` js
let initState = {
    count: 0
}
let store = createStore(plan, initState)
store.subscribe(() => {
    let state = store.getState()
    console.log(state.count)
})
store.changeState({
    type: 'INCREMENT'
})
store.changeState({
    type: 'DECREMENT'
})
```

### 多文件协作

``` js
let state = {
    counter: {
        count: 0
    },
    info: {
        name: '',
        description: ''
    }
}

function counterReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
                count: state.count + 1
            }
            case 'DECREMENT':
                return {
                    count: state.count - 1
                }
                default:
                    return count
    }
}

function InfoReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.name
            }
            case 'SET_DESCRIPTION':
                return {
                    ...state,
                    description: action.description
                }
                default:
                    return state
    }
}

const reducer = combineReducers({
    counter: counterReducer,
    info: InfoReducer
})

function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducer)
    return function combination(state = {}, action) {
        const nextState = {}
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i]
            const reducer = reducers[key]
            const previousStateForKey = state[key]
            const nextStateForKey = reducer(previousStateForKey, action)
            nextState[key] = nextStateForKey
        }
        return nextState
    }
}
```

#### 使用

``` js
const reducer = combineReducers({
    counter: counterReducer,
    info: InfoReducer
})
let initState = {
    counter: {
        count: 0
    },
    info: {
        name: '',
        description: ""
    }
}
let store = createStore(reducer, initState)
store.subscribe(() => {
    let state = store.getState()
    console.log(state.counter.count, state.info.name, state.info.description)
})
// 这里 dispatch 同前面 changeState
store.dispatch({
    type: 'INCREMENT'
})
store.dispatch({
    type: 'SET_NAME',
    name: ''
})
```

### state 拆分与合并

``` js
let initState = {
    count: 0
}

function countReducer(state, action) {
    if (!state) {
        state = initState
    }
    switch (action.type) {
        case 'INCREMENT':
            return {
                count: state.count + 1
            }
            default:
                return state
    }
}

const createStore = function(reducer, initState) {
    let state = initState
    let listeners = []

    function subscribe(listener) {
        listeners.push(listener)
    }

    function dispatch(action) {
        state = reducer(state, action)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener()
        }
    }

    function getState() {
        return state
    }
    dispatch({
        type: Symbol()
    })
    return {
        subscribe,
        dispatch,
        getState
    }
}
```

### 中间件 middleware

> 中间件是对dispatch的扩展

