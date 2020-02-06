---
title: Git & npm
date: 2019-12-28 17:24:28
tags: Git
---

## Git 

### 代码自动格式化

``` json
// 安装husky，prettier,lint-staged
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "prettier --write \"src/**/*.{js,jsx}\"",
      "git add"
    ]
  }
```

<!-- more -->

### 本机权限问题

`git pull` 的时候 ` error: cannot open .git/FETCH_HEAD: Permission denied ` , 因为没有当前目录的修改权限
`sudo chmod -R g+w .git ` 修改目录权限。即可正常 `git pull` 

### git表情提示符

全局安装 `git-cz` 或者 `gitmoji` 
`npm install -g git-cz` 
`npm i -g gitmoji-cli` 

### 撤销错误的提交

`git reset --soft HEAD^` 撤销commit，并保留更改
`git push origin <分支名> --force` 

### 清理分支

`git remote prune origin` 清理远程分支，把本地不存在的远程分支删除，同时 `git branch -a` 拉到的也是远程最新的分支，不会保留已删除的远程的分支
`git remote show origin` ，可以查看 `remote` 地址，远程分支，还有本地分支与之相对应关系等信息。

### 修改git的用户名和密码

`Git config –global user.name` 用户名
`Git config –global user.email` 邮箱名

### 回退到之前的版本号

`Git reset –hard` 提交版本号

### 删除远程分支(不需要先切换到其他分支)

1. `git push origin --delete 要删除的分支名` 
2. `git push origin -d 分支名` 
3. `git push <远程分支名> -d 分支名` 

### 删除本地分支

`git branch -d 本地分支名` 
`git branch -D 本地分支名(分支没有完全merge会报错提示，改为强制删除即可)` 

### 暂存修改

1. 暂存 `git stash` 
2. 恢复 `git stash apply` 
3. 删除 `git stash drop` 
4. 恢复 + 删除 `git stash pop` 

### 查看远程仓库信息

1. `git remote -v` 

### git撤销操作

``` 
<!-- 只会产生一次提交，第二次提交修正了第一次的提交内容 -->
`git commit -m 'initial commit'` 
`git add forgotten_file` 
`git commit --amend` 
```

### 新建分支

`git branch testing 新建testing分支 在当前commit对象上新建一个分支指针，不会自动切换到该分支中去` 
`git checkout -b iss53 新建分支并切换到该分支` 
`git push -u origin 分支名` 提交新建的分支到远程
`git push origin 分支名:分支名` 推送新分支到远程
`git fetch origin 同步远程服务器上的数据到本地。` 

> 如果没有推送的远程的话，commit之后只会显示 working tree clean

### 删除远程分支

`git push origin :[分支名]` 删除远程分支

<!--SSH公钥默认存储在账户的主目录下的~/.ssh目录 -->

### ssh key

`cd ~/.ssh` 
查找有没有 `something` 和 `something.pub` 来命名的一对文件，这个 `something` 通常是 `id_dsa` 或 `id_rsa` 。
有 `.pub` 后缀的文件就是公钥，另一个文件是私钥。若 `.ssh` 目录没有，可以用 `ssh-keygen` 来创建。

### 设置git用户名和密码

git config --global user.name "your name"
git config --global user.email "johnode@example.com"

### 合并commit

`git` 修改多个 `commit` 为一个 `commit` 

1. 从HEAD版本开始往过去数3个版本 `git rebase -i HEAD~3` 

或者，指明要合并的版本之前的版本号 `git rebase -i commitId（不参与合并）` 

2. 除了第一个以外，后面的多个 `commit pick` 改为 `s` 
3. `esc` 键退出编辑
4. `:wq` 退出
5. `git add .` 
6. `git rebase --continue` 
7. `git rebase --abort` 放弃压缩

### 撤销改动

``` js
git checkout. / publish
git clean - f. / publish
```

### merge 分支

``` js
// merge 代码用
git merge 分支名--squash
git merge abort 取消合并
```

