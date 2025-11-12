# Git 分支工作流指南

## 标准工作流程：创建分支 → 开发 → 测试 → 合并到 main

### 1. 创建并切换到新分支

```bash
# 从 main 分支创建新分支（推荐：先确保 main 是最新的）
git checkout main
git pull origin main

# 创建并切换到新分支
git checkout -b feature/social-media-unit

# 或者使用新语法
git switch -c feature/social-media-unit
```

**分支命名建议：**
- `feature/功能名称` - 新功能（如：`feature/social-media-unit`）
- `fix/修复内容` - 修复 bug（如：`fix/login-error`）
- `test/测试内容` - 测试相关（如：`test/social-media-unit`）

### 2. 在新分支上开发和提交

```bash
# 查看当前分支
git branch

# 进行代码修改...

# 添加更改
git add .

# 提交更改（使用清晰的提交信息）
git commit -m "feat: add Social Media Unit page and missions"

# 继续开发，可以多次提交
git add src/screens/SocialMediaUnit.jsx
git commit -m "fix: remove unused imports in SocialMediaUnit"
```

**提交信息规范：**
- `feat:` - 新功能
- `fix:` - 修复 bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具相关

### 3. 测试你的更改

```bash
# 运行开发服务器测试
npm run dev

# 运行 lint 检查
npm run lint

# 运行测试（如果有）
npm test

# 确保一切正常工作后再继续
```

### 4. 推送分支到远程仓库

```bash
# 首次推送新分支
git push -u origin feature/social-media-unit

# 后续推送（如果继续开发）
git push
```

### 5. 创建 Pull Request (PR) - 推荐方式

在 GitHub 上：
1. 推送分支后，GitHub 会显示 "Compare & pull request" 按钮
2. 点击创建 PR
3. 填写 PR 描述：
   - 说明更改内容
   - 列出测试结果
   - 添加截图（如适用）
4. 等待代码审查
5. 审查通过后，点击 "Merge pull request" 合并到 main

**或者使用命令行：**

```bash
# 使用 GitHub CLI（如果已安装）
gh pr create --title "Add Social Media Unit" --body "添加了 Social Media Unit 页面和相关任务"
```

### 6. 合并到 main 分支

**方式 A：通过 Pull Request（推荐）**
- 在 GitHub 上合并 PR
- 自动合并到 main
- 保留完整的提交历史

**方式 B：直接合并（如果团队允许）**

```bash
# 切换回 main 分支
git checkout main

# 拉取最新更改
git pull origin main

# 合并功能分支
git merge feature/social-media-unit

# 推送合并后的 main
git push origin main
```

### 7. 清理本地分支（可选）

```bash
# 删除已合并的本地分支
git branch -d feature/social-media-unit

# 删除远程分支（如果已合并）
git push origin --delete feature/social-media-unit
```

## 当前情况：处理未提交的更改

如果你当前有未提交的更改，可以：

### 选项 1：在新分支上提交这些更改

```bash
# 创建新分支（当前更改会带到新分支）
git checkout -b feature/social-media-unit

# 添加并提交更改
git add .
git commit -m "feat: add Social Media Unit page and missions"

# 推送新分支
git push -u origin feature/social-media-unit
```

### 选项 2：先暂存更改，切换分支后再应用

```bash
# 暂存当前更改
git stash

# 创建新分支
git checkout -b feature/social-media-unit

# 恢复暂存的更改
git stash pop

# 然后提交
git add .
git commit -m "feat: add Social Media Unit page and missions"
```

## 常用命令速查

```bash
# 查看所有分支
git branch -a

# 查看当前状态
git status

# 查看提交历史
git log --oneline --graph --all

# 查看分支差异
git diff main..feature/social-media-unit

# 更新 main 分支
git checkout main
git pull origin main

# 同步功能分支（从 main 获取最新更改）
git checkout feature/social-media-unit
git merge main
# 或使用 rebase（保持线性历史）
git rebase main
```

## 最佳实践

1. ✅ **总是从最新的 main 创建分支**
2. ✅ **保持分支名称清晰有意义**
3. ✅ **频繁提交，使用清晰的提交信息**
4. ✅ **在合并前充分测试**
5. ✅ **使用 Pull Request 进行代码审查**
6. ✅ **合并后删除已合并的分支**
7. ✅ **不要直接在 main 分支上开发**

