"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Plus, Paperclip, Smile, Copy, ThumbsUp, ThumbsDown, ArrowDown, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { Logo } from '@/components/icons/logo';
import { NotionSidebar } from './notion-sidebar';
import { AIThinking } from './ai-thinking';
import { MarkdownMessage } from './markdown-message';
import { DateSeparator } from './date-separator';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface AIChatStateProps {
  messages: Message[];
  onMessage: (message: string) => void;
  onReset: () => void;
  isThinking?: boolean;
}

/**
 * AI 聊天状态组件
 * 
 * 特性：
 * - 完整的聊天界面布局
 * - 固定底部输入框
 * - 自动滚动到最新消息
 * - 流畅的消息动画
 */
export const AIChatState: React.FC<AIChatStateProps> = ({
  messages,
  onMessage,
  onReset,
  isThinking = false
}) => {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 滚动到底部
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    setIsUserScrolling(false);
  };

  // 检测滚动状态
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    // 如果不在底部，显示滚动按钮
    setShowScrollButton(!isNearBottom);
    
    // 如果用户向上滚动，标记为用户滚动
    if (!isNearBottom) {
      setIsUserScrolling(true);
    }
  };

  // 只在非用户滚动时自动滚动
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom(true);
    }
  }, [messages, isUserScrolling]);

  // 自动调整输入框高度
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isComposing) {
      onMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewChat = () => {
    onReset();
  };

  // 复制消息
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 点赞消息
  const handleLikeMessage = (messageId: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // 如果之前点踩了，取消点踩
        setDislikedMessages(prevDisliked => {
          const newDisliked = new Set(prevDisliked);
          newDisliked.delete(messageId);
          return newDisliked;
        });
      }
      return newSet;
    });
  };

  // 点踩消息
  const handleDislikeMessage = (messageId: string) => {
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // 如果之前点赞了，取消点赞
        setLikedMessages(prevLiked => {
          const newLiked = new Set(prevLiked);
          newLiked.delete(messageId);
          return newLiked;
        });
      }
      return newSet;
    });
  };

  // 重新生成回复
  const handleRegenerateMessage = (messageIndex: number) => {
    // 找到该消息对应的用户问题
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage && userMessage.role === 'user') {
        // 重新发送用户消息
        onMessage(userMessage.content);
      }
    }
  };

  // 根据对话内容生成标题
  const getChatTitle = () => {
    if (messages.length === 0) {
      return "新对话";
    }
    
    // 使用第一条用户消息作为标题，限制长度
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.trim();
      return title.length > 20 ? title.substring(0, 20) + "..." : title;
    }
    
    return "AI 对话";
  };

  return (
    <div className="flex h-screen bg-[var(--surface-base)]">
      {/* 左侧边栏 */}
      <NotionSidebar 
        onNewChat={handleNewChat}
        currentChatId="current-chat"
      />

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部标题栏 */}
        <motion.div
          className="flex items-center justify-between px-6 py-4 bg-[var(--surface-base)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="text"
              size="icon"
              onClick={onReset}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className="text-lg font-semibold text-[var(--text-primary)] truncate"
                key={getChatTitle()}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {getChatTitle()}
              </motion.h1>
              <p className="text-sm text-[var(--text-secondary)]">
                HappyWoods AI
              </p>
            </div>
          </div>
          
          <Button
            variant="text"
            size="icon"
            onClick={handleNewChat}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0"
            title="新对话"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* 消息区域 */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto relative"
          onScroll={handleScroll}
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {messages.length === 0 ? (
              // 空状态
              <motion.div
                className="flex flex-col items-center justify-center h-full text-center min-h-[400px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-[var(--interactive-primary)] rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
                  开始与 AI 对话
                </h2>
                <p className="text-[var(--text-secondary)] max-w-md leading-relaxed">
                  我是您的智能助手，可以帮助您解答问题、处理任务、创作内容等。请在下方输入您的问题开始对话。
                </p>
              </motion.div>
            ) : (
              // 消息列表
              <div className="space-y-8">
                {/* 日期分隔符 */}
                <DateSeparator date={new Date()} sessionTitle="HappyWoods AI" />
                
                {messages.map((message, index) => {
                  // 跳过空的 AI 消息（流式输出占位符）
                  if (message.role === 'assistant' && !message.content) {
                    return null;
                  }
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.4
                      }}
                      className={cn(
                        "flex",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div className={cn(
                        "max-w-3xl",
                        message.role === 'user' ? 'ml-auto' : 'mr-auto'
                      )}>
                        {message.role === 'user' ? (
                          // 用户消息
                          <div className="bg-[var(--interactive-primary)] text-white rounded-2xl px-4 py-3">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        ) : (
                          // AI 消息 - 使用 Markdown 渲染
                          <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-2xl px-4 py-3">
                            {/* Markdown 渲染的消息内容 */}
                            <MarkdownMessage content={message.content} />
                          
                          {/* 消息操作按钮 - 仅在非流式状态显示 */}
                          {message.content && !message.isStreaming && (
                            <motion.div 
                              className="flex items-center gap-1 mt-3 pt-3 border-t border-[var(--border-subtle)]"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* 复制按钮 */}
                              <Button
                                variant="text"
                                size="icon"
                                onClick={() => handleCopyMessage(message.id, message.content)}
                                className={cn(
                                  "w-8 h-8 hover:bg-[var(--surface-elevated)] transition-all",
                                  copiedMessageId === message.id
                                    ? "text-[var(--status-success)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                                title={copiedMessageId === message.id ? "已复制" : "复制"}
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>

                              {/* 重新生成按钮 */}
                              <Button
                                variant="text"
                                size="icon"
                                onClick={() => handleRegenerateMessage(index)}
                                className="w-8 h-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                                title="重新生成"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>

                              {/* 点赞按钮 */}
                              <Button
                                variant="text"
                                size="icon"
                                onClick={() => handleLikeMessage(message.id)}
                                className={cn(
                                  "w-8 h-8 hover:bg-[var(--surface-elevated)] transition-all",
                                  likedMessages.has(message.id)
                                    ? "text-[var(--interactive-primary)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                                title="有帮助"
                              >
                                <ThumbsUp className={cn(
                                  "w-4 h-4",
                                  likedMessages.has(message.id) && "fill-current"
                                )} />
                              </Button>

                              {/* 点踩按钮 */}
                              <Button
                                variant="text"
                                size="icon"
                                onClick={() => handleDislikeMessage(message.id)}
                                className={cn(
                                  "w-8 h-8 hover:bg-[var(--surface-elevated)] transition-all",
                                  dislikedMessages.has(message.id)
                                    ? "text-[var(--status-error)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                                title="没有帮助"
                              >
                                <ThumbsDown className={cn(
                                  "w-4 h-4",
                                  dislikedMessages.has(message.id) && "fill-current"
                                )} />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  );
                })}
                
                {/* AI 思考动画 */}
                <AnimatePresence>
                  {isThinking && <AIThinking />}
                </AnimatePresence>
                
                {/* 滚动锚点 */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 滚动到底部按钮 */}
          <AnimatePresence>
            {showScrollButton && (
              <motion.div
                className="absolute bottom-6 right-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="primary"
                  size="icon"
                  onClick={() => scrollToBottom(true)}
                  className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl"
                  title="滚动到底部"
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 固定底部输入框 */}
        <motion.div
          className="border-t border-[var(--border-subtle)] bg-[var(--surface-base)] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className={cn(
                "relative bg-white border-2 rounded-xl transition-all duration-200 shadow-sm",
                "border-[var(--border-subtle)] focus-within:border-[var(--interactive-primary)]",
                "focus-within:shadow-md focus-within:shadow-[var(--interactive-primary)]/10"
              )}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="询问、搜索或制作任何内容..."
                  disabled={isThinking}
                  className="w-full min-h-[52px] max-h-[120px] px-4 py-3 pr-32 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-xl outline-none resize-none leading-relaxed disabled:opacity-50"
                  rows={1}
                />
                
                {/* 底部工具栏 */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="text"
                      size="icon"
                      className="w-8 h-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="text"
                      size="icon"
                      className="w-8 h-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={input.trim() && !isThinking ? "primary" : "text"}
                      size="icon"
                      onClick={handleSubmit}
                      disabled={!input.trim() || isComposing || isThinking}
                      className={cn(
                        "w-8 h-8 transition-all duration-200",
                        input.trim() && !isThinking
                          ? "bg-[var(--interactive-primary)] hover:bg-[var(--interactive-primary)]/90 text-white" 
                          : "text-[var(--text-secondary)]"
                      )}
                      title="发送"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 输入提示 */}
              <div className="flex items-center justify-center mt-3 text-xs text-[var(--text-secondary)]">
                <span>
                  HappyWoods AI 可能会出错，请核实重要信息。
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
