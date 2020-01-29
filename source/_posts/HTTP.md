---
title: HTTP
date: 2020-01-13 16:51:57
tags:
---

本篇整理 《图解HTTP》 以及 《HTTP权威指南》相关知识点

### HTTP 首部

### Access-Control-Expose-Headers
> 列出了哪些首部可以作为响应的一部分暴露给外部

默认情况下，只有6种简单响应首部可以暴露给外部
- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma


### access-control-allow-credentials
> 表示是否可以将对请求的响应暴露给页面