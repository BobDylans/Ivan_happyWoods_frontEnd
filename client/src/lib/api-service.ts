/**
 * API Service for HappyWoods AI Backend
 *
 * 提供与后端 AI 服务的通信接口
 */

// API 配置
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  apiKey: process.env.NEXT_PUBLIC_API_KEY || "dev-test-key-123",
  timeout: 30000, // 30 seconds
};

/**
 * 获取或创建持久化的 session ID
 * 确保同一个会话始终使用相同的 session_id
 */
export function getOrCreateSessionId(conversationId?: string): string {
  if (typeof window === "undefined") {
    return `session_${Date.now()}`;
  }

  const storageKey = conversationId ? `chat_session_${conversationId}` : "chat_session_default";

  // 尝试从 localStorage 获取已存在的 session_id
  let sessionId = localStorage.getItem(storageKey);

  // 如果不存在，创建新的 session_id
  if (!sessionId) {
    // 尝试从 user_info 获取 user_id
    let userId = "web_user";
    try {
      const userInfoStr = localStorage.getItem("user_info");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userId = userInfo.user_id || userInfo.username || "web_user";
      }
    } catch (e) {
      console.warn("解析用户信息失败:", e);
    }

    sessionId = `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

/**
 * 清除指定会话的 session ID
 */
export function clearSessionId(conversationId?: string): void {
  if (typeof window === "undefined") return;

  const storageKey = conversationId ? `chat_session_${conversationId}` : "chat_session_default";
  localStorage.removeItem(storageKey);
}

// ============================================
// 认证相关接口
// ============================================

interface LoginRequest {
  username: string; // 后端使用 username 字段
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string; // 可选字段
}

interface AuthResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: {
    user_id: string;
    username: string;
    email: string;
    full_name?: string;
    is_active: boolean;
    created_at: string;
  };
  message?: string;
}

/**
 * 用户登录
 * 使用 OAuth2 Password Flow
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    // OAuth2 Password Flow 使用 application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "登录失败");
    }

    // 保存 Token 到 localStorage
    if (data.access_token) {
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error("登录错误:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "登录失败",
    };
  }
}

/**
 * 用户注册
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name || null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "注册失败");
    }

    return {
      success: true,
      message: data.message || "注册成功",
    };
  } catch (error) {
    console.error("注册错误:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "注册失败",
    };
  }
}

/**
 * 用户登出
 */
export function logout(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");

  // 清除所有会话
  Object.keys(localStorage)
    .filter(key => key.startsWith("chat_session"))
    .forEach(key => localStorage.removeItem(key));
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  if (typeof window === "undefined") return null;

  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token 过期，清除本地存储
        logout();
      }
      return null;
    }

    const data = await response.json();
    // 保存用户信息
    localStorage.setItem("user_info", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("获取用户信息错误:", error);
    return null;
  }
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("auth_token");
  return !!token;
}

/**
 * 获取认证 token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("auth_token");
}

/**
 * 刷新 Token
 */
export async function refreshAuthToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      logout();
      return false;
    }

    const data = await response.json();

    // 更新 Token
    localStorage.setItem("auth_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return true;
  } catch (error) {
    console.error("刷新 Token 错误:", error);
    logout();
    return false;
  }
}

// ==================== 原有的消息相关类型和函数 ====================

// 消息类型
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// 流式响应事件类型
export interface StreamEvent {
  type: "start" | "delta" | "end" | "error";
  content?: string;
  session_id?: string;
  error?: string;
}

// 请求参数
export interface ChatRequest {
  message: string;
  session_id?: string;
  user_id?: string;
  stream?: boolean;
  model_config?: {
    max_tokens?: number;
    temperature?: number;
  };
}

// 响应类型
export interface ChatResponse {
  session_id: string;
  agent_response: string;
}

/**
 * 发送聊天消息（非流式）
 */
export async function sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
  // 使用持久化的 session_id
  const finalSessionId = sessionId || getOrCreateSessionId();

  const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/conversation/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_CONFIG.apiKey,
    },
    body: JSON.stringify({
      text: message,
      output_mode: "text",
      session_id: finalSessionId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * 发送聊天消息（流式）
 *
 * @param message 用户消息
 * @param sessionId 会话 ID（可选，不传则使用持久化的 session_id）
 * @param onChunk 接收到数据块时的回调
 * @param onComplete 完成时的回调
 * @param onError 错误时的回调
 */
export async function sendStreamMessage(
  message: string,
  sessionId: string | undefined,
  onChunk: (content: string, fullContent: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  // 使用持久化的 session_id
  const finalSessionId = sessionId || getOrCreateSessionId();

  // 优先使用 JWT Token，如果没有则使用 API Key
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["X-API-Key"] = API_CONFIG.apiKey;
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/chat/?t=${Date.now()}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: message,
        session_id: finalSessionId,
        user_id: "web_user",
        stream: true,
        model_config: {
          max_tokens: 8000,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401 && token) {
        // Token 过期，尝试刷新
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // 重试请求
          return sendStreamMessage(message, sessionId, onChunk, onComplete, onError);
        }
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法读取响应流");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("✅ 流式响应接收完成，总字符数:", fullResponse.length);
        onComplete?.();
        break;
      }

      // 解码数据
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      // 处理每一行
      for (const line of lines) {
        if (line.trim() === "" || !line.startsWith("data:")) continue;

        try {
          const data: StreamEvent = JSON.parse(line.slice(5));

          if (data.type === "delta" && data.content) {
            fullResponse += data.content;
            onChunk(data.content, fullResponse);
          } else if (data.type === "end") {
            console.log("📡 接收到结束信号");
            onComplete?.();
            return;
          } else if (data.type === "error") {
            throw new Error(data.error || "未知错误");
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            // JSON 解析错误，忽略不完整的数据
            continue;
          }
          throw e;
        }
      }
    }
  } catch (error) {
    console.error("❌ 流式请求错误:", error);
    onError?.(error as Error);
    throw error;
  }
}

/**
 * 获取会话历史
 */
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/chat/history/${sessionId}`, {
    headers: {
      "X-API-Key": API_CONFIG.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.messages || [];
}

/**
 * 清除会话
 */
export async function clearSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/session/${sessionId}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_CONFIG.apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

/**
 * 健康检查
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/health`, {
      headers: {
        "X-API-Key": API_CONFIG.apiKey,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ============================================
// 会话管理接口
// ============================================

/**
 * 会话列表响应类型
 */
export interface SessionListResponse {
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
  sessions: SessionItem[];
}

/**
 * 会话项
 */
export interface SessionItem {
  session_id: string;
  user_id: string;
  status: string;
  message_count: number;
  created_at: string;
  last_activity: string;
}

/**
 * 会话详情响应类型
 */
export interface SessionDetailResponse {
  session_id: string;
  user_id: string;
  status: string;
  total_messages: number;
  created_at: string;
  last_activity: string;
  messages: SessionMessage[];
}

/**
 * 会话消息
 */
export interface SessionMessage {
  message_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

/**
 * 获取用户的会话列表
 * 需要 JWT Token 认证
 */
export async function getUserSessions(
  page: number = 1,
  pageSize: number = 10
): Promise<SessionListResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("未登录，请先登录");
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/conversation/sessions/?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token 过期，尝试刷新
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // 重试请求
          return getUserSessions(page, pageSize);
        }
        throw new Error("认证失败，请重新登录");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("获取会话列表错误:", error);
    throw error;
  }
}

