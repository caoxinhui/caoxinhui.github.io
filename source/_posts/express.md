---
title: express
date: 2019-12-28 17:43:21
tags:
---

根据官方文档
使用express访问静态文件
`安装nodemon`
```javascript
var express = require('express')
var app = express()
app.use(express.static(__dirname+'/public')) //__dirname是必须的，不然访问不到public目录
app.use('/static',express.static(__dirname+'/public')) //添加路径名称
app.listen(3000,function(){
    console.log('port 3000 is listened')
})
```

express实现路由
```javascript
var express = require('express')
var app = express()
app.get('/',function(req,res){
    res.send('root')
})
app.get('/about',function(req,res){
    res.send('about')
})
app.listen(3000,function(){
    console.log('port 3000 is listened')
})
```

express路由的正则匹配
```javascript
app.get('/ab*cd',function(req,res){
    res.send('ab')
})
```
这里的正则匹配与通常的正则匹配不一致，通常的* 匹配{0,n} 因为这里不是正则匹配
但是这里的*匹配任意字符，而* 前面的ab和后面的cd是必须要有的

完全的正则匹配，注意和上面的区别
```javascript
app.get(/a/,function(req,res){
    res.send('anything string has a')
})
```

```javascript
app.get('/users/:userId/books/:bookId',function(req,res){
    res.send(req.params)
})
```
返回json字符串

同样还有-和.匹配


```javascript
app.get('/example/b',function(req,res,next){
    res.send('the response will be sent by the next function ...')
    next()
},function(req,res){
    res.send('hello from B')
})
// 匹配两个function是有什么用
```


```javascript
// 在 /user/:id 路径中为任何类型的 HTTP 请求执行此函数。
app.use('/user/:id',function(req,res,next){

})
// 此函数处理针对 /user/:id 路径的 GET 请求
app.get('/user/:id',function(req,res,next){

})
```