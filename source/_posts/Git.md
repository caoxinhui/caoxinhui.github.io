---
title: Git
date: 2019-12-28 17:24:28
tags: Git
---


### 代码自动格式化
```json
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

### 本机权限问题
`git pull` 的时候 ` error: cannot open .git/FETCH_HEAD: Permission denied ` ,因为没有当前目录的修改权限
`sudo chmod -R g+w .git ` 修改目录权限。即可正常 `git pull`


### git表情提示符
全局安装`git-cz` 或者 `gitmoji`
`npm install -g git-cz` 
`npm i -g gitmoji-cli`


### 撤销错误的提交
`git reset --soft HEAD^` 撤销commit，并保留更改
`git push origin <分支名> --force`

### 清理分支
`git remote prune origin` 清理远程分支，把本地不存在的远程分支删除，同时`git branch -a` 拉到的也是远程最新的分支，不会保留已删除的远程的分支
`git remote show origin`，可以查看`remote`地址，远程分支，还有本地分支与之相对应关系等信息。

### 修改git的用户名和密码
`Git config –global user.name` 用户名
`Git config –global user.email` 邮箱名


### 回退到之前的版本号
`Git reset –hard` 提交版本号


### 删除远程分支(不需要先切换到其他分支)
`git push origin --delete 要删除的分支名` 

### 删除本地分支
`git branch -d 本地分支名`
`git branch -D 本地分支名(分支没有完全merge会报错提示，改为强制删除即可)`

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
`git fetch origin 同步远程服务器上的数据到本地。`


### 删除远程分支
`git push origin :[分支名]` 删除远程分支

<!--SSH公钥默认存储在账户的主目录下的~/.ssh目录 -->
### ssh key
`cd ~/.ssh`
查找有没有`something`和`something.pub`来命名的一对文件，这个`something`通常是`id_dsa` 或 `id_rsa`。
有`.pub`后缀的文件就是公钥，另一个文件是私钥。若`.ssh`目录没有，可以用`ssh-keygen`来创建。



### 设置git用户名和密码
git config --global user.name "your name"
git config --global user.email "johnode@example.com"


### 合并commit
`git` 修改多个`commit`为一个`commit`
1. 从HEAD版本开始往过去数3个版本 `git rebase -i HEAD~3` 
或者，指明要合并的版本之前的版本号 `git rebase -i commitId（不参与合并）`
2. 后面的多个`commit pick`改为`s`
3. `esc`键退出编辑
4. `:wq`退出
5. `git add .`
6. `git rebase --continue` 
7. `git rebase --abort` 放弃压缩




### 撤销改动
```js
git checkout ./publish
git clean -f ./publish
```

### merge 分支
```js
// merge 代码用
git merge 分支名 --squash
git merge abort 取消合并
```


### 撤销已经提交的commit
`git reset --hand HEAD~1` 撤销上次的commit，保留之前的更改
`git reset --hard <需要回退到的版本号（只需输入前几位）>`
`git push origin <分支名> --force`



### rn 项目操作命令
`xcrun simctl list devices`  获取所有设备名称
`crn-cli run-ios --port=5390 --simulator="iPad Air (3rd generation)" --reset`  指定打开设备


### 关联本地项目与GitHub

1. 在本地项目`git init`
2. `git add .`
3. `git commit -m "message"`
4. 在`GitHub`建立一个项目
5. 复制项目`HTTPS`地址
6. `git remote add origin https 地址`
7. `git push -u origin master`




### Git撤销中间某次提交


### 不常用Git命令


`git add` 暂存某个文件后，取消暂存，`git reset HEAD` 被暂存的文件名。
如果觉得某个文件的修改没有必要，通过`git checkout -- 文件名` 取消修改
`git remote`查看当前配置有哪些远程仓库，`git remote -v` 显示对应的克隆地址。
`git fetch origin `会抓取从你上次克隆以来别人上传到此远程仓库中的所有更新
`git remote rename`修改某个远程仓库在本地的简称
`git remote rm `分支名 移除对应的远端仓库。
`git tag`列出现有标签
`git tag -l 'v1.4.2.*' `我们可以用特定的搜索模式列出符合条件的标签。
创建一个含附注类型的标签，用 `-a` 指定标签名， `-m` 指定了对应的标签说明
`git tag -a v1.4 -m `
`git show v1.4 `查看相应标签的版本信息
`git tag v1.4-lw`
`git show v1.4-lw`
`git push origin v1.5`分享标签，分享标签到远端仓库
`git push origin --tags`推送所有本地新增的标签
`git config --global alias.co checkout 设置别名`
`git config --global alias.last 'log -1 HEAD'`
`git branch --merged查看哪些分支已被并入当前分支`
`git branch --no-merged查看尚未合并的工作。`

### Git rebase 变基




