# Session ID 持久化管理

## 📝 概述

为了确保后端能正确维护会话上下文，前端实现了 **Session ID 持久化机制**。同一个会话将始终使用相同的 `session_id`，确保对话的连续性。

---

## 🔑 核心功能

### 1. **自动持久化**
```typescript
// 自动从 localStorage 获取或创建 session_id
const sessionId = getOrCreateSessionId("notion_ai");
```

### 2. **会话隔离**
不同的会话（如不同的页面或对话）可以使用不同的 `conversationId` 来隔离：

```typescript
// Notion AI 会话
const notionSessionId = getOrCreateSessionId("notion_ai");

// AI Workflow 会话
const workflowSessionId = getOrCreateSessionId("ai_workflow");

// 默认会话
const defaultSessionId = getOrCreateSessionId();
```

### 3. **会话清理**
重置对话或创建新会话时，可以清除旧的 session_id：

```typescript
clearSessionId("notion_ai");
const newSessionId = getOrCreateSessionId("notion_ai");
```

---

## 📦 API 使用

### `getOrCreateSessionId(conversationId?: string): string`

获取或创建持久化的 session ID。

**参数：**
- `conversationId` (可选): 会话标识符，用于区分不同的对话

**返回值：**
- `string`: 持久化的 session_id

**示例：**
```typescript
import { getOrCreateSessionId } from '@/lib/api-service';

// 使用默认会话
const sessionId = getOrCreateSessionId();

// 使用命名会话
const notionSessionId = getOrCreateSessionId('notion_ai');
```

---

### `clearSessionId(conversationId?: string): void`

清除指定会话的 session ID。

**参数：**
- `conversationId` (可选): 会话标识符

**示例：**
```typescript
import { clearSessionId } from '@/lib/api-service';

// 清除默认会话
clearSessionId();

// 清除命名会话
clearSessionId('notion_ai');
```

---

## 🔄 工作流程

### 初始化流程

```
┌─────────────────────────────────────┐
│  用户打开 Notion AI 界面             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  getOrCreateSessionId('notion_ai')  │
└─────────────┬───────────────────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
  已存在？       不存在
        │           │
        │           ▼
        │   创建新的 session_id
        │   格式: {userId}_{timestamp}_{random}
        │           │
        │           ▼
        │   保存到 localStorage
        │   key: chat_session_notion_ai
        │           │
        └─────┬─────┘
              │
              ▼
┌─────────────────────────────────────┐
│  返回 session_id 供 API 使用        │
└─────────────────────────────────────┘
```

### 发送消息流程

```
┌─────────────────────────────────────┐
│  用户发送消息                        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  sendStreamMessage(message)         │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  使用持久化的 session_id            │
│  const finalSessionId =             │
│    sessionId || getOrCreateSessionId() │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  POST /api/v1/chat/                 │
│  Body: {                            │
│    session_id: finalSessionId,      │
│    message: "用户消息"              │
│  }                                   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  后端根据 session_id 维护会话上下文 │
└─────────────────────────────────────┘
```

---

## 💾 LocalStorage 结构

```javascript
// 存储格式
{
  "chat_session_notion_ai": "web_user_1730628000000_abc123def",
  "chat_session_ai_workflow": "web_user_1730628100000_xyz789ghi",
  "chat_session_default": "web_user_1730628200000_mno456pqr",
  "user_id": "web_user"
}
```

### Session ID 格式

```
{userId}_{timestamp}_{randomString}

示例：web_user_1730628000000_abc123def
       ↑        ↑               ↑
     用户ID   时间戳(ms)      随机字符串(7位)
```

---

## 🎯 最佳实践

### 1. **为不同功能使用不同的会话标识**

```typescript
// ✅ 推荐：使用命名会话
const notionAI = getOrCreateSessionId('notion_ai');
const workflow = getOrCreateSessionId('ai_workflow');
const chat = getOrCreateSessionId('main_chat');

// ❌ 不推荐：所有功能共用一个会话
const sessionId = getOrCreateSessionId(); // 可能导致上下文混乱
```

### 2. **在重置对话时清理旧会话**

