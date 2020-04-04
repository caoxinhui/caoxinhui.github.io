---
title: react性能优化
date: 2020-04-04 14:07:21
tags:
categories: 极客时间
---

异步渲染的两个部分
- 时间分片
DOM操作的优先级低于浏览器原生行为，例如键盘和鼠标输入，从而保证操作的流畅
- 渲染挂起
虚拟DOM节点可以等待某个异步操作的完成，并指定timeout，之后才完成真正的渲染。

### 时间分片
1. 虚拟dom的diff操作可以分片进行
2. React新API：unstable_deferredUpdates
UI更新会等其他高优先级的UI更新先完成之后才更新
3. Chrome新的API：requestIdleCallback
浏览器告诉你什么时候浏览器不忙了