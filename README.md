# 🌿 Ivan_HappyWoods 项目

温暖、自然、智能的设计系统

---

## 🚀 快速启动

### 方式 1: 使用启动脚本（推荐）

**Windows 用户**：
```bash
# 双击运行
start-dev.bat

# 或在终端运行
.\start-dev.bat
```

### 方式 2: 手动启动

```bash
# 1. 进入客户端目录
cd client

# 2. 启动开发服务器
pnpm dev
```

然后访问: **http://localhost:3000**

---

## 📂 项目结构

```
frontEnd/
├── client/              # 前端应用 (Next.js)
│   ├── src/             # 源代码
│   │   ├── app/         # 页面路由
│   │   ├── components/  # UI 组件
│   │   ├── lib/         # 工具函数
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── providers/   # Context Providers
│   │   └── store/       # 状态管理
│   ├── public/          # 静态资源
│   └── package.json     # 项目配置
├── specs/               # 设计规范文档
├── chat_demo.html       # 独立 HTML 聊天演示
├── api手册.md           # 后端 API 文档
├── PROJECT-STATUS.md    # 项目进度报告
└── start-dev.bat        # 快速启动脚本
```

---

## ✨ 已实现的功能

### 核心组件
- ✅ **Button** - CVA 类型安全变体管理
- ✅ **Card** - 多种样式变体
- ✅ **Logo** - 品牌标识组件
- ✅ **ThemeToggle** - 深色模式切换

### AI 对话功能
- ✅ **Notion AI 风格界面** (`/notion-ai`) - 完整的 AI 对话体验
  - 欢迎页面到聊天页面的平滑过渡
  - SSE 流式响应
  - Markdown 渲染 + 代码高亮
  - 会话侧边栏管理
  - 日期分隔符
  - 思考状态动画

### 设计系统
- ✅ **深色模式** - 无闪烁主题切换
- ✅ **20+ 动画预设** - 完整的动画库
- ✅ **WCAG AAA** - 无障碍标准
- ✅ **4px 基线网格** - 一致的视觉节奏

### 独立演示
- ✅ **chat_demo.html** - 独立的 HTML 聊天页面
  - 无需构建，直接在浏览器打开
  - 完整 UI（渐变背景、消息气泡）
  - Markdown 渲染 + 代码高亮
  - SSE 流式响应支持
  - 适合快速原型和演示

---

## 🛠️ 常用命令

```bash
# 进入客户端目录
cd client

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

---

## 📚 文档

### 项目文档
- [📊 项目进度报告](./PROJECT-STATUS.md) - 详细的开发进度和统计
- [🚀 快速启动指南](./快速启动指南.md) - 详细启动步骤
- [📖 API 手册](./api手册.md) - 后端接口文档

### 设计规范
- [设计规范](./specs/001-design-specification-ivan/spec.md)
- [实施总结](./specs/001-design-specification-ivan/IMPLEMENTATION-SUMMARY.md)
- [重构总结](./specs/001-design-specification-ivan/REFACTORING-SUMMARY.md)
- [Suna 学习分析](./specs/001-design-specification-ivan/suna-frontend-analysis.md)
- [快速参考](./specs/001-design-specification-ivan/quick-reference.md)

---

## 🎯 技术栈

- **框架**: Next.js 15.5.5
- **UI 库**: React 19.1.0
- **样式**: TailwindCSS 4.x
- **动画**: Framer Motion 11.18.2
- **类型**: TypeScript 5.x
- **工具**: CVA, next-themes

---

## ❗ 常见问题

### Q: 运行 `pnpm dev` 提示找不到 package.json？

**A**: 请确保你在 `client` 目录下运行命令：

```bash
cd client
pnpm dev
```

或者使用根目录的启动脚本：
```bash
.\start-dev.bat
```

### Q: 如何切换深色模式？

**A**: 访问 http://localhost:3000，点击右上角的太阳/月亮图标。

### Q: 端口 3000 被占用怎么办？

**A**: 修改 `client/package.json` 中的启动命令：
```json
"dev": "next dev --turbopack -p 3001"
```

---

## 🌟 特色

- 🎨 温暖的琥珀色主题
- 🌓 完美的深色模式支持
- ♿ WCAG AAA 无障碍标准
- 🎬 流畅的 60fps 动画
- 📱 移动端响应式设计
- 🔧 类型安全的组件系统

---

## 📝 版本

**当前版本**: 0.1.0  
**最后更新**: 2025-10-16

---

🌿✨ **让设计更温暖、更自然、更智能** ✨🌿

