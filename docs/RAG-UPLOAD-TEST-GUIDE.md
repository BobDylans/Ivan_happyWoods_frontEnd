# RAG 上传功能测试指南

## 测试前准备

1. **启动后端服务**
   ```bash
   # 确保后端在 http://127.0.0.1:8000 运行
   ```

2. **启动前端开发服务器**
   ```bash
   cd client
   pnpm dev
   ```

3. **登录系统**
   - 访问登录页面
   - 使用有效的用户账号登录
   - 确保 `localStorage` 中有 `user_info` 数据

## 测试步骤

### 1. 验证用户信息

打开浏览器控制台,检查用户数据:

```javascript
// 检查用户信息
const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
console.log("User ID:", userInfo.user_id);
console.log("User Info:", userInfo);
```

**预期结果**: 应该看到有效的 `user_id` (UUID格式)

### 2. 访问 RAG 上传界面

- 导航到 Notion AI 页面或包含 RAG 上传组件的页面
- 点击"上传文档"或相关按钮

### 3. 测试文件上传

#### 测试用例 1: 正常上传单个文件

1. 点击文件选择区域
2. 选择一个 Markdown 文件 (`.md`)
3. 点击"开始上传"

**预期结果**:
- 上传进度条显示
- 收到成功响应
- 显示文档片段数量

#### 测试用例 2: 上传多个文件

1. 选择多个文件 (Markdown, PDF, DOCX)
2. 点击"开始上传"

**预期结果**:
- 所有文件都成功上传
- 响应中包含每个文件的处理结果

#### 测试用例 3: 拖拽上传

1. 准备好文件
2. 拖拽文件到上传区域
3. 点击"开始上传"

**预期结果**:
- 拖拽操作正常
- 文件被正确识别
- 上传成功

#### 测试用例 4: 未登录状态

1. 清空 `localStorage`:
   ```javascript
   localStorage.clear();
   ```
2. 尝试上传文件

**预期结果**:
- 显示错误提示: "未找到用户信息,请先登录"
- 上传被阻止

#### 测试用例 5: 无效文件格式

1. 选择不支持的文件类型 (如 `.jpg`, `.exe`)
2. 尝试上传

**预期结果**:
- 文件被拒绝或显示格式错误提示

#### 测试用例 6: 超大文件

1. 选择大于 20MB 的文件
2. 尝试上传

**预期结果**:
- 显示文件过大的错误提示

## 验证 API 请求

### 使用浏览器开发工具

1. 打开浏览器开发工具 (F12)
2. 切换到 Network 标签
3. 执行上传操作
4. 查找 `rag/user/upload` 请求

### 检查请求内容

**请求 URL**:
```
POST http://127.0.0.1:8000/api/v1/rag/user/upload
```

**请求头** (Headers):
- `Content-Type: multipart/form-data`
- `X-API-Key: xxx` (如果设置了)

**请求体** (Form Data):
```
user_id: 00000000-0000-0000-0000-000000000000
files: [File对象]
corpus_name: (可选)
corpus_id: (可选)
collection_name: (可选)
```

### 检查响应

**成功响应** (200):
```json
{
  "success": true,
  "message": "成功上传 1 个文件,共生成 15 个文档片段",
  "user_id": "00000000-0000-0000-0000-000000000000",
  "collection_name": "user_00000000_default_collection",
  "results": [
    {
      "filename": "test.md",
      "chunks_count": 15,
      "success": true
    }
  ]
}
```

**错误响应** (4xx/5xx):
```json
{
  "detail": "错误信息"
}
```

## 测试 Demo 文件

可以使用 `client/rag_demo.html` 进行独立测试:

1. 在浏览器中打开 `client/rag_demo.html`
2. 填写用户 ID (UUID)
3. 选择文件
4. 点击上传

## 常见问题排查

### 问题 1: 提示"未找到用户信息"

**原因**: `localStorage` 中没有 `user_info`

**解决**:
1. 重新登录
2. 检查登录响应是否正确保存用户信息

### 问题 2: 上传失败 (401 Unauthorized)

**原因**: 可能需要认证 Token

**解决**:
1. 检查后端是否需要 Bearer Token
2. 添加认证头到上传请求

### 问题 3: 上传失败 (400 Bad Request)

**原因**: 缺少必需参数或格式错误

**解决**:
1. 检查 `user_id` 是否为有效的 UUID
2. 检查文件格式是否支持
3. 查看浏览器控制台的详细错误信息

### 问题 4: CORS 错误

**原因**: 跨域请求被阻止

**解决**:
1. 确保后端正确配置 CORS
2. 检查 API 地址是否正确

## 自动化测试脚本

可以使用以下脚本进行快速测试:

```javascript
// 在浏览器控制台运行

async function testRagUpload() {
  // 1. 检查用户信息
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  if (!userInfo.user_id) {
    console.error("❌ 未找到用户信息,请先登录");
    return;
  }
  console.log("✅ 用户 ID:", userInfo.user_id);

  // 2. 创建测试文件
  const testContent = "# 测试文档\n\n这是一个测试文档。";
  const blob = new Blob([testContent], { type: "text/markdown" });
  const file = new File([blob], "test.md", { type: "text/markdown" });

  // 3. 构建 FormData
  const formData = new FormData();
  formData.append("user_id", userInfo.user_id);
  formData.append("files", file);

  // 4. 发送请求
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/rag/user/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ 上传成功:", data);
    } else {
      console.error("❌ 上传失败:", data);
    }
  } catch (error) {
    console.error("❌ 请求错误:", error);
  }
}

// 运行测试
testRagUpload();
```

## 测试清单

- [ ] 用户信息存在且有效
- [ ] 单文件上传成功
- [ ] 多文件上传成功
- [ ] 拖拽上传功能正常
- [ ] 未登录状态正确处理
- [ ] 文件格式验证正常
- [ ] 文件大小限制生效
- [ ] 上传进度显示正确
- [ ] 成功响应处理正确
- [ ] 错误响应处理正确
- [ ] API 请求包含 `user_id`
- [ ] API 端点正确 (`/api/v1/rag/user/upload`)
- [ ] 响应数据显示正确

## 后续测试

1. **性能测试**: 上传大量文件
2. **并发测试**: 同时多个上传任务
3. **网络测试**: 弱网环境下的表现
4. **边界测试**: 极端文件大小、特殊文件名等

