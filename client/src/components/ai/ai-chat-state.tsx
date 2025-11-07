"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Plus,
  Smile,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ArrowDown,
  RefreshCw,
  Check,
  Trash2,
  Edit2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { AIThinking } from "./ai-thinking";
import { MarkdownMessage } from "./markdown-message";
import { DateSeparator } from "./date-separator";
import { WorkflowTimeline, type WorkflowEventData } from "./workflow-visual";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { HappyWoodsLogoIcon } from "@/components/icons/happy-woods-logo";
import { RagUpload } from "./rag-upload";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  workflowEvents?: WorkflowEventData[]; // 工作流事件
  error?: {
    message: string;
    type: string;
    canRetry: boolean;
    retryCount: number;
  };
}

interface AIChatStateProps {
  messages: Message[];
  onMessage: (message: string) => void;
  onReset: () => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRetryMessage?: (messageId: string) => void;
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
  onDeleteMessage,
  onEditMessage,
  onRetryMessage,
  isThinking = false,
}) => {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showRagUpload, setShowRagUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 注册键盘快捷键
  useKeyboardShortcuts([
    {
      key: "n",
      ctrlOrCmd: true,
      handler: () => {
        if (window.confirm("确定要开始新对话吗？当前对话将被清除。")) {
          onReset();
        }
      },
      description: "新建对话",
    },
    {
      key: "/",
      ctrlOrCmd: true,
      handler: () => {
        // TODO: 打开搜索功能
        console.log("搜索功能待实现");
      },
      description: "搜索对话",
    },
    {
      key: "k",
      ctrlOrCmd: true,
      handler: () => {
        // TODO: 打开命令菜单
        console.log("命令菜单待实现");
      },
      description: "打开命令菜单",
    },
    {
      key: "Escape",
      handler: () => {
        // 取消编辑
        if (editingMessageId) {
          setEditingMessageId(null);
          setEditingContent("");
        }
        // 取消删除确认
        if (deleteConfirmId) {
          setDeleteConfirmId(null);
        }
        // 关闭快捷键帮助
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        }
      },
      description: "取消/关闭",
    },
    {
      key: "?",
      ctrlOrCmd: true,
      handler: () => {
        setShowShortcutsHelp(!showShortcutsHelp);
      },
      description: "显示快捷键帮助",
    },
  ]);

  // 滚动到底部
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
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

  // 监听消息变化和思考状态，自动滚动
  useEffect(() => {
    if (!isUserScrolling) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      scrollToBottom(true);
    }
  }, [messages, isThinking, isUserScrolling]);

  // 当消息数量增加时，强制滚动（用户发送新消息）
  const prevMessageCountRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      // 新消息到来，重置用户滚动状态并滚动到底部
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsUserScrolling(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  // 自动调整输入框高度
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isComposing) {
      onMessage(input.trim());
      setInput("");
      // 发送消息后，强制滚动到底部
      setIsUserScrolling(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
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
      console.error("复制失败:", err);
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

  // 重新生成消息
  const handleRegenerateMessage = (messageIndex: number) => {
    // 找到该 AI 消息对应的用户消息
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.role === "user") {
        onMessage(userMessage.content);
      }
    }
  };

  // 开始编辑消息
  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
    // 聚焦到编辑框
    setTimeout(() => {
      editTextareaRef.current?.focus();
    }, 0);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingMessageId && editingContent.trim() && onEditMessage) {
      onEditMessage(editingMessageId, editingContent.trim());
      setEditingMessageId(null);
      setEditingContent("");
    }
  };

  // 删除消息 (带确认)
  const handleDeleteClick = (messageId: string) => {
    setDeleteConfirmId(messageId);
    // 3秒后自动取消确认状态
    setTimeout(() => {
      setDeleteConfirmId(null);
    }, 3000);
  };

  // 确认删除
  const handleConfirmDelete = (messageId: string) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
      setDeleteConfirmId(null);
    }
  };

  // 编辑框自动调整高度
  useEffect(() => {
    const textarea = editTextareaRef.current;
    if (textarea && editingMessageId) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [editingContent, editingMessageId]); // 根据对话内容生成标题
  const getChatTitle = () => {
    if (messages.length === 0) {
      return "新对话";
    }

    // 使用第一条用户消息作为标题，限制长度
    const firstUserMessage = messages.find(msg => msg.role === "user");
    if (firstUserMessage) {
      const title = firstUserMessage.content.trim();
      return title.length > 20 ? title.substring(0, 20) + "..." : title;
    }

    return "AI 对话";
  };

  return (
    <div className="flex h-screen bg-[var(--surface-base)]">
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
              <p className="text-sm text-[var(--text-secondary)]">HappyWoods AI</p>
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
          data-chat-container
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
                  return (
                    <motion.div
                      key={message.id}
                      initial={false}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn("max-w-3xl", message.role === "user" ? "ml-auto" : "mr-auto")}
                      >
                        {message.role === "user" ? (
                          // 用户消息
                          <div className="group relative">
                            {editingMessageId === message.id ? (
                              // 编辑模式
                              <div className="bg-[var(--surface-elevated)] border-2 border-[var(--interactive-primary)] rounded-2xl p-3 shadow-sm">
                                <textarea
                                  ref={editTextareaRef}
                                  value={editingContent}
                                  onChange={e => setEditingContent(e.target.value)}
                                  className="w-full bg-transparent text-[var(--text-primary)] text-sm leading-relaxed resize-none outline-none"
                                  rows={3}
                                  onKeyDown={e => {
                                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                      e.preventDefault();
                                      handleSaveEdit();
                                    }
                                    if (e.key === "Escape") {
                                      handleCancelEdit();
                                    }
                                  }}
                                />
                                <div className="flex items-center justify-end gap-2 mt-2 pt-2">
                                  <Button
                                    variant="text"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    className="text-xs"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    取消
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSaveEdit}
                                    disabled={!editingContent.trim()}
                                    className="text-xs"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    保存并重新生成
                                  </Button>
                                </div>
                                <p className="text-[10px] text-[var(--text-tertiary)] mt-1 opacity-60">
                                  Ctrl+Enter 保存 • Esc 取消
                                </p>
                              </div>
                            ) : (
                              // 显示模式
                              <>
                                <div className="bg-[var(--interactive-primary)] text-white rounded-2xl px-4 py-3">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                  </p>
                                </div>

                                {/* 用户消息操作按钮 - 鼠标悬停显示 */}
                                <div className="absolute -left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                  {onEditMessage && (
                                    <Button
                                      variant="text"
                                      size="icon"
                                      onClick={() => handleStartEdit(message.id, message.content)}
                                      className="w-8 h-8 text-[var(--text-secondary)] hover:text-[var(--interactive-primary)] hover:bg-[var(--surface-elevated)]"
                                      title="编辑消息"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                  )}

                                  {onDeleteMessage &&
                                    (deleteConfirmId === message.id ? (
                                      <Button
                                        variant="text"
                                        size="icon"
                                        onClick={() => handleConfirmDelete(message.id)}
                                        className="w-8 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 animate-pulse"
                                        title="确认删除?"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="text"
                                        size="icon"
                                        onClick={() => handleDeleteClick(message.id)}
                                        className="w-8 h-8 text-[var(--text-secondary)] hover:text-rose-600 hover:bg-[var(--surface-elevated)]"
                                        title="删除消息"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    ))}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          // AI 消息
                          <div>
                            {/* 工作流时间线 - 在消息内容之前显示 */}
                            {message.workflowEvents && message.workflowEvents.length > 0 && (
                              <WorkflowTimeline events={message.workflowEvents} />
                            )}

                            {/* 消息内容盒子 */}
                            <div
                              className={cn(
                                "bg-[var(--surface-elevated)] rounded-2xl px-4 py-3 shadow-sm",
                                message.error &&
                                  "border-2 border-rose-500/20 bg-gradient-to-br from-rose-50/50 to-orange-50/30"
                              )}
                            >
                              {/* 错误消息头部 - 带 Logo */}
                              {message.error && (
                                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-rose-500/10">
                                  <div className="flex items-center gap-2">
                                    <HappyWoodsLogoIcon size={24} className="text-rose-500" />
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-rose-600">
                                      抱歉，发生了错误
                                    </h4>
                                    <p className="text-xs text-rose-500/70 mt-0.5">
                                      请检查后端服务是否启动
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* 如果消息内容为空且正在思考,显示思考动画 */}
                              {!message.content && isThinking ? (
                                <AIThinking />
                              ) : (
                                // 否则显示 Markdown 渲染的消息内容
                                <MarkdownMessage content={message.content} />
                              )}

                              {/* 错误重试按钮 */}
                              {message.error && message.error.canRetry && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 pt-4 border-t border-rose-500/10"
                                >
                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-rose-500/70 font-medium">
                                        错误类型: {message.error.type}
                                      </span>
                                      <span className="text-xs text-rose-400 font-semibold">
                                        重试次数: {message.error.retryCount + 1}/3
                                      </span>
                                    </div>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => onRetryMessage?.(message.id)}
                                      className="w-full bg-gradient-to-r from-rose-50 to-orange-50 hover:from-rose-100 hover:to-orange-100 text-rose-600 border-rose-200 font-semibold shadow-sm hover:shadow-md transition-all"
                                    >
                                      重新发送请求
                                    </Button>
                                  </div>
                                </motion.div>
                              )}

                              {/* 消息操作按钮 - 仅在非流式状态显示 */}
                              {message.content && !message.isStreaming && !message.error && (
                                <motion.div
                                  className="flex items-center gap-1 mt-3 pt-3"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  style={{
                                    borderTop: "1px solid var(--border-subtle)",
                                    opacity: 0.3,
                                  }}
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
                                    <ThumbsUp
                                      className={cn(
                                        "w-4 h-4",
                                        likedMessages.has(message.id) && "fill-current"
                                      )}
                                    />
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
                                    <ThumbsDown
                                      className={cn(
                                        "w-4 h-4",
                                        dislikedMessages.has(message.id) && "fill-current"
                                      )}
                                    />
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

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
              <div
                className={cn(
                  "relative bg-white border-2 rounded-xl transition-all duration-200 shadow-sm",
                  "border-[var(--border-subtle)] focus-within:border-[var(--interactive-primary)]",
                  "focus-within:shadow-md focus-within:shadow-[var(--interactive-primary)]/10"
                )}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="询问、搜索或制作任何内容..."
                  disabled={isThinking}
                  className="w-full min-h-[52px] max-h-[120px] px-4 py-3 pr-32 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-xl outline-none resize-none leading-relaxed disabled:opacity-50"
                  rows={1}
                />

                {/* 底部工具栏 */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-subtle)] bg-gradient-to-r from-[var(--surface-base)] to-[var(--surface-elevated)]">
                  <div className="flex items-center gap-3">
                    {/* RAG 上传按钮 - 突出显示 */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -1 }} 
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowRagUpload(true)}
                        className="bg-gradient-to-r from-slate-50/80 to-gray-50/80 hover:from-slate-100/90 hover:to-gray-100/90 border border-slate-200/60 hover:border-slate-300/80 text-slate-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 px-5 py-2 min-w-[120px]"
                        title="上传文档到 RAG 知识库 - AI 将学习您的文档内容"
                      >
                        <span className="text-sm">上传文件</span>
                      </Button>
                      
                      {/* RAG 功能标签 */}
                      <motion.div
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md"
                        animate={{ 
                          rotate: [0, -3, 3, -3, 0],
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        RAG
                      </motion.div>
                    </motion.div>
                    
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
                <span>HappyWoods AI 可能会出错，请核实重要信息。</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 快捷键帮助浮层 */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowShortcutsHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--surface-elevated)] rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">⌨️ 键盘快捷键</h3>
                <Button
                  variant="text"
                  size="icon"
                  onClick={() => setShowShortcutsHelp(false)}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <ShortcutItem keys={["Ctrl", "N"]} description="新建对话" />
                <ShortcutItem keys={["Ctrl", "/"]} description="搜索对话" />
                <ShortcutItem keys={["Ctrl", "K"]} description="打开命令菜单" />
                <ShortcutItem keys={["Ctrl", "?"]} description="显示快捷键帮助" />
                <ShortcutItem keys={["Ctrl", "Enter"]} description="保存编辑并重新生成" />
                <ShortcutItem keys={["Esc"]} description="取消操作/关闭弹窗" />
                <ShortcutItem keys={["Enter"]} description="发送消息" />
                <ShortcutItem keys={["Shift", "Enter"]} description="换行" />
              </div>

              <p className="text-xs text-[var(--text-tertiary)] mt-6 text-center">
                Mac 用户请使用 ⌘ 代替 Ctrl
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RAG 上传模态框 */}
      <AnimatePresence>
        {showRagUpload && (
          <RagUpload
            onClose={() => setShowRagUpload(false)}
            apiUrl={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rag/upload` : undefined}
            apiKey={process.env.NEXT_PUBLIC_API_KEY}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// 快捷键显示组件
const ShortcutItem: React.FC<{ keys: string[]; description: string }> = ({ keys, description }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-[var(--text-secondary)]">{description}</span>
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="px-2 py-1 text-xs font-semibold bg-[var(--surface-base)] border border-[var(--border-subtle)] rounded shadow-sm">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-[var(--text-tertiary)] text-xs">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);