/**
 * 获取特定会话的详情
 * 需要 JWT Token 认证
 */
export async function getSessionDetail(sessionId: string): Promise<SessionDetailResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("未登录，请先登录");
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/conversation/sessions/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token 过期，尝试刷新
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // 重试请求
          return getSessionDetail(sessionId);
        }
        throw new Error("认证失败，请重新登录");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("获取会话详情错误:", error);
    throw error;
  }
}

/**
 * 创建新会话响应类型
 */
export interface CreateSessionResponse {
  success: boolean;
  message: string;
  session_id: string;
  title: string;
  created_at: string;
}

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

/**
 * 创建新会话
 * 需要 JWT Token 认证
 */
export async function createNewSession(title?: string): Promise<CreateSessionResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("未登录，请先登录");
  }

  try {
    const defaultTitle = `对话 ${new Date().toLocaleString("zh-CN")}`;

    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/conversation/sessions/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title || defaultTitle,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token 过期，尝试刷新
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // 重试请求
          return createNewSession(title);
        }
        throw new Error("认证失败，请重新登录");
      }
      throw new Error(data.message || data.detail || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("创建会话错误:", error);
    throw error;
  }
}

/**
 * 删除会话
 * 需要 JWT Token 认证
 */
export async function deleteSession(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("未登录，请先登录");
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/conversation/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token 过期，尝试刷新
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // 重试请求
          return deleteSession(sessionId);
        }
        throw new Error("认证失败，请重新登录");
      }
      throw new Error(data.message || data.detail || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("删除会话错误:", error);
    throw error;
  }
}

// ==================== RAG 知识库 API ====================

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
): Promise<RagUploadResponse> {
  const formData = new FormData();
  
  // 必须参数：用户 ID
  formData.append("user_id", userId);
  
  // 添加文件
  files.forEach(file => {
    formData.append("files", file, file.name);
  });
  
  // 可选参数
  if (options?.corpus_name) {
    formData.append("corpus_name", options.corpus_name);
  }
  if (options?.corpus_id) {
    formData.append("corpus_id", options.corpus_id);
  }
  if (options?.collection_name) {
    formData.append("collection_name", options.collection_name);
  }
  
  const headers: HeadersInit = {};
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/rag/user/upload`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("上传 RAG 文档错误:", error);
    throw error;
  }
}
