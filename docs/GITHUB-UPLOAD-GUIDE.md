# 📤 GitHub 上传指南

本文档指导如何将项目上传到 GitHub 远程仓库。

---

## 📋 前置准备

### 1. 确保已安装 Git
```bash
git --version
```

### 2. 配置 Git（如果还未配置）
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

---

## 🌐 在 GitHub 上创建仓库

### 步骤 1: 登录 GitHub
访问 [github.com](https://github.com) 并登录你的账号

### 步骤 2: 创建新仓库
1. 点击右上角的 **"+"** 号
2. 选择 **"New repository"**

### 步骤 3: 填写仓库信息
- **Repository name**: `ivan-happywoods` 或 `react-test`（你的项目名）
- **Description**: `温暖自然的 AI 对话系统 - Ivan_HappyWoods`
- **Public/Private**: 根据需要选择
- **⚠️ 重要**: **不要**勾选以下选项：
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license
  
  （因为本地已经有这些文件了）

### 步骤 4: 创建仓库
点击 **"Create repository"** 按钮

---

## 📝 获取仓库 URL

创建完成后，GitHub 会显示你的仓库 URL：

### HTTPS 方式（推荐新手）
```
https://github.com/你的用户名/仓库名.git
```

### SSH 方式（需要配置 SSH 密钥）
```
git@github.com:你的用户名/仓库名.git
```

**复制这个 URL**，我们下一步会用到。

---

## 🚀 上传代码到 GitHub

### 方式 1: 使用命令行（推荐）

#### 步骤 1: 确认当前位置
```bash
# 确保你在 frontEnd 目录下
pwd  # 或 cd (Windows)
# 应该显示: D:\react_basic\react-test\frontEnd
```

#### 步骤 2: 添加远程仓库
```bash
# 将 URL 替换为你的实际仓库地址
git remote add origin https://github.com/你的用户名/仓库名.git
```

#### 步骤 3: 查看当前状态
```bash
git status
```

#### 步骤 4: 添加所有文件
```bash
git add .
```

#### 步骤 5: 提交更改
```bash
git commit -m "Initial commit: Ivan_HappyWoods AI Chat System"
```

#### 步骤 6: 推送到 GitHub
```bash
# 推送当前分支（001-design-specification-ivan）
git push -u origin 001-design-specification-ivan

# 如果你想推送到 main 分支，先切换分支
# git checkout -b main
# git push -u origin main
```

---

## 🔐 身份验证

### 如果使用 HTTPS
第一次推送时，会要求输入 GitHub 用户名和密码（或 Personal Access Token）

#### 创建 Personal Access Token (推荐)
1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 **"Generate new token"** > **"Generate new token (classic)"**
3. 设置权限：勾选 `repo` (完整的仓库访问权限)
4. 复制生成的 token（只显示一次！）
5. 推送时输入：
   - **Username**: 你的 GitHub 用户名
   - **Password**: 刚才复制的 token（不是你的 GitHub 密码）

### 如果使用 SSH
需要先配置 SSH 密钥：
```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "你的邮箱"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 然后在 GitHub Settings > SSH keys 中添加
```

---

## ✅ 验证上传成功

### 1. 在浏览器访问你的仓库
```
https://github.com/你的用户名/仓库名
```

### 2. 确认文件已上传
你应该能看到：
- ✅ README.md
- ✅ PROJECT-STATUS.md
- ✅ chat_demo.html
- ✅ client/ 目录
- ✅ specs/ 目录
- ✅ 等等...

---

## 🔄 后续更新代码

当你修改代码后，重复以下步骤：

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 3. 提交
git commit -m "描述你的修改"

# 4. 推送
git push
```

---

## 🌿 分支管理

### 查看当前分支
```bash
git branch
```

### 创建并切换到 main 分支
```bash
git checkout -b main
git push -u origin main
```

### 切换分支
```bash
git checkout 分支名
```

---

## 🆘 常见问题

### Q1: `git push` 提示 "Permission denied"
**A**: 检查 URL 是否正确，或者使用 Personal Access Token 而不是密码

### Q2: `git push` 提示 "Updates were rejected"
**A**: 先拉取远程更改：
```bash
git pull origin 分支名 --rebase
git push
```

### Q3: 忘记添加 remote
**A**: 使用以下命令查看和添加：
```bash
# 查看 remote
git remote -v

# 如果没有，添加一个
git remote add origin https://github.com/你的用户名/仓库名.git
```

### Q4: 想要修改 remote URL
**A**: 
```bash
git remote set-url origin https://github.com/新用户名/新仓库名.git
```

### Q5: 文件太大无法上传
**A**: GitHub 单文件限制 100MB，如果有大文件：
- 添加到 `.gitignore`
- 或使用 Git LFS

---

## 📚 相关命令速查

```bash
# 查看状态
git status

# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline

# 查看当前分支
git branch

# 撤销未提交的修改
git restore 文件名

# 撤销已添加但未提交的文件
git restore --staged 文件名
```

---

## 🎯 推荐工作流程

```bash
# 1. 每天开始工作前
git pull

# 2. 修改代码...

# 3. 提交更改
git add .
git commit -m "描述性的提交信息"

# 4. 推送到 GitHub
git push

# 5. 重复 2-4
```

---

## 🎉 完成！

现在你的代码已经安全地托管在 GitHub 上了！

### 下一步建议：
1. ✅ 设置仓库描述和标签
2. ✅ 添加 README.md 中的项目徽章
3. ✅ 创建 Issues 追踪待办事项
4. ✅ 设置 GitHub Actions 自动化
5. ✅ 邀请协作者（如果是团队项目）

---

**祝你上传顺利！** 🚀

如有问题，欢迎查阅 [GitHub 官方文档](https://docs.github.com/)

