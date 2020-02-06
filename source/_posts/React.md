---
title: React
date: 2019-12-28 17:31:24
tags: React
---

 dangerouslySetInnerHTML 是 React 提供的替换浏览器 DOM 中的 innerHTML 接口的一个参数。
一般而言，使用 JS 代码设置 HTML 文档的内容是危险的，因为这样很容易把你的用户信息暴露给跨站脚本攻击. 所以，你虽然可以直接在 React 中设置 html 的内容，但你要使用 dangerouslySetInnerHTML 并向该函数传递一个含有\_\_html 键的对象，用来提醒你自己这样做很危险。

<!-- more -->

``` javascript
function ProfilePage(props) {
    const showMessage = () => {
        alert("Followed " + props.user);
    };

    const handleClick = () => {
        setTimeout(showMessage, 3000);
    };

    return <button onClick = {
        handleClick
    } > Follow < /button>;
}
// function handleClick不需要使用箭头函数，用不用箭头函数的表现形式都是一样的
```

``` javascript
class ProfilePage extends React.Component {
    showMessage = () => {
        alert("Followed " + this.props.user);
    };

    handleClick = () => {
        setTimeout(this.showMessage, 3000);
    };

    render() {
        return <button onClick = {
            this.handleClick
        } > Follow < /button>;
    }
}
```

function 和 class 的区别在于：
1、点击 function 旁边的按钮，然后在三秒内改变 select 输入框的值：例如从 Dan 改为 Sophie，弹框弹出 Dan
2、点击 class 旁边的按钮，然后三秒内改变 select 输入框的值，弹框弹出 Sophie。
在这两种表现形式中，function 表现的是正确的。

那为何 class 会这样的表现呢？

``` javascript
class ProfilePage extends React.Component {
        showMessage = () => {
            alert('Followed ' + this.props.user);
        };
```

在 react 中，props 是不可变更的，但是 this 总是可变的。React 经过一段时间后改变自己，所以我们可以在 render 和生命周期函数中得到最新的版本。

那么如何解决 class 的这种问题呢？
1、早点读 this.props, 并且把值传递下去

``` javascript
class ProfilePage extends React.Component {
    showMessage = user => {
        alert("Followed " + user);
    };

    handleClick = () => {
        const {
            user
        } = this.props;
        setTimeout(() => this.showMessage(user), 3000);
    };

    render() {
        return <button onClick = {
            this.handleClick
        } > Follow < /button>;
    }
}
```

2、可以通过使用闭包把这个问题解决: 在 render 里面定义一个函数

``` javascript
class ProfilePage extends React.Component {
    render() {
        const props = this.props;
        const showMessage = () => {
            alert("Followed " + props.user);
        };

        const handleClick = () => {
            setTimeout(showMessage, 3000);
        };

        return <button onClick = {
            handleClick
        } > Follow < /button>;
    }
}
```

在 react 中，props 和 state 是不可以变的，变化的是 this

另一个例子。alert 出来的是，当点击 send 的时候输入框的值。而不是 3 秒之后输入框的值。

``` javascript
function MessageThread() {
    const [message, setMessage] = useState("");

    const showMessage = () => {
        alert("You said: " + message);
    };

    const handleSendClick = () => {
        setTimeout(showMessage, 3000);
    };

    const handleMessageChange = e => {
        setMessage(e.target.value);
    };

    return ( <
        >
        <
        input value = {
            message
        }
        onChange = {
            handleMessageChange
        }
        /> <
        button onClick = {
            handleSendClick
        } > Send < /button> < /
        >
    );
}
```

如果想读取最新的 props 或 state 值怎么办呢？用上述的 class 方法。
在 function 函数中，用 ref

``` javascript
function MessageThread() {
    const [message, setMessage] = useState('');
    const latestMessage = useRef('');

    const showMessage = () => {
        alert('You said: ' + latestMessage.current);
    };

    const handleSendClick = () => {
        setTimeout(showMessage, 3000);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        latestMessage.current = e.target.value;
    };
```

手动更新 ref 是特别烦的，可以用 useEffect 来更新

``` javascript
function MessageThread() {
    const [message, setMessage] = useState('');
    const latestMessage = useRef('');
    useEffect(() => {
        latestMessage.current = message;
    });

    const showMessage = () => {
        alert('You said: ' + latestMessage.current);
    };
```

今天在 every 的问题上纠结了一段时间，后来发现

``` javascript
function isBigEnough(element, index, array) {
    return element >= 10;
}
[12, 5, 8, 130, 44].every(isBigEnough); // false
[12, 54, 18, 130, 44].every(isBigEnough); // true
// 这里的函数一定要加return，不然得到的结果是错误的

// some，filter，map，都要加
```

React 的 setState

setState 被调用之后，更新组件的过程：

* enqueueState(this, partialState)

  1、 获取当前组件的 instance
  2、 将要更新的 state 放进一个数组\_pendingStateQueue 里
  3、 将 instance 给 enqueueUpdate 处理

* enqueueUpdate ----> 是否处于创建/更新阶段

  1、 是 -----> 只是将当前组件放在 dirtyComponent 中
  2、 否 调用 bachingUpdates

