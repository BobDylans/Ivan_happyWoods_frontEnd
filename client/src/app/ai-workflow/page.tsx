"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { AIWelcomeState } from '@/components/ai/ai-welcome-state';
import { MarkdownMessage } from '@/components/ai/markdown-message';
import { AIThinking } from '@/components/ai/ai-thinking';
import { WorkflowTimeline } from '@/components/ai/workflow-timeline';
import { useSSEStream } from '@/hooks/use-sse-stream';
import { useAIStore } from '@/store/ai-store';
import { notionStaggerContainer, notionStaggerItem } from '@/lib/motion-config';
import { Send, StopCircle, User, Sparkles } from 'lucide-react';

/**
 * AI 对话页面（集成实时思考进度）
 * 
 * 特性：
 * - SSE 流式响应
 * - 实时工作流可视化
 * - 思考进度展示
 * - 工具调用追踪
 * 
 * @example
 * 访问 /ai-workflow 查看
 */
export default function AIWorkflowPage() {
  const [mode, setMode] = useState<'welcome' | 'chat'>('welcome');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    getCurrentConversation,
    addMessage,
    updateMessage,
    initWorkflowState,
    updateWorkflowState,
    attachWorkflowToMessage,
    clearWorkflowState,
    currentWorkflowState,
  } = useAIStore();

  // SSE 配置（可以从环境变量或设置中读取）
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dev-test-key-123';
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('session_id');
      if (!sid) {
        sid = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('session_id', sid);
      }
      return sid;
    }
    return 'default_session';
  });

  const { sendMessage: sendSSEMessage, isStreaming } = useSSEStream({
    apiUrl: API_URL,
    apiKey: API_KEY,
    sessionId,
  });

  const conversation = getCurrentConversation();

  // 自动滚动到底部
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, currentWorkflowState]);

  // 处理首次消息（从欢迎页进入聊天）
  const handleFirstMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return;

    // 切换到聊天模式
    setMode('chat');

    // 等待动画完成后发送消息
    setTimeout(() => {
      handleMessage(message);
    }, 300);
  };

  // 处理消息发送
  const handleMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return;

    // 添加用户消息
    addMessage({
      role: 'user',
      content: message,
    });

    // 创建 AI 消息占位符
    const aiMessageId = `msg-${Date.now()}-ai`;
    addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
    });
    setCurrentMessageId(aiMessageId);

    // 初始化工作流状态
    initWorkflowState();

    let fullContent = '';

    try {
      await sendSSEMessage(message, {
        // 内容增量回调
        onDelta: (content) => {
          fullContent += content;
          updateMessage(aiMessageId, {
            content: fullContent,
            isStreaming: true,
          });
        },
        
        // 工作流事件回调
        onWorkflowEvent: (event) => {
          updateWorkflowState(event);
          console.log('📊 工作流事件:', event.type, event.data);
        },
        
        // 工具调用回调
        onToolCalls: (tools) => {
          console.log('🔧 工具调用:', tools.map(t => t.function?.name));
        },
        
        // 完成回调
        onComplete: (finalContent) => {
          updateMessage(aiMessageId, {
            content: finalContent,
            isStreaming: false,
          });
          
          // 将工作流状态附加到消息
          attachWorkflowToMessage(aiMessageId);
          
          // 清除当前工作流状态
          setTimeout(() => {
            clearWorkflowState();
            setCurrentMessageId(null);
          }, 1000);
        },
        
        // 错误回调
        onError: (error) => {
          console.error('❌ SSE 错误:', error);
          updateMessage(aiMessageId, {
            content: `抱歉，发生了错误：${error.message}\n\n请检查：\n- 后端服务是否启动\n- API 地址是否正确\n- 网络连接是否正常`,
            isStreaming: false,
          });
          clearWorkflowState();
          setCurrentMessageId(null);
        },
      });
    } catch (error) {
      console.error('❌ 发送消息失败:', error);
    }
  };

  // 处理停止生成
  const handleStop = () => {
    // TODO: 实现中止请求
    console.log('停止生成');
  };

  // 示例建议
  const suggestions = [
    '搜索最新的 AI 技术动态',
    '计算 (123 + 456) * 789',
    '今天北京的天气如何？',
    '帮我写一段 Python 代码',
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-[var(--surface-base)]">
      <Navigation />
      
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'welcome' ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <AIWelcomeState onSubmit={handleFirstMessage} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full flex flex-col max-w-4xl mx-auto px-4"
            >
              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto py-8">
                {(!conversation || conversation.messages.length === 0) ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <p className="text-[var(--text-secondary)]">
                        开始与 AI 对话...
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleMessage(suggestion)}
                            className="px-4 py-2 rounded-full bg-[var(--surface-elevated)] hover:bg-[var(--interactive-hover)] text-sm transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    variants={notionStaggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-6"
                  >
                    {conversation.messages.map((message, index) => (
                      <React.Fragment key={message.id}>
                        <motion.div variants={notionStaggerItem}>
                          {/* 用户消息 */}
                          {message.role === 'user' ? (
                            <div className="flex justify-end gap-3 mb-6">
                              <div className="max-w-2xl">
                                <div className="px-6 py-4 rounded-2xl bg-[var(--interactive-primary)] text-white shadow-md">
                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] mt-2 px-2">
                                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--interactive-primary)] to-[var(--interactive-secondary)] flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          ) : (
                            /* AI 消息 */
                            <div className="flex gap-3 mb-6">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 max-w-2xl">
                                <div className="px-6 py-4 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-sm">
                                  <MarkdownMessage content={message.content} />
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] mt-2 px-2">
                                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>

                        {/* 显示工作流时间线（仅当前消息或已完成的消息） */}
                        {message.role === 'assistant' && (
                          <>
                            {/* 当前正在生成的消息 - 显示实时工作流 */}
                            {message.id === currentMessageId && currentWorkflowState && (
                              <motion.div
                                variants={notionStaggerItem}
                                className="ml-12"
                              >
                                <WorkflowTimeline
                                  workflowState={currentWorkflowState}
                                  show={true}
                                />
                              </motion.div>
                            )}
                            
                            {/* 已完成的消息 - 显示保存的工作流 */}
                            {message.workflowState && message.id !== currentMessageId && (
                              <motion.div
                                variants={notionStaggerItem}
                                className="ml-12"
                              >
                                <WorkflowTimeline
                                  workflowState={message.workflowState}
                                  show={true}
                                />
                              </motion.div>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    ))}

                    {/* 思考动画 */}
                    {isStreaming && currentWorkflowState && !currentWorkflowState.nodes.some(n => n.status === 'running') && (
                      <motion.div variants={notionStaggerItem}>
                        <AIThinking />
                      </motion.div>
                    )}

                    {/* 滚动锚点 */}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </div>

              {/* 输入框 */}
              <div className="flex-shrink-0 pb-8 space-y-4">
                {/* 快速示例按钮 */}
                {mode === 'chat' && conversation && conversation.messages.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 px-4"
                  >
                    <button
                      onClick={() => {
                        const question = "帮我查询今天的天气";
                        setInputValue(question);
                        handleMessage(question);
                      }}
                      disabled={isStreaming}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-sm text-blue-700 border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🌤️ 查询天气
                    </button>
                    <button
                      onClick={() => {
                        const question = "帮我搜索 React 19 的新特性";
                        setInputValue(question);
                        handleMessage(question);
                      }}
                      disabled={isStreaming}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-sm text-purple-700 border border-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔍 搜索信息
                    </button>
                    <button
                      onClick={() => {
                        const question = "计算 123 * 456 等于多少？";
                        setInputValue(question);
                        handleMessage(question);
                      }}
                      disabled={isStreaming}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-sm text-green-700 border border-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔢 计算数字
                    </button>
                    <button
                      onClick={() => {
                        const question = "获取当前时间";
                        setInputValue(question);
                        handleMessage(question);
                      }}
                      disabled={isStreaming}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-sm text-orange-700 border border-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ⏰ 获取时间
                    </button>
                  </motion.div>
                )}

                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleMessage(inputValue);
                        setInputValue('');
                      }
                    }}
                    placeholder="问 AI 任何问题... (例如: 帮我查询天气、搜索信息、计算数字等)"
                    disabled={isStreaming}
                    className="w-full px-6 py-4 pr-16 rounded-2xl border-2 border-[var(--border-subtle)] bg-white focus:border-[var(--interactive-primary)] focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                    maxLength={2000}
                  />
                  <button
                    onClick={() => {
                      if (isStreaming) {
                        handleStop();
                      } else {
                        handleMessage(inputValue);
                        setInputValue('');
                      }
                    }}
                    disabled={!isStreaming && !inputValue.trim()}
                    className="absolute right-4 bottom-4 p-3 rounded-full bg-[var(--interactive-primary)] hover:bg-[var(--interactive-hover)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isStreaming ? (
                      <StopCircle className="w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {inputValue.length > 1800 && (
                  <div className="text-xs text-[var(--text-tertiary)] mt-2">
                    {inputValue.length} / 2000
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
