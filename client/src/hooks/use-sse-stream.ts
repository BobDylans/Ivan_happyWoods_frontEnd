"use client";

import { useCallback, useRef, useState } from 'react';
import type { SSEEvent, WorkflowEvent } from '@/types/workflow';

/**
 * SSE 流处理配置
 */
export interface SSEStreamConfig {
  /** API 端点 */
  apiUrl: string;
  /** API Key */
  apiKey?: string;
  /** 会话 ID */
  sessionId: string;
  /** 用户 ID */
  userId?: string;
  /** 是否启用流式 */
  stream?: boolean;
  /** 模型配置 */
  modelConfig?: {
    max_tokens?: number;
    temperature?: number;
  };
  /** 超时时间 (毫秒) */
  timeout?: number;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟 (毫秒) */
  retryDelay?: number;
}

/**
 * SSE 事件回调
 */
export interface SSECallbacks {
  /** 内容增量回调 */
  onDelta?: (content: string) => void;
  /** 工作流事件回调 */
  onWorkflowEvent?: (event: WorkflowEvent) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 完成回调 */
  onComplete?: (fullContent: string) => void;
  /** 工具调用回调 */
  onToolCalls?: (tools: any[]) => void;
}

/**
 * SSE 流处理 Hook
 * 
 * 处理 Server-Sent Events 流式响应，解析并分发各种事件
 * 
 * @example
 * ```tsx
 * const { sendMessage, isStreaming, abort } = useSSEStream({
 *   apiUrl: 'http://localhost:8000',
 *   sessionId: 'session_123',
 * });
 * 
 * await sendMessage('Hello', {
 *   onDelta: (content) => console.log('Delta:', content),
 *   onWorkflowEvent: (event) => console.log('Workflow:', event),
 * });
 * ```
 */