nodejs 返回状态码

``` js
router.get("/test", function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
});
```

React Refs

* 字符串模式

``` js
class List extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    componentDidMount() {
        this.refs.inputEl.focus()
    }
    render() {
        return <input ref = "inputEl" / >
    }
}
```

* 回调函数模式

``` js
class List extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    _ref = el => {
        if (el) {
            if (!this.els) {
                this.els = []
            }
            this.els.push(el)
        } else {
            this.els = []
        }
    }
    render() {
        const {
            list
        } = this.props
        return ( <
            ul > {
                list.map((item, index) => {
                    return ( <
                        li ref = {
                            this._ref
                        }
                        key = {
                            index
                        } > {
                            item
                        } <
                        /li>
                    )
                })
            } <
            /ul>
        )
    }
}
class App extends React.Component {
    state = {
        value: "",
        list: []
    }
    onchange = ({
        target: {
            value
        }
    }) => {
        this.setState({
            value
        })
    }
    add = () => {
        const {
            list,
            value
        } = this.state
        list.push(value)
        this.setState({
            value: '',
            list
        })
    }
    render() {
        const {
            value,
            list
        } = this.state
        return ( <
            div className = "App" >
            <
            input value = {
                value
            }
            onchange = {
                this.onchange
            }
            /> <
            button onClick = {
                this.add
            } > add < /button> <
            List list = {
                list
            } > < /List> < /
            div >
        )
    }
}
```

### react渲染原理

### 渲染劫持（Render Hijacking）

``` js
// 高阶组件
function enhancer(WrappedComponent) {
    return class EnhancedComponent extends React.Component {
        render() {
            return <WrappedComponent {
                ...this.props
            }
            />
        }
    };
}
```

``` js
function enhancer(WrappedComponent) {
    return class EnhancedComponent extends WrappedComponent {
        render() {
            const elementsTree = super.render();
            ...
            return {
                ...
            }
        }
    };
}
```

#### 高阶组件 HOC

实现高阶组件的方式：

* 属性代理
* 反向继承

**属性代理**

``` js
import React, {
    Component
} from 'React';
//高阶组件定义
const HOC = (WrappedComponent) =>
    class WrapperComponent extends Component {
        render() {
            return <WrappedComponent {
                ...this.props
            }
            />;
        }
    }
//普通的组件
class WrappedComponent extends Component {
    render() {
        //....
    }
}

//高阶组件使用
export default HOC(WrappedComponent)
```

**属性代理作用**

* 操作props

``` js
const HOC = (WrappedComponent) =>
    class WrapperComponent extends Component {
        render() {
            const newProps = {
                name: 'HOC'
            }
            return <WrappedComponent {
                ...this.props
            }
            />;
        }
    }
```

* 获得refs的引用

``` js
import React, {
    Component
} from 'React';

const HOC = (WrappedComponent) =>
    class wrapperComponent extends Component {
        storeRef(ref) {
            this.ref = ref;
        }
        render() {
            return <WrappedComponent {
                ...this.props
            }
            ref = {
                this.storeRef
            }
            />;
        }
    }
```

* 抽象state

``` js
class WrappedComponent extends Component {
    render() {
        return <input name = "name" {
            ...this.props.name
        }
        />;
    }
}

const HOC = (WrappedComponent) =>
    class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                name: '',
            };

            this.onNameChange = this.onNameChange.bind(this);
        }

        onNameChange(event) {
            this.setState({
                name: event.target.value,
            })
        }

        render() {
            const newProps = {
                value: this.state.name,
                onChange: this.onNameChange
            }
            return <WrappedComponent {
                ...this.props
            } {
                ...newProps
            }
            />;
        }
    }
```

**反向继承**

> 反向继承是指返回的组件去继承之前的组件(这里都用WrappedComponent代指)

``` js
const HOC = (WrappedComponent) =>
    class extends WrappedComponent {
        render() {
            return super.render();
        }
    }
```

* 渲染劫持

渲染劫持是指我们可以有意识地控制WrappedComponent的渲染过程，从而控制渲染控制的结果。例如我们可以根据部分参数去决定是否渲染组件:

``` js
const HOC = (WrappedComponent) =>
    class extends WrappedComponent {
        render() {
            if (this.props.isRender) {
                return super.render();
            } else {
                return null;
            }
        }
    }
```

  甚至我们可以修改修改render的结果:
  

``` js
  const HOC = (WrappedComponent) =>
      class extends WrappedComponent {
          render() {
              const elementsTree = super.render();
              let newProps = {};
              if (elementsTree && elementsTree.type === 'input') {
                  newProps = {
                      value: 'may the force be with you'
                  };
              }
              const props = Object.assign({}, elementsTree.props, newProps);
              const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children);
              return newElementsTree;
          }
      }
  class WrappedComponent extends Component {
      render() {
          return ( <
              input value = {
                  'Hello World'
              }
              />
          )
      }
  }
  export default HOC(WrappedComponent)
  //实际显示的效果是input的值为"may the force be with you"
```

### render 方法原理
