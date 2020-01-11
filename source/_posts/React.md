---
title: React
date: 2019-12-28 17:31:24
tags: React
---

- Tips
 在constructor()的构造器中必须首先调用super(props),否则在构造器中this.props是未定义的。
 由于 JSX 编译后会调用 React.createElement 方法，所以在你的 JSX 代码中必须首先声明 React 变量。
 这就是为什么在render出现的地方要引入react


 dangerouslySetInnerHTML 是 React 提供的替换浏览器 DOM 中的 innerHTML 接口的一个参数。
一般而言，使用 JS 代码设置 HTML 文档的内容是危险的，因为这样很容易把你的用户信息暴露给跨站脚本攻击.所以，你虽然可以直接在 React 中设置 html 的内容，但你要使用 dangerouslySetInnerHTML 并向该函数传递一个含有\_\_html 键的对象，用来提醒你自己这样做很危险。

DOM diff 算法解析

- 函数组件和类组件的差异整理：
  - class 提供更多的功能，比如状态。但是目前有了 Hooks 之后，function 同样提供了更多的功能。
  - class 和 function 在性能上也是微乎其微的
  - 不建议重写已存在的组件
  - class 和 function 根本区别在于心智模型。这种存在在 function 存在的时候就有了，但是它经常被忽略。

```javascript
function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
// function handleClick不需要使用箭头函数，用不用箭头函数的表现形式都是一样的
```

```javascript
class ProfilePage extends React.Component {
  showMessage = () => {
    alert("Followed " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

例子：https://codesandbox.io/s/pjqnl16lm7
function 和 class 的区别在于：
1、点击 function 旁边的按钮，然后在三秒内改变 select 输入框的值：例如从 Dan 改为 Sophie，弹框弹出 Dan
2、点击 class 旁边的按钮，然后三秒内改变 select 输入框的值，弹框弹出 Sophie。
在这两种表现形式中，function 表现的是正确的。

那为何 class 会这样的表现呢？

```javascript
class ProfilePage extends React.Component {
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };
```

在 react 中，props 是不可变更的，但是 this 总是可变的。React 经过一段时间后改变自己，所以我们可以在 render 和生命周期函数中得到最新的版本。

那么如何解决 class 的这种问题呢？
1、早点读 this.props,并且把值传递下去

```javascript
class ProfilePage extends React.Component {
  showMessage = user => {
    alert("Followed " + user);
  };

