# Ivan_HappyWoods API 手册

> 更新时间：2025-10-15

---

## 目录
- [通用说明](#通用说明)
- [会话与对话 API](#会话与对话-api)
- [流式对话 API](#流式对话-api)
- [语音服务 API (TTS/STT)](#语音服务-api-tts-stt)
- [会话管理 API](#会话管理-api)
- [健康检查](#健康检查)
- [常见问题](#常见问题)

---

## 通用说明
- 所有 API 前缀均为：`/api/v1/`
- 推荐请求头：
  - `Content-Type: application/json`
  - `X-API-Key: dev-test-key-123`（如启用 API Key）
- 返回格式：`application/json`，除 TTS 音频流为 `audio/mpeg`

---

## 会话与对话 API

### 1. 文本对话（非流式）
- **接口**：`POST /api/v1/conversation/message`
- **功能**：发送文本消息，获得完整回复
- **请求体**：
```json
{
  "text": "你好",
  "output_mode": "text",
  "session_id": "test-001"
}
```
- **返回体**：
```json
{
  "session_id": "test-001",
  "agent_response": "你好！很高兴为你服务。有什么我可以帮忙的？"
}
```
- **示例代码**：
```python
import requests
r = requests.post(
  "http://localhost:8000/api/v1/conversation/message",
  json={"text": "你好", "output_mode": "text", "session_id": "test-001"},
  headers={"Content-Type": "application/json", "X-API-Key": "dev-test-key-123"}
)
print(r.json())
```

---

## 流式对话 API

### 2. SSE 流式对话
- **接口**：`POST /api/v1/chat/`
- **功能**：流式返回 LLM 回复（Server-Sent Events）
- **请求体**：
```json
{
  "message": "请用一句话介绍人工智能",
  "session_id": "test-002",
  "stream": true
}
```
- **返回体**：SSE 事件流，每条数据格式：
```json
{
  "type": "delta",  // 事件类型: start, delta, end, error
  "content": "人工智能是计算机科学的一个分支...",
  "session_id": "test-002"
}
```
- **Python 示例**：
```python
import requests
with requests.post(
  "http://localhost:8000/api/v1/chat/",
  json={"message": "介绍人工智能", "session_id": "test-002", "stream": True},
  headers={"Content-Type": "application/json", "X-API-Key": "dev-test-key-123"},
  stream=True
) as r:
    for line in r.iter_lines():
        if line and line.startswith(b'data:'):
            print(line.decode())
```

---

## 语音服务 API (TTS/STT)

### 3. 语音合成（TTS）
- **接口**：`POST /api/v1/voice/tts/synthesize`
- **功能**：文本转语音，返回 MP3 音频流
- **请求体**：
```json
{
  "text": "你好，这是一段测试语音。",
  "voice": "x5_lingxiaoxuan_flow",
  "format": "mp3"
}
```
- **返回**：`audio/mpeg` 音频流
- **Python 示例**：
```python
import requests
r = requests.post(
  "http://localhost:8000/api/v1/voice/tts/synthesize",
  json={"text": "你好，这是一段测试语音。", "voice": "x5_lingxiaoxuan_flow", "format": "mp3"},
  headers={"Content-Type": "application/json", "X-API-Key": "dev-test-key-123"}
)
if r.status_code == 200 and "audio" in r.headers.get("Content-Type", ""):
    with open("tts.mp3", "wb") as f:
        f.write(r.content)
```

### 4. 语音识别（STT）
- **接口**：`POST /api/v1/voice/stt/recognize`
- **功能**：上传音频文件，返回识别文本
- **请求体**：`multipart/form-data`，字段名 `audio`
- **cURL 示例**：
```bash
curl -X POST "http://localhost:8000/api/v1/voice/stt/recognize" \
  -H "X-API-Key: dev-test-key-123" \
  -F "audio=@test.mp3"
```
- **返回体**：
```json
{
  "text": "你好，这是一段测试语音。",
  "success": true,
  "duration_seconds": 2.5,
  "audio_format": "mp3",
  "converted": true
}
```
- **Python 示例**：
```python
import requests
with open("test.mp3", "rb") as f:
    files = {"audio": ("test.mp3", f, "audio/mpeg")}
    r = requests.post(
        "http://localhost:8000/api/v1/voice/stt/recognize",
        files=files,
        headers={"X-API-Key": "dev-test-key-123"}
    )
    print(r.json())
```

---

## 会话管理 API

### 5. 查询对话历史
- **接口**：`GET /api/v1/chat/history/{session_id}`
- **功能**：获取指定会话的历史消息
- **返回体**：
```json
{
  "session_id": "test-001",
  "messages": [
    {"role": "user", "content": "你好"},
    {"role": "assistant", "content": "你好！很高兴为你服务。"}
  ]
}
```
- **Python 示例**：
```python
import requests
r = requests.get(
  "http://localhost:8000/api/v1/chat/history/test-001",
  headers={"X-API-Key": "dev-test-key-123"}
)
print(r.json())
```

### 6. 清除会话
- **接口**：`DELETE /api/v1/session/{session_id}`
- **功能**：清除指定会话的所有历史
- **返回体**：
```json
{
  "session_id": "test-001",
  "cleared": true
}
```
- **Python 示例**：
```python
import requests
r = requests.delete(
  "http://localhost:8000/api/v1/session/test-001",
  headers={"X-API-Key": "dev-test-key-123"}
)
print(r.json())
```

---

## 健康检查

### 7. 健康检查
- **接口**：`GET /api/v1/health`
- **功能**：检查服务运行状态
- **返回体**：
```json
{
  "status": "healthy",
  "version": "0.2.0"
}
```
- **Python 示例**：
```python
import requests
r = requests.get("http://localhost:8000/api/v1/health")
print(r.json())
```

---

## 常见问题

- **API Key 未配置/错误**：返回 401 Unauthorized
- **TTS 发音人未授权**：返回 licc limit 错误，需用已开通的 voice
- **音频格式不支持**：STT 返回 error_message，需用 mp3/wav/m4a 等
- **流式对话事件类型**：SSE 事件类型为 start、delta、end、error

---

> 如需更多接口或参数说明，请查阅 Swagger UI: http://localhost:8000/docs
