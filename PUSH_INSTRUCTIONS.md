# 推送分支到 GitHub 的步骤

## 方案 1：使用 GitHub CLI（推荐）

```bash
# 1. 登录 GitHub CLI
gh auth login

# 2. 按照提示选择：
#    - GitHub.com
#    - HTTPS
#    - 选择登录方式（浏览器或 token）

# 3. 登录成功后，推送分支
git push -u origin feature/social-media-unit
```

## 方案 2：使用 Personal Access Token

1. 在 GitHub 上创建 Personal Access Token：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问权限）
   - 复制生成的 token

2. 推送时使用 token 作为密码：
```bash
git push -u origin feature/social-media-unit
# Username: 你的 GitHub 用户名
# Password: 粘贴你的 Personal Access Token
```

## 方案 3：配置 Git 凭据存储

```bash
# 配置 Git 凭据助手（macOS）
git config --global credential.helper osxkeychain

# 然后推送（会提示输入用户名和密码/token）
git push -u origin feature/social-media-unit
```

## 方案 4：切换到 SSH（长期方案）

```bash
# 1. 检查是否有 SSH 密钥
ls -la ~/.ssh/id_rsa.pub

# 2. 如果没有，生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. 复制公钥
cat ~/.ssh/id_rsa.pub

# 4. 添加到 GitHub：
#    - 访问 https://github.com/settings/keys
#    - 点击 "New SSH key"
#    - 粘贴公钥

# 5. 更改远程 URL 为 SSH
git remote set-url origin git@github.com:Dliu-aip-LEAD/Allstate_project.git

# 6. 推送
git push -u origin feature/social-media-unit
```

## 推送成功后

推送成功后，访问 GitHub 仓库，你会看到：
- 提示创建 Pull Request 的横幅
- 点击 "Compare & pull request" 按钮
- 填写 PR 描述并创建 PR