  handleClick = () => {
    const { user } = this.props;
    setTimeout(() => this.showMessage(user), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

2、可以通过使用闭包把这个问题解决:在 render 里面定义一个函数

```javascript
class ProfilePage extends React.Component {
  render() {
    const props = this.props;
    const showMessage = () => {
      alert("Followed " + props.user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Follow</button>;
  }
}
```

在 react 中，props 和 state 是不可以变的，变化的是 this

另一个例子。alert 出来的是，当点击 send 的时候输入框的值。而不是 3 秒之后输入框的值。

```javascript
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

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

如果想读取最新的 props 或 state 值怎么办呢？用上述的 class 方法。
在 function 函数中，用 ref

```javascript
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

```javascript
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

```javascript
function isBigEnough(element, index, array) {
  return element >= 10;
}
[12, 5, 8, 130, 44].every(isBigEnough); // false
[12, 54, 18, 130, 44].every(isBigEnough); // true
// 这里的函数一定要加return，不然得到的结果是错误的

// some，filter，map，都要加
```

https://www.npmjs.com/package/qrcode
https://nodejs.dev/
https://nodejs.dev/learn/javascript-asynchronous-programming-and-callbacks

单个事件监听器附加到文档的根节点上。当事件被触发时，浏览器告诉我们触发事件的 DOM 节点。为了通过 DOM 节点传播事件，React 并没有在虚拟 DOM 层次结构上进行迭代。
相反，每个 React 组件都有唯一 id 用来表示他的层级。 我们可以使用简单的字符串操作来获取所有父节点的 id。 通过将事件侦听器存储在哈希映射中，我们发现它比将它们附加到虚拟 DOM 更好。

阅读[浏览器缓存](https://www.jianshu.com/p/54cc04190252)
[react 组件间通信](https://mp.weixin.qq.com/s/qZc5d1IjGLvCpLbHwtRz9w)

市场部广告占位的问题

要初始渲染的时候，页面就能挂载占位高度，可以在 Layout 里面加上部分静态代码，查看网页源代码里面，接口拿到了请求，放置在 html 里面，通过拿到的数据，进行初始页面渲染。

```js
// 静态页面
const AutoSizeScript = `<script type="text/javascript">
                                        var pic_wrap = document.querySelector('#holder${floorId}')
                                        var computedHeight = ${shouldAddHeight} ? (Number(${height}) + 48) : Number(${height})
                                        var styleHeight = document.body.clientWidth / 750 * computedHeight

                                        if (pic_wrap) {
                                            pic_wrap.style.height = Math.ceil(styleHeight) + 'px'
                                        }
                                    </script>`;
return <div dangerouslySetInnerHTML={{ __html: AutoSizeScript }} />;
```

在 react 中添加背景图片

```js
<div
        className="hot_zone_box"
        style={{
          backgroundColor: backgroundColor,
          backgroundImage: `url(${backgroundImageLink})`
        }}
      >
```

不能直接写成

```js
<div
        className="hot_zone_box"
        style={{
          backgroundColor: backgroundColor,
          backgroundImage: backgroundImageLink
        }}
      >
```

React 的 setState

setState 被调用之后，更新组件的过程：

- enqueueState(this, partialState)
  1、 获取当前组件的 instance
  2、 将要更新的 state 放进一个数组\_pendingStateQueue 里
  3、 将 instance 给 enqueueUpdate 处理

- enqueueUpdate ----> 是否处于创建/更新阶段
  1、 是 -----> 只是将当前组件放在 dirtyComponent 中
  2、 否 调用 bachingUpdates

网页 favicon 一般可通过以下方式添加

```js
<link rel="shortcut icon" href="//www.baidu.com/favicon.ico" />
```

如果 html 里面没有显示添加，比如说
该页面并没有添加任何的<link>，但是依然会找到小图标。这是因为，浏览器默认回去根域名下https://gr.baidu.com查找favicon.ico 。也就相当于引入了上面的<link> 了，但是问题是，引入了小图标，为什么不会 download 下来呢？

https://superuser.com/questions/532616/grab-favicon-ico-using-google-chrome-dev-tools
其实已经 download 下来了，但是在开发者工具中的 network 看不到请求，shift+F5 就可以看到这个 favicon 请求啦

302 状态码，请求 favicon 的时候，显示 302 状态码，status code：302 Found，重定向状态码表明请求的资源被暂时的移动到了由 Location 头部指定的 URL 上。规范要求浏览器在重定向时保证请求方法和请求主体不变。

nodejs 返回状态码

```js
router.get("/test", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.status(200);
});
```

正则匹配，测试环境如果是 https，一直显示"无法访问此网站:网址为 的网页可能暂时无法连接，或者它已永久性地移动到了新网址。只需要把 https 改为 http 就可以了。

https://mp.weixin.qq.com/s/fNX-8OBCrD2pFa4cAagUjA vue 的面试题


服务端渲染的时候，不能通过fiddler抓到。
可以直接通过请求服务器



阻止默认事件的威力有那么大吗？

今天项目中遇到了一个问题，底部导航，触发点击按道理说应该被return掉，debugger也是显示进入了return的程序，但是双击的时候竟然会促使页面向下滑动，这是什么骚操作。每双击一次都会把页面往下滑动一定距离。然后给事件添加preventDefault竟然就给解决了。这是why


做webapp时，ios有个默认双击事件，会缩放页面，并将当前点击的位置居中到屏幕，通过e.preventDefault()阻止该事件发生



React Refs


refs 应用场景
  - input/video/audio需要控制时，输入框焦点、媒体播放状态
  - 直接动画控制
  - 集成第三方库

refs 调用方式
  - 字符串模式(废弃)
  - 回调函数
  - React.createRef()


- 字符串模式
```js
class List extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.refs.inputEl.focus()
  }
  render() {
    return <input ref="inputEl" />
  }
}
```

- 回调函数模式
```js
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
    const { list } = this.props
    return (
      <ul>
        {
          list.map((item, index) => {
            return (
              <li ref={this._ref} key={index}>
                {item}
              </li>
            )
          })
        }
      </ul>
    )
  }
}
class App extends React.Component {
  state = {
    value: "",
    list: []
  }
  onchange = ({ target: { value } }) => {
    this.setState({ value })
  }
  add = () => {
    const { list, value } = this.state
    list.push(value)
    this.setState({
      value: '',
      list
    })
  }
  render() {
    const { value, list } = this.state
    return (
      <div className="App">
        <input value={value} onchange={this.onchange} />
        <button onClick={this.add}>add</button>
        <List list={list}></List>
      </div>
    )
  }
}
```

