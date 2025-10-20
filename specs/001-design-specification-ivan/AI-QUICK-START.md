# Notion AI 界面快速使用指南

欢迎使用 Ivan HappyWoods 的 Notion AI 风格对话界面！🎉

---

## 🚀 快速开始

### 1. 启动项目

```bash
# 进入客户端目录
cd client

# 安装依赖（首次运行）
pnpm install

# 启动开发服务器
pnpm dev
```

服务器启动后，访问: `http://localhost:3000`

### 2. 访问 AI 页面

- **方式 1**: 点击主页的 "体验 AI 助手" 按钮
- **方式 2**: 直接访问 `http://localhost:3000/ai`

---

## 🎯 主要功能

### 💬 对话功能

1. **创建新对话**
   - 点击侧边栏顶部的 "新建对话" 按钮
   - 或使用命令面板（Cmd/Ctrl + K）选择 "新建对话"

2. **发送消息**
   - 在底部输入框输入内容
   - 按 `Enter` 发送消息
   - 按 `Shift + Enter` 换行
   - 点击 "发送" 按钮

3. **查看 AI 回复**
   - AI 回复会以流畅的打字机动画显示
   - 支持 Markdown 格式（**粗体**、*斜体*、`代码`等）
   - 自动滚动到最新消息

### 📋 对话管理

1. **切换对话**
   - 点击侧边栏中的对话项
   - 或使用命令面板快速切换

2. **重命名对话**
   - 悬浮在对话项上
   - 点击 ✏️ 编辑图标
   - 输入新标题后按 Enter 保存

3. **删除对话**
   - 悬浮在对话项上
   - 点击 🗑️ 删除图标
   - 确认删除

### ⚡ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + K` | 打开命令面板 |
| `Enter` | 发送消息 |
| `Shift + Enter` | 换行 |
| `ESC` | 关闭命令面板 |
| `↑` / `↓` | 命令面板导航 |
| `Cmd/Ctrl + N` | 新建对话 |

### 🎨 主题切换

1. **方式 1**: 点击右上角的 🌙/☀️ 图标
2. **方式 2**: 使用命令面板（Cmd/Ctrl + K）
   - 选择 "切换到浅色主题"
   - 或 "切换到深色主题"

---

## 💡 使用技巧

### 1. 建议问题

首次进入 AI 页面时，会显示建议问题：
- 帮我写一篇关于 AI 的文章
- 解释量子计算的基本原理
- 推荐几本学习 React 的书籍
- 如何提高工作效率？

点击任意建议即可快速开始对话！

### 2. 消息操作

每条 AI 消息都支持以下操作（悬浮显示）：
- **📋 复制**: 复制消息内容到剪贴板
- **🔄 重新生成**: 重新生成当前回复
- **👍 点赞**: 标记为有用的回复
- **👎 点踩**: 标记为无用的回复
- **⋯ 更多**: 更多操作（待实现）

### 3. 命令面板

按 `Cmd/Ctrl + K` 打开命令面板，可以：
- 搜索并切换到任何对话
- 快速创建新对话
- 切换主题
- 访问设置（待实现）

命令面板支持模糊搜索，输入关键词即可快速找到！

### 4. 侧边栏

- **移动端**: 点击左上角 ☰ 图标打开/关闭侧边栏
- **桌面端**: 侧边栏默认显示，可点击 ☰ 图标切换

---

## 🎨 视觉特色

### 1. 渐变背景

页面使用了动态渐变背景，包含：
- 多层渐变色（紫色/蓝色/琥珀色）
- 15-20 秒周期的轻微动画
- 自动适应浅色/深色主题

### 2. 毛玻璃效果

所有卡片和面板都使用了毛玻璃效果：
- 半透明背景
- 模糊效果（backdrop-blur）
- 细腻的边框

### 3. 流畅动画

- **打字机动画**: AI 回复逐字显示（30ms/字符）
- **消息入场**: 淡入+轻微上移动画
- **AI 思考**: 三点跳动动画
- **浮动效果**: 输入框轻微浮动

### 4. 交互反馈

- **聚焦 Glow**: 输入框聚焦时显示光晕
- **悬浮高亮**: 按钮和卡片 hover 时高亮
- **加载状态**: AI 生成时显示加载动画

---

## 🔧 高级配置

### 1. 修改打字速度

编辑 `client/src/components/ai/streaming-text.tsx`:

```tsx
// 默认: 30ms/字符
speed={30}

// 更快: 15ms/字符
speed={15}

// 更慢: 50ms/字符
speed={50}
```

### 2. 禁用动画

如果您偏好静态界面，系统会自动检测 `prefers-reduced-motion` 设置并禁用动画。

也可以在浏览器设置中启用 "减少动画" 选项。

### 3. 更改主题色

编辑 `client/src/app/globals.css` 中的 CSS 变量：

```css
/* AI 渐变色 */
--ai-gradient-start: #f6f4ff;
--ai-gradient-mid: #e8f0fe;
--ai-gradient-end: #f0f9ff;
```

### 4. 集成真实 AI API

编辑 `client/src/store/ai-store.ts`，替换 `simulateAIResponse` 函数：

```typescript
export async function simulateAIResponse(
  userMessage: string
): Promise<string> {
  // 替换为真实的 API 调用
  const response = await fetch('YOUR_AI_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });
  
  const data = await response.json();
  return data.reply;
}
```

---

## 📱 响应式支持

### 桌面端（> 1024px）
- 三栏布局：侧边栏 + 主内容 + 可选右侧面板
- 侧边栏宽度: 320px
- 主内容最大宽度: 896px

### 平板端（768px - 1024px）
- 两栏布局：侧边栏 + 主内容
- 侧边栏可折叠

### 移动端（< 768px）
- 单栏布局
- 侧边栏变为浮层（点击 ☰ 打开）
- 全屏对话区域

---

## 🐛 故障排除

### 1. 页面空白

**检查控制台是否有错误**
- 按 `F12` 打开开发者工具
- 查看 Console 选项卡

**确认依赖已安装**
```bash
cd client
pnpm install
```

### 2. 动画不流畅

**检查系统资源**
- 关闭其他占用资源的应用
- 检查 CPU/内存使用率

**禁用部分动画**
- 在浏览器设置中启用 "减少动画"
- 或编辑 `motion-config.ts` 降低动画复杂度

### 3. 对话不保存

**检查 LocalStorage**
- 打开开发者工具 → Application → Local Storage
- 确认 `ai-chat-storage` 键存在

**清除缓存**
```javascript
// 在浏览器控制台运行
localStorage.clear();
location.reload();
```

### 4. 深色模式不生效

**检查主题设置**
- 点击右上角主题切换按钮
- 或在命令面板中切换主题

**清除主题缓存**
```javascript
// 在浏览器控制台运行
localStorage.removeItem('theme');
location.reload();
```

---

## 📚 相关文档

- [实施总结](./NOTION-AI-IMPLEMENTATION-SUMMARY.md) - 完整的技术实施细节
- [设计规范](./spec.md) - 设计系统规范
- [任务清单](./tasks.md) - 开发任务清单

---

## 🎉 开始探索！

现在您已经准备好开始使用 Notion AI 风格的对话界面了！

有任何问题或建议，欢迎反馈。祝您使用愉快！✨

---

**Last Updated**: 2025年10月16日  
**Version**: 1.0.0  
**Project**: Ivan HappyWoods Design System

