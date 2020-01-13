---
title: Debounce & throttle
date: 2019-12-28 17:42:33
tags:
---
<!-- more -->

```js
const throttle = (fn, wait) => {
  let previous = 0;
  return function(...args) {
    let now = +new Date();
    if (now - previous > wait) {
      previous = now;
      fn.apply(this, args);
    }
  };
};
// 执行 throttle 函数返回新函数
const betterFn = throttle(() => console.log("fn 函数执行了"), 1000);
// 每 10 毫秒执行一次 betterFn 函数，但是只有时间差大于 1000 时才会执行 fn
setInterval(betterFn, 10);

function debounce(fn, wait = 50) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

const betterFn = debounce(() => console.log("fn 防抖执行了"), 1000);
document.addEventListener("scroll", betterFn);

// immediate表示第一次是否立即执行
function debounce(fn, wait = 50, immediate) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

const betterFn = debounce(() => console.log("fn 防抖执行了"), 1000, true);
document.addEventListener("scroll", betterFn);

// 加强版throttle
// wait 时间内，可以重新生成定时器，但只要 wait 的时间到了，必须给用户一个响应

function throttle(fn, wait) {
  let previous = 0,
    timer = null;
  return function(...args) {
    let now = +new Date();
    if (now - previous < wait) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        previous = now;
        fn.apply(this, args);
      }, wait);
    } else {
      previous = now;
      fn.apply(this, args);
    }
  };
}
// 执行 throttle 函数返回新函数
const betterFn = throttle(() => console.log("fn 节流执行了"), 1000);
// 第一次触发 scroll 执行一次 fn，每隔 1 秒后执行一次函数 fn，停止滑动 1 秒后再执行函数 fn
document.addEventListener("scroll", betterFn);
```