export function useSSEStream(config: SSEStreamConfig) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fullContentRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 默认配置
  const timeout = config.timeout || 30000; // 30秒
  const maxRetries = config.maxRetries || 3;
  const retryDelay = config.retryDelay || 1000; // 1秒

  /**
   * 分类错误类型
   */
  const classifyError = useCallback((error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (error.name === 'AbortError') {
      return 'canceled';
    }
    if (message.includes('timeout') || message.includes('超时')) {
      return 'timeout';
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('连接')) {
      return 'network';
    }
    if (message.includes('401') || message.includes('403')) {
      return 'auth';
    }
    if (message.includes('404')) {
      return 'notfound';
    }
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return 'server';
    }
    return 'unknown';
  }, []);

  /**
   * 获取友好的错误消息
   */
  const getFriendlyErrorMessage = useCallback((error: Error, errorType: string): string => {
    const errorMessages: Record<string, string> = {
      timeout: '⏱️ 请求超时\n\n服务器响应时间过长，请稍后重试。',
      network: '🌐 网络连接失败\n\n请检查：\n- 网络连接是否正常\n- 后端服务是否启动 (http://localhost:8000)\n- 防火墙是否阻止连接',
      auth: '🔐 身份验证失败\n\n请检查 API Key 是否正确。',
      notfound: '❓ 接口不存在\n\n请求的 API 端点不存在，请联系技术支持。',
      server: '🔧 服务器错误\n\n后端服务遇到问题，请稍后重试或联系技术支持。',
      canceled: '🛑 请求已取消',
      unknown: `❌ 未知错误\n\n${error.message}\n\n如果问题持续，请联系技术支持。`
    };
    
    return errorMessages[errorType] || errorMessages.unknown;
  }, []);

  /**
   * 解析 SSE 数据行
   */
  const parseSSELine = useCallback((line: string): SSEEvent | null => {
    if (!line.trim() || !line.startsWith('data:')) {
      return null;
    }

    try {
      const data = JSON.parse(line.slice(5)); // 去掉 "data:" 前缀
      return data as SSEEvent;
    } catch (error) {
      console.warn('⚠️ 解析 SSE 数据失败:', line, error);
      return null;
    }
  }, []);

  /**
   * 处理 SSE 事件
   */
  const handleSSEEvent = useCallback(
    (event: SSEEvent, callbacks: SSECallbacks) => {
      // 内容增量
      if (event.type === 'delta' && 'content' in event) {
        const content = event.content;
        fullContentRef.current += content;
        callbacks.onDelta?.(content);
      }
      // 工作流事件
      else if ('level' in event && (event.level === 'graph' || event.level === 'node')) {
        console.log(`🔄 工作流事件 [${event.level}]:`, event.type, event.data);
        callbacks.onWorkflowEvent?.(event as WorkflowEvent);
      }
      // 工具调用
      else if (event.type === 'tool_calls' && 'tool_calls' in event) {
        const toolNames = event.tool_calls.map((t: any) => t.function?.name || 'unknown').join(', ');
        console.log('🔧 工具调用:', toolNames, event.tool_calls);
        callbacks.onToolCalls?.(event.tool_calls);
      }
      // 错误
      else if (event.type === 'error' && 'error' in event) {
        console.error('❌ SSE 错误事件:', event);
        callbacks.onError?.(new Error(event.error));
      }
    },
    []
  );

  /**
   * 处理流式响应
   */
  const processStream = useCallback(
    async (response: Response, callbacks: SSECallbacks) => {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // 渲染节流变量
      let lastRenderTime = 0;
      const RENDER_THROTTLE_MS = 100;

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('✅ 流式响应完成，总字符数:', fullContentRef.current.length);
            break;
          }

          // 解码数据
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留不完整的行

          // 处理每一行
          for (const line of lines) {
            const event = parseSSELine(line);
            if (event) {
              handleSSEEvent(event, callbacks);
            }
          }

          // 节流渲染
          const now = Date.now();
          if (now - lastRenderTime < RENDER_THROTTLE_MS) {
            await new Promise(resolve => setTimeout(resolve, RENDER_THROTTLE_MS));
          }
          lastRenderTime = now;
        }

        // 完成回调
        callbacks.onComplete?.(fullContentRef.current);
      } finally {
        reader.releaseLock();
      }
    },
    [parseSSELine, handleSSEEvent]
  );

  /**
   * 发送消息并处理流式响应（带重试）
   */
  const sendMessage = useCallback(
    async (message: string, callbacks: SSECallbacks = {}, currentRetry = 0) => {
      // 重置状态
      fullContentRef.current = '';
      setIsStreaming(true);
      setRetryCount(currentRetry);

      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      // 设置超时
      timeoutRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          const timeoutError = new Error(`请求超时 (${timeout}ms)`);
          callbacks.onError?.(timeoutError);
        }
      }, timeout);

      const requestBody = {
        message,
        session_id: config.sessionId,
        user_id: config.userId || 'demo_user',
        stream: config.stream !== false, // 默认启用流式
        model_config: config.modelConfig || {
          max_tokens: 8000,
        },
      };

      const requestUrl = `${config.apiUrl}/api/v1/chat/?t=${Date.now()}`;
      
      console.log('📤 发送 API 请求:', {
        url: requestUrl,
        method: 'POST',
        retry: currentRetry,
        maxRetries,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.apiKey ? '***' : 'none',
        },
        body: requestBody,
      });

      try {
        const response = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'X-API-Key': config.apiKey }),
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        });

        // 清除超时
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
          
          // 分类错误并获取友好消息
          const errorType = classifyError(error);
          const friendlyMessage = getFriendlyErrorMessage(error, errorType);
          
          // 服务器错误且未达到最大重试次数，自动重试
          if ((errorType === 'network' || errorType === 'server' || errorType === 'timeout') && currentRetry < maxRetries) {
            console.log(`🔄 ${currentRetry + 1}/${maxRetries} 次重试，${retryDelay}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay * (currentRetry + 1))); // 指数退避
            return sendMessage(message, callbacks, currentRetry + 1);
          }
          
          // 包装错误消息
          const enhancedError = new Error(friendlyMessage);
          (enhancedError as any).type = errorType;
          (enhancedError as any).canRetry = currentRetry < maxRetries;
          (enhancedError as any).retryCount = currentRetry;
          
          throw enhancedError;
        }

        console.log('✅ API 响应成功，开始处理流式数据');

        // 重置重试计数
        setRetryCount(0);

        // 处理流式响应
        await processStream(response, callbacks);

        return fullContentRef.current;
      } catch (error) {
        // 清除超时
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log('🛑 请求已取消');
          } else {
            console.error('❌ 请求失败:', error);
            
            // 如果错误未经过分类，进行分类
            if (!(error as any).type) {
              const errorType = classifyError(error);
              const friendlyMessage = getFriendlyErrorMessage(error, errorType);
              (error as any).type = errorType;
              (error as any).friendlyMessage = friendlyMessage;
              (error as any).canRetry = currentRetry < maxRetries;
              (error as any).retryCount = currentRetry;
            }
            
            callbacks.onError?.(error);
            throw error;
          }
        }
        throw error;
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [config, processStream, timeout, maxRetries, retryDelay, classifyError, getFriendlyErrorMessage]
  );

  /**
   * 中止当前请求
   */
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
      console.log('🛑 已中止流式请求');
    }
  }, []);

  return {
    /** 是否正在流式传输 */
    isStreaming,
    /** 当前重试次数 */
    retryCount,
    /** 发送消息 */
    sendMessage,
    /** 中止当前请求 */
    abort,
  };
}
