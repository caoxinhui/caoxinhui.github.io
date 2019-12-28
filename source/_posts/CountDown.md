---
title: CountDown
date: 2019-12-28 17:34:28
tags:
---

### 最近用两种写发写了倒计时的功能

#### 第一种，通过setInterval实现

  - `JS` 主线程执行时有一个栈存储运行时的函数相关变量,遇到函数时会先入栈执行完后再出栈。当遇到 `setTimeout` `setInterval` `requestAnimationFrame` 以及 `I/O` 操作时，这些函数会立刻返回一个值（如 `setInterval` 返回一个 `intervalID` ）保证主线程继续执行，而异步操作则由浏览器的其它线程维护。当异步操作完成时，浏览器会将其回调函数插入主线程的任务队列中，当主线程执行完当前栈的逻辑后，才会依次执行任务队列中的任务。 

  - 但是在每个任务之间，还有一个微任务队列的存在。在当前任务执行完后，将先执行微任务队列中的所有任务，例如 `Promise` `process.nextTick` 等操作。也就是说当 `setInterval(fn, 1000)` 等待 `1` 秒钟后，`fn` 函数会被插入任务队列中，但并不一定会立刻执行，还需要等待当前任务以及微任务队列中的所有任务执行完。长此以往，使用 `setInterval` 的计时器超时将越来越严重。

```js
console.log('console.log()')
setTimeout(function(){
  console.log('setTimeOut')
})
Promise.resolve().then(function(){
  console.log('promise1')
}).then(function(){
  console.log('promise2')
})
console.log('script end')
```


```js
 let [milliSecs, setmilliSecs] = useState(remainingTime);

  const startCountDown = async () => {
    milliSecs -= 1000;
    setmilliSecs(milliSecs);
    if (milliSecs <= 0) {
      clearInterval(timer);
      await updateInitialData();
    }
  };

  useEffect(() => {
    timer = setInterval(startCountDown, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
```



#### 第二种，通过requestAnimationFrame实现
```js
// 预加载结束背景图
  let preloadImageFlag = false;
  const preloadImage = endBgImage => {
    const img = new Image();
    img.src = endBgImage;
    preloadImageFlag = true;
  };

  const timerRef = useRef();
  const lastTimeStampRef = useRef();
  const updateSinceEffectRef = useRef();
  // const remainTimeRef = useRef();
  // remainTimeRef.current = remainingTime;
  // updateInitialData, 重新请求接口之后，要将 lastTimeStamp 置为 timeStamp，从当前的 timeStamp 开始倒计时
  // let [lastTimeStamp, setLastTimeStamp] = useState(0);
  // updateSinceUseEffect 标记是否重置了 lastTimeStamp
  // const [updateSinceUseEffect, setUpdateSinceUseEffect] = useState(false);

  const [milliSecs, setMilliSecs] = useState(Number(remainingTime));

  const formatTime = async timestamp => {
    if (!updateSinceEffectRef.current) {
    window.cancelAnimationFrame(timerRef.current);
    lastTimeStampRef.current = timestamp;
      updateSinceEffectRef.current = true;
    }
    // 对初始的 lastTimestamp 进行赋值，将 timestamp 置为从 0 开始，否则时间会超前结束，timeStamp 从页面加载开始计时
    const timeSinceLaststamp = timestamp - lastTimeStampRef.current;
    const leftTime = Number(remainingTime) - timeSinceLaststamp;
    setMilliSecs(leftTime);

    if (leftTime < 5000 && !preloadImageFlag && endBgImage)
      preloadImage(endBgImage); // 倒计时 5s 预加载结束背景图

    if (leftTime <= 0) {
      window.cancelAnimationFrame(timerRef.current);

      await updateInitialData();
      return;
    }
    timerRef.current = window.requestAnimationFrame(formatTime);
  };

  useEffect(() => {
    /**
     * isFreshForCountDown 全局状态 标记 在请求接口后，倒计时组件是否被更新过
     * 当没有被更新过，执行动画，并且将 isFreshForCountDown 置为更新过 true
     */
    if (isFreshForCountDown) return;

    // 倒计时结束，就不用开启倒计时动画
    if (Number(remainingTime) <= 0) {
      /**
       * 情景：从倒计时结束切换为 倒计时开始。倒计时结束，编辑楼层信息重新倒计时，又回来，应该刷新页面继续执行倒计时
       * remainTime 为 负数 -> remainTime 为正数
       * 进入到处理函数最后，都要将 isFreshForCountDown置为true
       */
      handleFreshForCountDown(true);
      return;
    }
    // 设置 updateSinceUseEffect 为false，在 formatTime 中需要用到。
    updateSinceEffectRef.current = false;
    // setUpdateSinceUseEffect(false);
    /**
     * requestAnimationFrame 的 timeStamp 值，是从页面window loading开始计算的,
     * 所以在 useEffect 的时候，window.performance.now() 就是从页面开始加载到客户端的时间
     * 而我们想要的 timeStamp 是调用 formatTime 开始的时间
     */
    window.cancelAnimationFrame(timerRef.current);
    timerRef.current = window.requestAnimationFrame(formatTime);

    // 更新过动画，将 isFreshForCountDown 设置为 true
    handleFreshForCountDown(true);
  }, [isFreshForCountDown]);

```

通过 `document.addEventListener("visibilitychange",this.diffTime,false)` 触发可视监听事件。
但是，通过浏览器打开的页面，比如微信浏览器，`safari` 浏览器，其他手机自带浏览器等等，是在当前页面新开的，所以不会触发 `visibilitychange` 事件，相当于一直在当前页面，从来没有离开视口。而且浏览器会对打开的也没进行缓存，页面回退不会重新从 `componentwillcreate` 生命周期开始，只会从 `componentdidmount` 开始，也就是服务端生成的 `html` 不会重新请求，只会对客户端的操作重新开始执行。
 解决方法是
 静态 `html` 中添加
```html
<input type="hidden" id="refreshed" value="no" />
```
`componentDidMount` 中添加
 ```js
 disableHTMLCache = () => {
    if (typeof window !== "undefined") {
      window.onload = function() {
        let e = document.getElementById("refreshed");
        if (e.value == "no") {
          e.value = "yes";
        } else {
          e.value = "no";
          location.reload();
        }
      };
    }
  };
 ```

[浏览器特性支持](https://developers.google.com/web/updates/2019/02/back-forward-cache)