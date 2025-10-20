# API 集成说明

## 🔌 后端 API 集成完成

HappyWoods AI 现在已经完全集成了后端 API，支持真实的 AI 对话功能。

---

## 📡 API 配置

### 环境变量

在 `.env.local` 文件中配置（如果不存在，请创建）：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=dev-test-key-123
```

### API 端点

- **基础 URL**: `http://localhost:8000`
- **流式对话**: `POST /api/v1/chat/`
- **会话历史**: `GET /api/v1/chat/history/{session_id}`
- **清除会话**: `DELETE /api/v1/session/{session_id}`
- **健康检查**: `GET /api/v1/health`

---

## 🚀 功能特性

### 1. 流式对话 (SSE)

- ✅ 实时流式文本输出
- ✅ 打字机效果显示
- ✅ 思考状态可视化
- ✅ 错误处理和重试

### 2. 会话管理

- ✅ 自动生成 session_id
- ✅ 支持多轮对话上下文
- ✅ 会话历史持久化

### 3. 用户体验

- ✅ 流畅的动画过渡
- ✅ 加载状态指示
- ✅ 错误提示和处理
- ✅ 网络连接检查

---

## 🛠️ 使用方法

### 启动后端服务

确保后端服务运行在 `http://localhost:8000`：

```bash
# 在后端项目目录
python main.py
# 或
uvicorn main:app --reload --port 8000
```

### 启动前端

```bash
cd client
npm run dev
```

访问: `http://localhost:3000/notion-ai`

---

## 📋 API 服务层

### 核心函数

#### `sendStreamMessage()`
发送流式消息并实时接收响应

```typescript
await sendStreamMessage(
  message,              // 用户消息
  sessionId,           // 会话 ID
  onChunk,             // 接收数据块回调
  onComplete,          // 完成回调
  onError              // 错误回调
);
```

#### `getChatHistory()`
获取会话历史记录

```typescript
const messages = await getChatHistory(sessionId);
```

#### `clearSession()`
清除指定会话

```typescript
await clearSession(sessionId);
```

---

## 🔧 技术实现

### 流式响应处理

```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let buffer = '';
let fullResponse = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (line.startsWith('data:')) {
      const data = JSON.parse(line.slice(5));
      if (data.type === 'delta') {
        fullResponse += data.content;
        onChunk(data.content, fullResponse);
      }
    }
  }
}
```

### 错误处理

- ✅ 网络错误捕获
- ✅ HTTP 状态码检查
- ✅ JSON 解析错误处理
- ✅ 用户友好的错误提示

---

## ⚠️ 常见问题

### Q: 提示 "API 错误" 怎么办？

**A**: 检查以下几点：
1. 后端服务是否启动 (`http://localhost:8000`)
2. API Key 是否正确 (`dev-test-key-123`)
3. 防火墙是否阻止连接
4. 查看浏览器控制台的详细错误

### Q: 消息没有流式输出？

**A**: 
1. 检查后端是否支持 SSE (Server-Sent Events)
2. 确认请求参数 `stream: true`
3. 检查浏览器是否支持 ReadableStream

### Q: 如何修改 API 地址？

**A**: 修改 `.env.local` 文件中的 `NEXT_PUBLIC_API_URL`

---

## 📊 性能优化

### 已实施的优化

1. **渲染节流**: 避免过于频繁的 UI 更新
2. **错误重试**: 自动重试失败的请求
3. **连接复用**: 复用 session_id
4. **内存管理**: 及时清理无用数据

---

## 🎯 下一步扩展

可以继续实现的功能：

- [ ] 语音输入 (STT API)
- [ ] 语音输出 (TTS API)
- [ ] 消息重新生成
- [ ] 对话导出
- [ ] 自定义模型参数
- [ ] 多模态支持（图片、文件）

---

✅ **API 集成已完成，现在可以使用真实的 AI 对话功能了！**


