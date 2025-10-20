"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIWelcomeState } from './ai-welcome-state';
import { AIChatState } from './ai-chat-state';
import { sendStreamMessage } from '@/lib/api-service';

// 状态管理接口
interface AIInterfaceState {
  mode: 'welcome' | 'chat';
  messages: Message[];
  currentSession: string;
  isTransitioning: boolean;
  isThinking: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * HappyWoods AI 智能助手界面
 * 
 * 特性：
 * - 初始引导状态和聊天状态的平滑过渡
 * - 基于项目现有设计系统的温暖自然风格
 * - 完整的状态管理和动画效果
 * 
 * @example
 * ```tsx
 * <NotionAIInterface />
 * ```
 */
export const NotionAIInterface: React.FC = () => {
  const [state, setState] = useState<AIInterfaceState>({
    mode: 'welcome',
    messages: [],
    currentSession: 'default',
    isTransitioning: false,
    isThinking: false
  });

  // 处理首次消息提交，触发状态切换
  const handleFirstMessage = async (message: string) => {
    if (!message.trim()) return;

    // 开始过渡动画
    setState(prev => ({ 
      ...prev, 
      isTransitioning: true 
    }));

    // 创建用户消息
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    // 延迟切换到聊天模式，配合退出动画
    setTimeout(async () => {
      setState(prev => ({
        ...prev,
        mode: 'chat',
        messages: [userMessage],
        isTransitioning: false,
        isThinking: true
      }));
      
      // 切换完成后，调用 API 获取回复
      const aiMessageId = `msg-${Date.now()}-ai`;
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isThinking: true  // 保持思考状态
      }));

      try {
        await sendStreamMessage(
          message,
          'default',
          (chunk: string, fullContent: string) => {
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId
                  ? { ...msg, content: fullContent }
                  : msg
              ),
              isThinking: false  // 收到第一个数据块时隐藏思考动画
            }));
          },
          () => {
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId
                  ? { ...msg, isStreaming: false }
                  : msg
              ),
              isThinking: false
            }));
          },
          (error: Error) => {
            console.error('API 错误:', error);
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(msg =>
                msg.id === aiMessageId
                  ? { 
                      ...msg, 
                      content: `抱歉，发生了错误：${error.message}\n\n请检查后端服务是否启动。`,
                      isStreaming: false 
                    }
                  : msg
              ),
              isThinking: false
            }));
          }
        );
      } catch (error) {
        console.error('发送消息失败:', error);
      }
    }, 600);
  };

  // 处理后续消息 - 使用真实 API
  const handleMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isThinking: true
    }));

    // 创建 AI 消息占位符
    const aiMessageId = `msg-${Date.now()}-ai`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
      isThinking: true  // 保持思考状态
    }));

    try {
      // 调用真实的流式 API
      await sendStreamMessage(
        message,
        state.currentSession,
        // onChunk - 接收到新内容时更新消息
        (chunk: string, fullContent: string) => {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: fullContent }
                : msg
            ),
            isThinking: false  // 收到数据时隐藏思考动画
          }));
        },
        // onComplete - 完成时
        () => {
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, isStreaming: false }
                : msg
            ),
            isThinking: false
          }));
        },
        // onError - 错误时
        (error: Error) => {
          console.error('API 错误:', error);
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg =>
              msg.id === aiMessageId
                ? { 
                    ...msg, 
                    content: `抱歉，发生了错误：${error.message}\n\n请检查：\n- 后端服务是否启动 (http://localhost:8000)\n- API Key 是否正确\n- 网络连接是否正常`,
                    isStreaming: false 
                  }
                : msg
            ),
            isThinking: false
          }));
        }
      );
    } catch (error) {
      console.error('发送消息失败:', error);
      setState(prev => ({
        ...prev,
        isThinking: false
      }));
    }
  };

  // 重置到欢迎状态
  const handleReset = () => {
    setState({
      mode: 'welcome',
      messages: [],
      currentSession: 'default',
      isTransitioning: false,
      isThinking: false
    });
  };

  return (
    <div className="notion-ai-interface w-full h-screen bg-[var(--surface-base)] overflow-hidden">
      <AnimatePresence mode="wait">
        {state.mode === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              y: -100,
              scale: 0.95
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="w-full h-full"
          >
            <AIWelcomeState 
              onSubmit={handleFirstMessage}
              isTransitioning={state.isTransitioning}
            />
          </motion.div>
        )}
        
        {state.mode === 'chat' && (
          <motion.div
            key="chat"
            initial={{ 
              opacity: 0, 
              y: 50,
              scale: 0.98
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            transition={{ 
              duration: 0.4, 
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="w-full h-full"
          >
            <AIChatState 
              messages={state.messages}
              onMessage={handleMessage}
              onReset={handleReset}
              isThinking={state.isThinking}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
