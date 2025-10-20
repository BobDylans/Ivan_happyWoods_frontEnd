# AI Components

Notion AI 风格的对话界面组件库

---

## 📦 组件列表

### 核心组件

#### `streaming-text.tsx`
流式打字机动画文本组件

```tsx
import { StreamingText } from '@/components/ai/streaming-text';

<StreamingText 
  text="Hello, **World**!" 
  speed={30}
  markdown={true}
  showCursor={true}
/>
```

**Props:**
- `text` - 要显示的文本
- `speed` - 打字速度（ms/字符），默认 30
- `markdown` - 是否支持 Markdown，默认 true
- `showCursor` - 是否显示光标，默认 true

---

#### `message.tsx`
消息气泡组件（用户/AI）

```tsx
import { Message } from '@/components/ai/message';

<Message
  content="你好！"
  role="user"
  timestamp={new Date()}
  showActions={true}
/>
```

**组件:**
- `Message` - 通用消息（自动判断角色）
- `UserMessage` - 用户消息
- `AIMessage` - AI 消息
- `MessageActions` - 消息操作按钮
- `AIThinking` - AI 思考动画

**Props:**
- `content` - 消息内容
- `role` - 'user' | 'assistant'
- `isStreaming` - 是否流式输出
- `isLoading` - 是否加载中
- `timestamp` - 时间戳
- `showActions` - 是否显示操作按钮
- `onRegenerate` - 重新生成回调
- `onFeedback` - 反馈回调

---

#### `ai-input.tsx`
AI 输入框组件

```tsx
import { AIInput } from '@/components/ai/ai-input';

<AIInput
  onSubmit={(msg) => console.log(msg)}
  isGenerating={false}
  placeholder="问 AI 任何问题..."
  maxLength={2000}
/>
```

**组件:**
- `AIInput` - 完整输入框
- `CompactAIInput` - 紧凑版输入框

**Props:**
- `onSubmit` - 提交回调
- `onStop` - 停止生成回调
- `isGenerating` - 是否正在生成
- `disabled` - 是否禁用
- `placeholder` - 占位符
- `maxLength` - 最大字符数
- `showCharCount` - 是否显示字符计数
- `enableAttachments` - 是否启用附件

**快捷键:**
- `Enter` - 发送消息
- `Shift + Enter` - 换行

---

#### `ai-layout.tsx`
AI 页面布局容器

```tsx
import { AILayout } from '@/components/ai/ai-layout';

<AILayout
  sidebar={<AISidebar />}
  useGradientBackground={true}
>
  <YourContent />
</AILayout>
```

**组件:**
- `AILayout` - 主布局容器
- `ChatContainer` - 对话容器
- `AIEmptyState` - 空状态

**Props:**
- `sidebar` - 侧边栏内容
- `rightPanel` - 右侧面板（可选）
- `defaultSidebarOpen` - 默认是否打开侧边栏
- `useGradientBackground` - 是否使用渐变背景

---

#### `ai-sidebar.tsx`
对话历史侧边栏

```tsx
import { AISidebar } from '@/components/ai/ai-sidebar';

<AISidebar />
```

**组件:**
- `AISidebar` - 完整侧边栏
- `CompactSidebar` - 紧凑版

**功能:**
- 对话历史列表
- 创建/删除/重命名对话
- 切换对话
- 空状态提示

---

#### `gradient-background.tsx`
渐变背景组件

```tsx
import { GradientBackground } from '@/components/ai/gradient-background';

<GradientBackground animated={true}>
  <YourContent />
</GradientBackground>
```

**组件:**
- `GradientBackground` - 动态渐变背景
- `GlassPanel` - 毛玻璃面板
- `FloatingCard` - 浮动卡片
- `MeshGradient` - 网格渐变

**Props:**
- `animated` - 是否启用动画
- `className` - 自定义类名
- `children` - 子元素

---

#### `command-menu.tsx`
命令面板组件

```tsx
import { CommandMenu } from '@/components/ai/command-menu';

<CommandMenu />
```

**快捷键:**
- `Cmd/Ctrl + K` - 打开面板
- `↑` / `↓` - 导航
- `Enter` - 选择
- `ESC` - 关闭

**功能:**
- 模糊搜索
- 键盘导航
- 分组显示
- 快捷命令
- 对话历史快速访问

---

## 🎨 动画预设

使用 `motion-config.ts` 中的预设：