```typescript
const handleReset = () => {
  // 清除旧的 session_id
  clearSessionId('notion_ai');
  
  // 创建新的 session_id
  const newSessionId = getOrCreateSessionId('notion_ai');
  
  setState({
    ...state,
    currentSession: newSessionId,
    messages: []
  });
};
```

### 3. **在组件初始化时获取 session_id**

```typescript
const [state, setState] = useState(() => {
  // 初始化时获取持久化的 session_id
  const persistedSessionId = getOrCreateSessionId('notion_ai');
  
  return {
    mode: 'welcome',
    messages: [],
    currentSession: persistedSessionId,
    // ...
  };
});
```

### 4. **记录 session_id 便于调试**

```typescript
useEffect(() => {
  console.log('📝 当前会话 Session ID:', state.currentSession);
}, [state.currentSession]);
```

---

## 🔍 调试指南

### 查看当前 Session ID

**方法 1：浏览器控制台**
```javascript
// 查看所有会话
Object.keys(localStorage)
  .filter(key => key.startsWith('chat_session'))
  .forEach(key => {
    console.log(`${key}: ${localStorage.getItem(key)}`);
  });

// 查看特定会话
localStorage.getItem('chat_session_notion_ai');
```

**方法 2：开发者工具**
1. 打开开发者工具 (F12)
2. 进入 **Application** / **存储** 标签
3. 左侧选择 **Local Storage**
4. 查看 `chat_session_*` 键

### 清除所有会话

```javascript
// 清除所有会话数据
Object.keys(localStorage)
  .filter(key => key.startsWith('chat_session'))
  .forEach(key => localStorage.removeItem(key));
```

---

## 📊 实现细节

### api-service.ts

```typescript
/**
 * 获取或创建持久化的 session ID
 * 确保同一个会话始终使用相同的 session_id
 */
export function getOrCreateSessionId(conversationId?: string): string {
  if (typeof window === 'undefined') {
    return `session_${Date.now()}`;
  }

  const storageKey = conversationId 
    ? `chat_session_${conversationId}` 
    : 'chat_session_default';

  // 尝试从 localStorage 获取已存在的 session_id
  let sessionId = localStorage.getItem(storageKey);

  // 如果不存在，创建新的 session_id
  if (!sessionId) {
    const userId = localStorage.getItem('user_id') || 'web_user';
    sessionId = `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}
```

### notion-ai-interface.tsx

```typescript
const [state, setState] = useState<AIInterfaceState>(() => {
  // 初始化时获取或创建持久化的 session_id
  const persistedSessionId = getOrCreateSessionId('notion_ai');

  return {
    mode: 'welcome',
    messages: [],
    currentSession: persistedSessionId, // ✅ 使用持久化的 session_id
    isTransitioning: false,
    isThinking: false,
    workflowEvents: new Map(),
  };
});
```

---

## ⚠️ 注意事项

1. **SSR 兼容性**
   - 在服务端渲染时，`localStorage` 不可用
   - 代码已处理：返回临时 session_id

2. **浏览器隐私模式**
   - 隐私模式下 `localStorage` 可能被禁用
   - 每次刷新会创建新的 session_id

3. **跨域问题**
   - `localStorage` 受同源策略限制
   - 不同域名下的会话无法共享

4. **存储限制**
   - `localStorage` 通常限制 5-10MB
   - session_id 很小，不会有问题

---

## 🚀 测试场景

### 场景 1：持续对话
```
1. 用户打开页面，发送消息 "你好"
   → session_id: web_user_1730628000000_abc123

2. 收到回复后，继续发送 "介绍一下你自己"
   → session_id: web_user_1730628000000_abc123 (相同)

3. 刷新页面，发送 "我们刚才聊了什么？"
   → session_id: web_user_1730628000000_abc123 (相同)
   → 后端能识别并返回历史上下文
```

### 场景 2：新对话
```
1. 用户点击 "重置对话" 按钮
   → 清除旧 session_id
   → 创建新 session_id: web_user_1730628300000_xyz789

2. 发送新消息
   → 使用新的 session_id
   → 后端创建新的会话上下文
```

---

## 📚 相关文档

- [API 手册](./api手册.md)
- [快速启动指南](./快速启动指南.md)
- [API 集成说明](../client/API-INTEGRATION.md)

---

**最后更新**: 2025-11-03
**作者**: Ivan HappyWoods Team
