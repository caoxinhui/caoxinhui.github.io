---
title: redux原理
date: 2020-01-15 18:55:49
tags:
---

本文介绍了 react-imvc 和 redux 对状态更新的原理

<!-- more -->

## redux 状态管理

[redux原理原文链接](https://github.com/brickspert/blog/issues/22)

### 状态值 只有 count 值

```js
// 修改count值后，使用count的地方都能收到通知。使用发布-订阅模式
let state = {
    count: 1
}

let listeners = []

function subscribe(listener){
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

```js
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

```js
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

```js
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
        case 'INCRE':
            return {
                count: state.count + 1
            }
        case 'DECRE':
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

const reducers = combineReducers({
    counter: counterReducer,
    info: InfoReducer
})

function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers)
    return function combination(state, actions) {
        const nextState = {}
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i]
            const reducer = reducers[key]
            const previousState = state[key]
            const nextStateForKey = reducer(previousState, actions)
            nextState[key] = nextStateForKey
            state[key] = nextStateForKey
        }
        return nextState
    }
}

let listeners = []

function subscribe(listener) {
    listeners.push(listener)
}
subscribe(() => {
    console.log(state)
})


function changeCount() {
    const newState = reducers(state, {type: 'INCRE'})
    for (let i = 0; i < listeners.length; i++) {
        listeners[i]()
    }
}

changeCount()


```

#### 使用

```js
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

```js
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

createStore(reducers[,initialState])
reducer(previousState,action)=>newState


```js
const createStore = function (reducer, initState) {
    let state = initState
    let listeners = []

    function subscribe(listener) {
        listeners.push(listener)
    }

    function dispatch(action) {
        state = reducer(state, action)
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
        }
    }

    function getState() {
        return state
    }

    dispatch({type: Symbol()})

    return {
        subscribe,
        dispatch,
        getState
    }
}
let state = {

    count: 0

}


function counterReducer(state, action) {
    switch (action.type) {
        case 'INCRE':
            return {
                count: state.count + 1
            }
        case 'DECRE':
            return {
                count: state.count - 1
            }
        default:
            return state
    }
}

const loggerMiddleware = (action) => {
    console.log('this state', store.getState());
    console.log('action', action);
    next(action);
    console.log('next state', store.getState());
}

const exceptionMiddleware = (next) => (action) => {
    try {
        next(action)
    } catch (e) {
        console.error(e)
    }
}
const store = createStore(counterReducer, state)
const next = store.dispatch

store.dispatch = exceptionMiddleware(loggerMiddleware)

store.dispatch({
    type: 'INCRE'
})

```

## react-imvc 状态管理

```js
const createStore = function (reducer, initState) {
    let state = initState
    let listeners = []

    function subscribe(listener) {
        listeners.push(listener)
    }

    function dispatch(action) {
        state = reducer(state, action)
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
        }
    }

    function getState() {
        return state
    }

    dispatch({type: Symbol()})
    subscribe((data) => {
        dispatch({
            type: data.actionType,
            payload: data.actionPayload
        })
    })
    return {
        subscribe,
        dispatch,
        getState
    }
}
let state = {
    count: 0
}

```
