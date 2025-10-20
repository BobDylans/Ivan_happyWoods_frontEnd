/**
 * API Service for HappyWoods AI Backend
 * 
 * 提供与后端 AI 服务的通信接口
 */

// API 配置
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || 'dev-test-key-123',
  timeout: 30000, // 30 seconds
};

// 消息类型
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 流式响应事件类型
export interface StreamEvent {
  type: 'start' | 'delta' | 'end' | 'error';
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
export async function sendMessage(
  message: string,
  sessionId: string = 'default'
): Promise<ChatResponse> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/v1/conversation/message`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.apiKey,
      },
      body: JSON.stringify({
        text: message,
        output_mode: 'text',
        session_id: sessionId,
      }),
    }
  );

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
 * @param sessionId 会话 ID
 * @param onChunk 接收到数据块时的回调
 * @param onComplete 完成时的回调
 * @param onError 错误时的回调
 */
export async function sendStreamMessage(
  message: string,
  sessionId: string = 'default',
  onChunk: (content: string, fullContent: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/v1/chat/?t=${Date.now()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_CONFIG.apiKey,
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId,
          user_id: 'web_user',
          stream: true,
          model_config: {
            max_tokens: 8000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('✅ 流式响应接收完成，总字符数:', fullResponse.length);
        onComplete?.();
        break;
      }

      // 解码数据
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      // 处理每一行
      for (const line of lines) {
        if (line.trim() === '' || !line.startsWith('data:')) continue;

        try {
          const data: StreamEvent = JSON.parse(line.slice(5));

          if (data.type === 'delta' && data.content) {
            fullResponse += data.content;
            onChunk(data.content, fullResponse);
          } else if (data.type === 'end') {
            console.log('📡 接收到结束信号');
            onComplete?.();
            return;
          } else if (data.type === 'error') {
            throw new Error(data.error || '未知错误');
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
    console.error('❌ 流式请求错误:', error);
    onError?.(error as Error);
    throw error;
  }
}

/**
 * 获取会话历史
 */
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/v1/chat/history/${sessionId}`,
    {
      headers: {
        'X-API-Key': API_CONFIG.apiKey,
      },
    }
  );

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
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/v1/session/${sessionId}`,
    {
      method: 'DELETE',
      headers: {
        'X-API-Key': API_CONFIG.apiKey,
      },
    }
  );

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
        'X-API-Key': API_CONFIG.apiKey,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