```tsx
import { notionFadeIn, messageAppear } from '@/lib/motion-config';

<motion.div
  variants={notionFadeIn}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

**可用预设:**
- `notionFadeIn` - 淡入+上移
- `notionPulse` - 脉冲动画
- `notionSlide` - 侧边栏滑动
- `messageAppear` - 消息渐显
- `floating` - 浮动动画
- `backdropBlurIn` - 模糊入场
- `smoothExpand` - 平滑展开
- `aiThinking` - AI 思考动画
- `notionStaggerContainer` & `notionStaggerItem` - 交错动画

---

## 🔧 Hooks

### `use-streaming-text.ts`
打字机动画 Hook

```tsx
import { useStreamingText } from '@/hooks/use-streaming-text';

const { displayedText, isTyping, skip, reset } = useStreamingText(
  'Hello, World!',
  { speed: 30, autoStart: true }
);
```

**返回值:**
- `displayedText` - 当前显示的文本
- `isTyping` - 是否正在打字
- `isComplete` - 是否完成
- `start` - 开始打字
- `pause` - 暂停打字
- `skip` - 跳过动画
- `reset` - 重置

---

## 💾 状态管理

### `ai-store.ts`
Zustand 状态管理

```tsx
import { useAIStore } from '@/store/ai-store';

const {
  currentConversationId,
  conversations,
  addMessage,
  createConversation,
  selectConversation,
} = useAIStore();
```

**状态:**
- `currentConversationId` - 当前对话 ID
- `conversations` - 对话字典
- `isGenerating` - 是否正在生成
- `isSidebarOpen` - 侧边栏是否打开

**Actions:**
- `createConversation()` - 创建新对话
- `deleteConversation(id)` - 删除对话
- `selectConversation(id)` - 选择对话
- `updateConversationTitle(id, title)` - 更新标题
- `addMessage(message)` - 添加消息
- `updateMessage(id, updates)` - 更新消息
- `deleteMessage(id)` - 删除消息
- `clearCurrentConversation()` - 清空当前对话
- `setIsGenerating(bool)` - 设置生成状态
- `toggleSidebar()` - 切换侧边栏

**Getters:**
- `getCurrentConversation()` - 获取当前对话
- `getConversationList()` - 获取对话列表

---

## 🎯 使用示例

### 完整的 AI 页面

```tsx
"use client";

import { AILayout } from '@/components/ai/ai-layout';
import { AISidebar } from '@/components/ai/ai-sidebar';
import { Message } from '@/components/ai/message';
import { AIInput } from '@/components/ai/ai-input';
import { CommandMenu } from '@/components/ai/command-menu';
import { useAIStore } from '@/store/ai-store';

export default function AIPage() {
  const { 
    getCurrentConversation, 
    addMessage, 
    isGenerating,
    setIsGenerating 
  } = useAIStore();
  
  const conversation = getCurrentConversation();

  const handleSubmit = async (userMessage: string) => {
    addMessage({ role: 'user', content: userMessage });
    setIsGenerating(true);
    
    // 调用 AI API
    const aiResponse = await callAIAPI(userMessage);
    
    addMessage({ role: 'assistant', content: aiResponse });
    setIsGenerating(false);
  };

  return (
    <>
      <CommandMenu />
      
      <AILayout sidebar={<AISidebar />}>
        <div className="space-y-6">
          {conversation?.messages.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </div>
        
        <AIInput
          onSubmit={handleSubmit}
          isGenerating={isGenerating}
        />
      </AILayout>
    </>
  );
}
```

---

## 🎨 样式定制

所有组件使用 CSS 变量，可在 `globals.css` 中定制：

```css
/* AI 渐变色 */
--ai-gradient-start: #f6f4ff;
--ai-gradient-mid: #e8f0fe;
--ai-gradient-end: #f0f9ff;

/* AI 消息气泡 */
--ai-message-bg: rgba(255, 255, 255, 0.8);
--ai-message-border: rgba(0, 0, 0, 0.08);

/* AI 加载动画 */
--ai-pulse-color: #8b5cf6;
```

---

## 📚 更多文档

- [快速开始指南](../../../../specs/001-design-specification-ivan/AI-QUICK-START.md)
- [实施总结](../../../../specs/001-design-specification-ivan/NOTION-AI-IMPLEMENTATION-SUMMARY.md)
- [设计规范](../../../../specs/001-design-specification-ivan/spec.md)

---

**Created**: 2025年10月16日  
**Version**: 1.0.0  
**License**: MIT

