---
title: Server Side Rendering
date: 2019-12-29 16:49:37
tags: SSR 
---


### 实现一个简单的服务端渲染


#### 参考文献：
- [实现一个简单的服务端渲染](https://medium.com/@mahesh_joshi/understanding-server-side-rendering-in-react-in-easy-way-d2984bb7aa51)

- [三部实现SSR](https://www.freecodecamp.org/news/server-side-rendering-your-react-app-in-three-simple-steps-7a82b95db82e/)

> Server side rendering is the way how you render the page initially in server and how the fully rendered page is send back to client.

> 服务端渲染：在服务端生成的页面，在客户端使用。


### CSR 与 SSR 的区别
- 客户端渲染：浏览器下载一个很小的HTML，将JavaScript和文件填充进去
- 服务端渲染：在服务端渲染页面，输出完整的HTML页面


### SSR 的弊端
1. 如果应用很小，SSR 可以提高性能，但是如果应用很大，SSR 会降低性能
2. 增加了服务端 response 的时间，如果服务端繁忙，则会更严重
3. 增加了response size，页面需要花比较长的时间去加载
4. 增加了应用的复杂性


### 什么时候使用 SSR
1. SEO
  爬虫不能理解JavaScript，它们只认识 HTML，不做服务端渲染，爬虫看到的是空白页面
2. 更好的首屏性能，不需要提前先下载一堆 CSS 和 JS 后才看到页面