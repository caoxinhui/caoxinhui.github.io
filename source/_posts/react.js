const state={filter:'completed',todos:['Learn React']}
const newState={...state,todos:[...state.todos,'Learn Redux']}
const newState2 = Object.assign({},state,{todos:[
        ...state.todos,
        'Learn Redux'
    ]})