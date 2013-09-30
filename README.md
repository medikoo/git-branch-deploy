# git-branch-deploy
## Setup repository branch for deployment

### Installation

	$ npm install -g git-branch-deploy

### Usage

	$ git-branch-deploy some-remote/fix-issue-branch

### What it does?

It runs following commands in your path:

```
git reset
git checkout .
git clean -df
git checkout master
git pull
git fetch some-remote
git merge --no-commit --no-ff some-remote/fix-issue-branch
git reset
```

It's useful to setup remote branches on test environments
