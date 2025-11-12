# 如何运行程序

## ⚠️ 重要：前置要求

1. **Node.js 版本**: **必须使用 Node.js 18+ 或 20+**
   - 当前检测到 v16.20.2，**无法运行此项目**
   - 项目依赖（Vite、Firebase、React Router 等）都需要 Node.js 18+
   - 如果使用 v16，会出现 `crypto$2.getRandomValues is not a function` 等错误

2. **npm**: 通常随 Node.js 一起安装

### 如何升级 Node.js

**方法 1: 使用 nvm（推荐）**
```bash
# 安装 nvm（如果还没有）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用 Node.js 20
nvm install 20
nvm use 20

# 验证版本
node -v  # 应该显示 v20.x.x
```

**方法 2: 从官网下载**
- 访问 [Node.js 官网](https://nodejs.org/)
- 下载并安装最新的 LTS 版本（推荐 20.x 或 22.x）

**升级后重新安装依赖**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 安装步骤

### 1. 安装项目依赖

```bash
npm install
```

### 2. 安装 Firebase Functions 依赖（可选，如果需要运行后端函数）

```bash
cd functions
npm install
cd ..
```

## 运行方式

### 开发模式（推荐）

启动开发服务器，支持热重载：

```bash
npm run dev
```

开发服务器通常会在 `http://localhost:5173` 启动（Vite 默认端口）。

### 构建生产版本

构建生产版本：

```bash
npm run build
```

构建完成后，文件会在 `dist` 目录中。

### 预览生产版本

预览构建后的生产版本：

```bash
npm run preview
```

### 使用 serve 运行生产版本

```bash
npm run build
npm run start
```

这会在 `http://localhost:3000` 启动服务器。

## Firebase Functions（后端）

如果需要运行 Firebase Functions：

```bash
cd functions
npm run serve
```

## 其他可用命令

- `npm run lint` - 运行 ESLint 代码检查
- `npm run test:*` - 各种测试脚本（需要在浏览器控制台运行）

## 常见问题

### 错误：`crypto$2.getRandomValues is not a function`
**原因**: Node.js 版本过低（v16 或更早）  
**解决**: 升级到 Node.js 18+ 或 20+，然后重新安装依赖

### 端口被占用
如果 5173 端口被占用，Vite 会自动尝试其他端口。查看终端输出确认实际端口号。

## 项目结构

- `src/` - React 源代码
- `functions/` - Firebase Cloud Functions
- `public/` - 静态资源
- `dist/` - 构建输出目录（运行 `npm run build` 后生成）

