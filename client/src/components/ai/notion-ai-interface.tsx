"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIWelcomeState } from "./ai-welcome-state";
import { AIChatState } from "./ai-chat-state";
import { SessionHistory } from "./session-history";
import { useSSEStream } from "@/hooks/use-sse-stream";
import { getOrCreateSessionId, getSessionDetail, isAuthenticated } from "@/lib/api-service";
import type { WorkflowEventData } from "./workflow-visual";

// 状态管理接口
interface AIInterfaceState {
  mode: "welcome" | "chat";
  messages: Message[];
  currentSession: string;
  isTransitioning: boolean;
  isThinking: boolean;
  workflowEvents: Map<string, WorkflowEventData[]>; // 每条消息对应的工作流事件
  showHistory: boolean; // 是否显示会话历史
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  workflowEvents?: WorkflowEventData[]; // 该消息的工作流事件
  error?: {
    message: string;
    type: string;
    canRetry: boolean;
    retryCount: number;
  };
}

/**
 * HappyWoods AI 智能助手界面
 *
 * 特性：
 * - 初始引导状态和聊天状态的平滑过渡
 * - 基于项目现有设计系统的温暖自然风格
 * - 完整的状态管理和动画效果
 * - 完整的 SSE 流式处理和工作流可视化
 * - 持久化的 session_id，确保会话连续性
 *
 * @example
 * ```tsx
 * <NotionAIInterface />
 * ```
 */
