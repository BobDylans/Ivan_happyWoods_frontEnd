# RAG 上传接口更新文档

## 更新日期
2025-01-XX

## 更新目的
根据后端 API 要求,更新 RAG 文档上传接口,确保必须传递用户的 UUID。

## 参考文档
- `client/rag_demo.html` - 后端提供的正确 API 使用示例

## 核心更新

### 1. API 端点更新
**原端点**: `/api/v1/rag/upload`  
**新端点**: `/api/v1/rag/user/upload`

### 2. 必需参数
- **user_id** (UUID格式) - 必须传递,从 `localStorage.user_info` 获取

### 3. 可选参数
- `corpus_name` - 知识库名称
- `corpus_id` - 自定义语料库 ID
- `collection_name` - 自定义集合名称

## 修改的文件

### 1. `client/src/components/ai/rag-upload.tsx`

#### 新增功能
```typescript
/**
 * 获取当前登录用户的 user_id (UUID)
 */
function getUserId(): string | null {
  try {
    const userInfoStr = localStorage.getItem("user_info");
    if (!userInfoStr) return null;
    const userInfo = JSON.parse(userInfoStr);
    return userInfo.user_id || null;
  } catch (error) {
    console.error("Failed to get user_id:", error);
    return null;
  }
}
```

#### 更新的内容
1. **默认 API URL**: 
   ```typescript
   apiUrl = "http://127.0.0.1:8000/api/v1/rag/user/upload"
   ```

2. **上传逻辑**:
   ```typescript
   // 获取用户 ID (必须)
   const userId = getUserId();
   if (!userId) {
     setProgress({
       percent: 0,
       status: "error",
       message: "未找到用户信息,请先登录",
     });
     return;
   }

   const formData = new FormData();
   // 必须先添加 user_id
   formData.append("user_id", userId);
   // 添加文件
   files.forEach(file => {
     formData.append("files", file, file.name);
   });
   ```

3. **类型定义**:
   ```typescript
   interface UploadResult {
     success: boolean;
     message?: string;
     user_id?: string;
     collection_name?: string;
     results?: Array<{
       filename: string;
       chunks_count: number;
       success: boolean;
       error?: string;
     }>;
   }
   ```

### 2. `client/src/lib/api-service.ts`

#### 新增类型定义
```typescript
// RAG 知识库相关类型定义
export interface RagUploadResult {
  filename: string;
  chunks_count: number;
  success: boolean;
  error?: string;
}

export interface RagUploadResponse {
  success: boolean;
  message: string;
  user_id: string;
  collection_name: string;
  results: RagUploadResult[];
}
```

#### 新增 API 函数
```typescript
/**
 * 上传文档到 RAG 知识库
 * 需要传递用户 UUID
 * 
 * @param files - 要上传的文件数组
 * @param userId - 用户 UUID (必须)
 * @param options - 可选参数 (corpus_name, corpus_id, collection_name)
 * @param apiKey - 可选的 API Key
 */
export async function uploadRagDocuments(
  files: File[],
  userId: string,
  options?: {
    corpus_name?: string;
    corpus_id?: string;
    collection_name?: string;
  },
  apiKey?: string
): Promise<RagUploadResponse>
```

## API 使用示例

### 基本用法
```typescript
import { uploadRagDocuments } from "@/lib/api-service";

// 获取用户 ID
const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
const userId = userInfo.user_id;

// 上传文件
const result = await uploadRagDocuments(
  [file1, file2],
  userId
);
```

### 带可选参数
```typescript
const result = await uploadRagDocuments(
  files,
  userId,
  {
    corpus_name: "我的知识库",
    corpus_id: "custom-corpus-001",
    collection_name: "custom_collection"
  },
  "optional-api-key"
);
```

## 数据流

1. **用户登录** → `user_info` 存储在 `localStorage`
2. **选择文件** → 调用 RAG 上传组件
3. **获取 user_id** → 从 `localStorage.user_info.user_id`
4. **构建 FormData**:
   - `user_id` (必须,UUID)
   - `files[]` (文件数组)
   - `corpus_name` (可选)
   - `corpus_id` (可选)
   - `collection_name` (可选)
5. **发送请求** → `POST /api/v1/rag/user/upload`
6. **处理响应** → 显示上传结果

## 后端 API 响应示例

### 成功响应
```json
{
  "success": true,
  "message": "成功上传 2 个文件,共生成 45 个文档片段",
  "user_id": "00000000-0000-0000-0000-000000000000",
  "collection_name": "user_00000000_default_collection",
  "results": [
    {
      "filename": "document1.md",
      "chunks_count": 20,
      "success": true
    },
    {
      "filename": "document2.pdf",
      "chunks_count": 25,
      "success": true
    }
  ]
}
```

### 错误响应
```json
{
  "detail": "user_id is required"
}
```

## 测试要点

1. ✅ 检查未登录状态 → 应显示"未找到用户信息,请先登录"
2. ✅ 检查 user_id 是否正确传递
3. ✅ 验证上传成功后的响应处理
4. ✅ 验证上传失败的错误提示
5. ✅ 测试多文件上传
6. ✅ 测试可选参数传递

## 兼容性说明

- **向后兼容**: 旧的 `/api/v1/rag/upload` 端点已废弃
- **必须升级**: 所有 RAG 上传功能必须使用新端点
- **用户认证**: 必须先登录才能使用 RAG 上传功能

## 相关文档

- [API 集成手册](./api手册.md)
- [会话管理实现](./SESSION-MANAGEMENT-IMPLEMENTATION.md)
- [登录集成指南](./LOGIN-INTEGRATION.md)