### 撤销已经提交的commit

`git reset --hand HEAD~1` 撤销上次的commit，保留之前的更改
`git reset --hard <需要回退到的版本号（只需输入前几位）>` 
`git push origin <分支名> --force` 或者 `git push --force` 强制提交

### 删除中间某次提交

1. 首先 `git log` 查看提交记录，找到出错的前一笔提交的 `commit_id` 
2. 用命令 `git rebase -i commit_id` , 查找提交记录
3. 将出错那次提交的 `pick` 改为 `drop` 
4. `Esc，:wq` 
5. 完成！

### git reset分为三种模式

* soft 
* mixed 
* hard

**git reset --hard commitId**
重置暂存区和工作区，完全重置为指定的commitId，当前分支没有commit的代码会被清除
**git reset --soft commitId**
保留工作目录，把指定的commit节点与当前分支的差异都存入暂存区。没有被commit的代码也能够保留下来
**git reset commitId**
不带参数，就是mixed模式。将会保留工作目录，并把工作区、暂存区、以及与reset的差异都放到工作区，然后清空暂存区。

### rn 项目操作命令

`xcrun simctl list devices` 获取所有设备名称
`crn-cli run-ios --port=5390 --simulator="iPad Air (3rd generation)" --reset` 指定打开设备

### 关联本地项目与GitHub

1. 在本地项目 `git init` 
2. `git add .` 
3. `git commit -m " message"` 
4. 在 `GitHub` 建立一个项目
5. 复制项目 `HTTPS` 地址
6. `git remote add origin https 地址` 
7. `git push -u origin master` 

### 代码版本

1. 查看过去版本 `git log --pretty=oneline` 

### 暂存区文件撤销

1. `git reset HEAD 文件` 

### 删除文件

1. 从版本库中删除文件 `git rm 文件名` 
2. 从版本库中删除文件，但是本地不删除该文件 `git rm --cached 文件名` 

### 创建分支

1. 仅创建 `git branch 分支名` 
2. 创建并切换 `git checkout -b 分支名` 

## npm

npm rebuild  重建软件包
npm build
 ### ^ 与 ~ 的区别

  + ~ 会匹配最近的小版本依赖包，~1.2.3 会匹配 1.2.x 
  + ^ 会匹配最新的大版本依赖包，^1.2.3 会匹配 1.x.x

## Unexpected end of JSON input while parsing near '... "http://registry.npm.'

第一步
`npm cache clean --force` 
第二步
`npm install --registry=https://registry.npm（镜像）` 

原因：可以先看下npm install的执行过程：

* 发出npm install命令
* npm 向 registry 查询模块压缩包的网址
* 下载压缩包，存放在~/.npm(本地NPM缓存路径)目录
* 解压压缩包到当前项目的node_modules目录

&nbsp; &nbsp; 实际上说一个模块安装以后，本地其实保存了两份。一份是 ~/.npm 目录下的压缩包，另一份是 node_modules 目录下解压后的代码。但是，运行 npm install 的时候，只会检查 node_modules 目录，而不会检查 ~/.npm 目录。如果一个模块在 ~./npm 下有压缩包，但是没有安装在 node_modules 目录中，npm 依然会从远程仓库下载一次新的压缩包。

&nbsp; &nbsp; 我们想利用已经在缓存中之前已经备份的模块实现离线模块安装的的 cache 机制已经在V5的时候重写了，缓存将由 npm 来全局维护不再需要开发人员操心，离线安装时将不再尝试连接网络，而是降级尝试从缓存中读取，或直接失败。就是如果你 offline ，npm将无缝地使用您的缓存。

&nbsp; &nbsp; 这是一个与npm缓存腐败的问题。尽管在较新版本的npm中他们实现了自我修复，这通常可以保证没有腐败，但似乎并不那么有效。

![git.jpg](http://ww1.sinaimg.cn/large/92babc53gy1gbmq2fukejj21ai35sqm4.jpg)