export const NotionAIInterface: React.FC = () => {
  const [state, setState] = useState<AIInterfaceState>(() => {
    // 初始化时获取或创建持久化的 session_id
    const persistedSessionId = getOrCreateSessionId("notion_ai");
    // 检查是否已登录
    const loggedIn = typeof window !== "undefined" && !!localStorage.getItem("auth_token");

    return {
      mode: "welcome",
      messages: [],
      currentSession: persistedSessionId,
      isTransitioning: false,
      isThinking: false,
      workflowEvents: new Map(),
      showHistory: loggedIn, // 只有登录后才显示历史
    };
  });

  // 使用完整的 SSE Hook
  const { sendMessage: sendSSEMessage } = useSSEStream({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    apiKey: process.env.NEXT_PUBLIC_API_KEY || "dev-test-key-123",
    sessionId: state.currentSession, // 使用持久化的 session_id
    userId: "web_user",
    stream: true,
    modelConfig: {
      max_tokens: 8000,
      temperature: 0.7,
    },
  });

  // 在组件挂载时记录 session_id
  useEffect(() => {
    console.log("📝 当前会话 Session ID:", state.currentSession);
  }, [state.currentSession]);

  // 处理首次消息提交，触发状态切换
  const handleFirstMessage = async (message: string) => {
    if (!message.trim()) return;

    // 开始过渡动画
    setState(prev => ({
      ...prev,
      isTransitioning: true,
    }));

    // 创建用户消息
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    // 延迟切换到聊天模式，配合退出动画
    setTimeout(async () => {
      setState(prev => ({
        ...prev,
        mode: "chat",
        messages: [userMessage],
        isTransitioning: false,
        isThinking: true,
      }));

      // 切换完成后，调用 API 获取回复
      const aiMessageId = `msg-${Date.now()}-ai`;
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isThinking: true,
      }));

      try {
        // 用于收集当前消息的工作流事件
        const currentWorkflowEvents: WorkflowEventData[] = [];

        // 使用完整的 SSE Hook
        await sendSSEMessage(message, {
          onDelta: content => {
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content: prev.messages.find(m => m.id === aiMessageId)!.content + content,
                    }
                  : msg
              ),
              isThinking: false, // 收到第一个数据块时隐藏思考动画
            }));
          },
          onWorkflowEvent: event => {
            console.log("🔄 工作流事件:", event);
            // 收集工作流事件
            currentWorkflowEvents.push({
              type: event.type as any,
              level: event.level,
              data: event.data,
              timestamp: Date.now(),
            });

            // 实时更新消息的工作流事件
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId
                  ? { ...msg, workflowEvents: [...currentWorkflowEvents] }
                  : msg
              ),
            }));
          },
          onToolCalls: tools => {
            console.log("🔧 工具调用:", tools.map(t => t.function?.name).join(", "));
            // 可以在这里显示工具调用状态
          },
          onComplete: fullContent => {
            console.log("✅ 消息完成，总字符数:", fullContent.length);
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
              ),
              isThinking: false,
            }));
          },
          onError: error => {
            console.error("❌ API 错误:", error);
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content: `抱歉，发生了错误：${error.message}\n\n请检查后端服务是否启动（http://localhost:8000）。`,
                      isStreaming: false,
                    }
                  : msg
              ),
              isThinking: false,
            }));
          },
        });
      } catch (error) {
        console.error("发送消息失败:", error);
      }
    }, 600);
  };

  // 处理后续消息 - 使用完整的 SSE Hook
  const handleMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isThinking: true,
    }));

    // 创建 AI 消息占位符
    const aiMessageId = `msg-${Date.now()}-ai`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
      isThinking: true,
    }));

    try {
      // 用于收集当前消息的工作流事件 (使用 Map 来合并相同工具的状态)
      const workflowEventsMap = new Map<string, WorkflowEventData>();

      // 使用完整的 SSE Hook
      await sendSSEMessage(message, {
        onDelta: content => {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: prev.messages.find(m => m.id === aiMessageId)!.content + content,
                  }
                : msg
            ),
            isThinking: false, // 收到数据时隐藏思考动画
          }));
        },
        onWorkflowEvent: event => {
          console.log("🔄 工作流事件:", event);

          // 为工具调用事件生成唯一键
          let eventKey: string;
          if (
            event.level === "node" &&
            (event.type === "tool_call_pending" ||
              event.type === "tool_executing" ||
              event.type === "tool_result")
          ) {
            // 相同工具的不同状态使用相同的 key,实现原地更新
            eventKey = `tool_${event.data?.tool || "unknown"}`;
          } else {
            // 其他事件使用唯一 key
            eventKey = `${event.level}_${event.type}_${Date.now()}`;
          }

          // 更新或添加事件
          workflowEventsMap.set(eventKey, {
            type: event.type as any,
            level: event.level,
            data: event.data,
            timestamp: Date.now(),
          });

          // 转换为数组并实时更新消息的工作流事件
          const currentWorkflowEvents = Array.from(workflowEventsMap.values());

          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId ? { ...msg, workflowEvents: currentWorkflowEvents } : msg
            ),
          }));
        },
        onToolCalls: tools => {
          console.log("🔧 工具调用:", tools.map(t => t.function?.name).join(", "));
        },
        onComplete: fullContent => {
          console.log("✅ 消息完成，总字符数:", fullContent.length);
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
            ),
            isThinking: false,
          }));
        },
        onError: error => {
          console.error("❌ API 错误:", error);
          const errorInfo = error as any;
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: errorInfo.friendlyMessage || error.message,
                    isStreaming: false,
                    error: {
                      message: error.message,
                      type: errorInfo.type || "unknown",
                      canRetry: errorInfo.canRetry ?? true,
                      retryCount: errorInfo.retryCount || 0,
                    },
                  }
                : msg
            ),
            isThinking: false,
          }));
        },
      });
    } catch (error) {
      console.error("发送消息失败:", error);
    }
  };

  // 重试消息
  const handleRetryMessage = async (messageId: string) => {
    // 找到出错的 AI 消息和它对应的用户消息
    const errorMessageIndex = state.messages.findIndex(msg => msg.id === messageId);
    if (errorMessageIndex === -1 || errorMessageIndex === 0) return;

    const userMessage = state.messages[errorMessageIndex - 1];
    if (userMessage.role !== "user") return;

    // 删除错误的 AI 消息
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId),
    }));

    // 重新发送用户消息
    await handleMessage(userMessage.content);
  };

  // 重置到欢迎状态
  const handleReset = () => {
    // 重置时创建新的 session_id
    const newSessionId = getOrCreateSessionId("notion_ai_new");
    const loggedIn = typeof window !== "undefined" && !!localStorage.getItem("auth_token");

    setState({
      mode: "welcome",
      messages: [],
      currentSession: newSessionId,
      isTransitioning: false,
      isThinking: false,
      workflowEvents: new Map(),
      showHistory: loggedIn,
    });

    console.log("🔄 创建新会话:", newSessionId);
  };

  // 删除消息
  const handleDeleteMessage = (messageId: string) => {
    setState(prev => {
      const messageIndex = prev.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return prev;

      // 如果删除的是用户消息，也删除后面的AI回复
      const message = prev.messages[messageIndex];
      const messagesToDelete = [messageId];

      if (message.role === "user" && messageIndex < prev.messages.length - 1) {
        const nextMessage = prev.messages[messageIndex + 1];
        if (nextMessage.role === "assistant") {
          messagesToDelete.push(nextMessage.id);
        }
      }

      return {
        ...prev,
        messages: prev.messages.filter(msg => !messagesToDelete.includes(msg.id)),
      };
    });
  };

  // 编辑消息
  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!newContent.trim()) return;

    setState(prev => {
      const messageIndex = prev.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return prev;

      // 更新消息内容，并删除该消息之后的所有消息
      const updatedMessages = prev.messages.slice(0, messageIndex + 1);
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: newContent.trim(),
        timestamp: new Date(),
      };

      return {
        ...prev,
        messages: updatedMessages,
        isThinking: true,
      };
    });

    // 编辑后自动重新生成AI回复
    await handleMessage(newContent.trim());
  };

  return (
    <div className="notion-ai-interface relative w-full h-screen bg-[var(--surface-base)] overflow-hidden">
      {/* 欢迎界面 - 绝对定位，向上滑出 */}
      <AnimatePresence>
        {state.mode === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: "-100%",
            }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1], // 自定义缓动：快速启动，平滑结束
            }}
            className="absolute inset-0 z-20"
          >
            <AIWelcomeState onSubmit={handleFirstMessage} isTransitioning={state.isTransitioning} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 对话界面 - 从下方滑入 */}
      <AnimatePresence>
        {state.mode === "chat" && (
          <motion.div
            key="chat"
            initial={{
              opacity: 0,
              y: "100%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1], // 与欢迎界面相同的缓动
            }}
            className="absolute inset-0 z-10"
          >
            <AIChatState
              messages={state.messages}
              onMessage={handleMessage}
              onReset={handleReset}
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
              onRetryMessage={handleRetryMessage}
              isThinking={state.isThinking}
              animated={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
