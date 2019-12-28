---
title: Git
date: 2019-12-28 17:24:28
tags: Git
---


- 项目安装在 `~` 目录下

`git pull` 的时候 ` error: cannot open .git/FETCH_HEAD: Permission denied ` ,因为没有当前目录的修改权限

使用命令
`sudo chmod -R g+w .git ` 修改目录权限。即可正常 `git pull`



- 全局安装`git-cz`
`npm install -g git-cz
git-cz`
`commit` 之前 使用 `git-cz`


`git reset --soft HEAD^` 撤销commit，并保留更改
`git push origin <分支名> --force`

`git remote prune origin` 清理远程分支，把本地不存在的远程分支删除，同时`git branch -a` 拉到的也是远程最新的分支，不会保留已删除的远程的分支

修改git的用户名和密码
`Git config –global user.name` 用户名
`Git config –global user.email` 邮箱名


回退到之前的版本号：
`Git reset –hard` 提交版本号


删除远程分支(不需要先切换到其他分支)
`git push origin --delete 要删除的分支名` 

`git branch -d 本地分支名`
`git branch -D 本地分支名(分支没有完全merge会报错提示，改为强制删除即可)`


git 练习
```js
// git 
git log -p //比较差异
git log -p -2//比较两次的差异
git log -p --word-diff//单词层面上的对比 
git log --stat//显示简要的增改行数统计。
git log --pretty=oneline //提交在一行显示
git log --pretty=short 或者 git log --pretty=full 或者 git log --pretty=fuller
git log --pretty=format:"%h - %an, %ar : %s" //制定要显示的记录格式，便于后期编程提取分析。
%H	提交对象（commit）的完整哈希字串
%h	提交对象的简短哈希字串
%T	树对象（tree）的完整哈希字串
%t	树对象的简短哈希字串
%P	父对象（parent）的完整哈希字串
%p	父对象的简短哈希字串
%an	作者（author）的名字
%ae	作者的电子邮件地址
%ad	作者修订日期（可以用 -date= 选项定制格式）
%ar	作者修订日期，按多久以前的方式显示
%cn	提交者(committer)的名字
%ce	提交者的电子邮件地址
%cd	提交日期
%cr	提交日期，按多久以前的方式显示
%s	提交说明
```
git log --pretty=format:"%h %s" --graph展示每个提交所在的分支及其分化衍合情况。


git撤销操作
$ git commit -m 'initial commit'
$ git add forgotten_file
$ git commit --amend

//只会产生一次提交，第二次提交修正了第一次的提交内容

git add 暂存某个文件后，取消暂存，git reset HEAD 被暂存的文件名。
如果觉得某个文件的修改没有必要，通过git checkout -- 文件名 取消修改

git remote查看当前配置有哪些远程仓库，git remote -v 显示对应的克隆地址。
git fetch origin 会抓取从你上次克隆以来别人上传到此远程仓库中的所有更新

git remote rename修改某个远程仓库在本地的简称
git remote rm 分支名 移除对应的远端仓库。
git tag列出现有标签
git tag -l 'v1.4.2.*' 我们可以用特定的搜索模式列出符合条件的标签。

创建一个含附注类型的标签，用 -a 指定标签名， -m 指定了对应的标签说明
git tag -a v1.4 -m 

git show v1.4 查看相应标签的版本信息

git tag v1.4-lw

git show v1.4-lw

git push origin v1.5分享标签，分享标签到远端仓库

git push origin --tags推送所有本地新增的标签

git config --global alias.co checkout 设置别名

git config --global alias.last 'log -1 HEAD'


git 分支

git branch testing 新建testing分支 在当前commit对象上新建一个分支指针，不会自动切换到该分支中去

git checkout -b iss53 新建分支并切换到该分支

git branch --merged查看哪些分支已被并入当前分支
git branch --no-merged查看尚未合并的工作。
git fetch origin 同步远程服务器上的数据到本地。

git push origin :[分支名] 删除远程分支

<!--SSH公钥默认存储在账户的主目录下的~/.ssh目录 -->
cd ~/.ssh
ls
查找有没有something和something.pub来命名的一对文件，这个something通常是id_dsa 或 id_rsa。
有.pub后缀的文件就是公钥，另一个文件是私钥。若.ssh目录没有，可以用ssh-keygen来创建。


git config --global user.name "your name"
git config --global user.email "johnode@example.com"


远程分支被删除后，本地git branch 和 git branch -a还是可以看到这些被删除的分支
git remote show origin，可以查看remote地址，远程分支，还有本地分支与之相对应关系等信息。
提示使用
git remote prune origin 删除远程仓库中已经不存在的分支

误操作commit
`git reset --hard 上次的commitId`，同时清除了本地的修改
`git reset --hand HEAD~1` 撤销上次的commit，保留之前的更改

查询是否使用了代理
`git config --global --unset http.proxy` 
取消代理
`git config --global http.proxy` 

`git` 修改多个`commit`为一个`commit`
`git rebase -i HEAD~3`
后面的多个`commit pick`改为`s`
`esc`键退出编辑
`:wq`退出

```js
git checkout ./publish
git clean -f ./publish
```

```js
// merge 代码用
git merge 分支名 --squash
git merge abort 取消合并
```


撤销已经提交的commit

`git reset --hard <需要回退到的版本号（只需输入前几位）>`

`git push origin <分支名> --force`




`xcrun simctl list devices`  获取所有设备名称
`crn-cli run-ios --port=5390 --simulator="iPad Air (3rd generation)" --reset`  指定打开设备


关联本地项目与GitHub
1、在本地项目git init
2、git add .
3、git commit -m "message"
4、在GitHub建立一个项目
5、复制项目HTTPS地址
6、git remote add origin https 地址
7、git push -u origin master
