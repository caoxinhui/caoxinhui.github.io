---
title: Server Side Rendering
date: 2019-12-29 16:49:37
tags: SSR 
---


### 实现一个简单的服务端渲染
在前后端渲染相同的component，将输出一致的dom结构。完善的component属性及生命周期与客户端的render时机是react同构的关键
react的虚拟dom以对象树的形式保存在内存中，并且是可以在任何支持JavaScript的环境中生成的，所以可以在浏览器和node中生成。这为前后端同构提供了先决条件。
<!-- more -->

#### 参考文献：
- [实现一个简单的服务端渲染](https://medium.com/@mahesh_joshi/understanding-server-side-rendering-in-react-in-easy-way-d2984bb7aa51)

- [三部实现SSR](https://www.freecodecamp.org/news/server-side-rendering-your-react-app-in-three-simple-steps-7a82b95db82e/)

> Server side rendering is the way how you render the page initially in server and how the fully rendered page is send back to client.

> 服务端渲染：在服务端生成的页面，在客户端使用。



### CSR 与 SSR 的区别
- 客户端渲染：浏览器下载一个很小的HTML，将JavaScript和文件填充进去，页面渲染由JS负责进行
- 服务端渲染：服务器返回一堆HTML字符串，让浏览器显示


### SSR 的弊端
1. 如果应用很小，SSR 可以提高性能，但是如果应用很大，SSR 会降低性能
2. 增加了服务端 response 的时间，如果服务端繁忙，则会更严重
3. 增加了response size，页面需要花比较长的时间去加载
4. 增加了应用的复杂性


### 什么时候使用 SSR
1. SEO
  爬虫不能理解JavaScript，它们只认识 HTML，不做服务端渲染，爬虫看到的是空白页面
2. 更好的首屏性能，不需要提前先下载一堆 CSS 和 JS 后才看到页面

### 同构
> 一套代码在服务端运行一遍，在客户端又运行一遍，服务端完成页面构建，客户端完成事件绑定

### React 服务端渲染原理
> React 的虚拟 DOM 以对象树的形式存在内存中，并且可以在任何支持JavaScript的环境中生成，所以可以在浏览器和Node中生成。这为前后端同构提供了先决条件。

  #### 虚拟dom 在前后端都是以对象树的形式存在，但是展露原型的方式不一样。

- 虚拟dom -- client --> DOM Element
  React提供ReactDOMServer.renderToString和ReactDOMServer.renderToStaticMarkup 可将其渲染为HTML字符串。
- 虚拟dom -- server --> HTML String 
  在浏览器，React通过ReactDOM的render方法将虚拟dom渲染到真实的dom树上，生成网页


renderToString，会为组件增加checksum，react在客户端通过checksum判断是否需要重新render，相同则不重新render，省略创建dom和挂载dom的过程，接着触发componentDidMount等事件来处理服务端上的未尽事宜（事件绑定等），从而加快了交互时间。不同时，组件将客户端上重新挂载render


### 静态资源处理方案
