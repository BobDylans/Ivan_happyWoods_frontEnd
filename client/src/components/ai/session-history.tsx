"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  MessageSquare,
  Clock,
  ChevronRight,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { getUserSessions, getSessionDetail, type SessionItem } from "@/lib/api-service";
import { cn } from "@/lib/utils";

interface SessionHistoryProps {
  onSelectSession?: (sessionId: string) => void;
  onNewChat?: () => void; // 新增:新建会话回调
  currentSessionId?: string;
  refreshKey?: number; // 新增:刷新key,变化时重新加载列表
}

// 扩展的会话项,包含第一条消息
interface EnhancedSessionItem extends SessionItem {
  firstMessage?: string;
  isLoadingTitle?: boolean;
}

/**
 * 会话历史组件
 *
 * 特性：
 * - 显示用户的所有历史会话
 * - 点击会话可加载历史消息
 * - 支持分页加载
 * - 显示会话时间和消息数量
 * - 高亮当前活动会话
 */
export const SessionHistory: React.FC<SessionHistoryProps> = ({
  onSelectSession,
  onNewChat,
  currentSessionId,
  refreshKey,
}) => {
  const [sessions, setSessions] = useState<EnhancedSessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 获取会话的第一条消息作为标题
  const loadSessionTitle = useCallback(async (session: EnhancedSessionItem) => {
    try {
      const detail = await getSessionDetail(session.session_id);
      const firstUserMessage = detail.messages.find(msg => msg.role === "user");
      const title = firstUserMessage?.content || `会话 ${session.session_id.slice(-8)}`;

      // 更新会话的标题
      setSessions(prev =>
        prev.map(s =>
          s.session_id === session.session_id
            ? { ...s, firstMessage: title, isLoadingTitle: false }
            : s
        )
      );
    } catch (err) {
      console.error("加载会话标题失败:", err);
      // 失败时使用默认标题
      setSessions(prev =>
        prev.map(s =>
          s.session_id === session.session_id
            ? { ...s, firstMessage: `会话 ${session.session_id.slice(-8)}`, isLoadingTitle: false }
            : s
        )
      );
    }
  }, []);

  // 加载会话列表
  const loadSessions = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getUserSessions(pageNum, 10);

        // 将会话转换为增强的会话项
        const enhancedSessions: EnhancedSessionItem[] = response.sessions.map(s => ({
          ...s,
          isLoadingTitle: true,
        }));

        if (append) {
          setSessions(prev => [...prev, ...enhancedSessions]);
        } else {
          setSessions(enhancedSessions);
        }

        setHasMore(response.has_more);
        setPage(pageNum);

        // 异步加载每个会话的标题
        enhancedSessions.forEach(session => {
          loadSessionTitle(session);
        });
      } catch (err) {
        console.error("加载会话列表失败:", err);
        setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        setIsLoading(false);
      }
    },
    [loadSessionTitle]
  );

  // 初始加载
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 监听 refreshKey 变化,重新加载列表
  useEffect(() => {
    if (refreshKey && refreshKey > 0) {
      console.log("🔄 检测到 refreshKey 变化,刷新会话列表");
      loadSessions(1, false);
    }
  }, [refreshKey, loadSessions]);

  // 刷新列表
  const handleRefresh = () => {
    loadSessions(1, false);
  };

  // 加载更多
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadSessions(page + 1, true);
    }
  };

  // 选择会话
  const handleSelectSession = async (session: SessionItem) => {
    if (onSelectSession) {
      onSelectSession(session.session_id);
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface-base)] border-r border-[var(--border-subtle)]">
      {/* 头部 */}
      <div className="flex flex-col gap-2 p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--interactive-primary)] transition-colors"
          >
            <History className="w-5 h-5" />
            <span className="font-semibold">会话历史</span>
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors disabled:opacity-50"
            title="刷新列表"
          >
            <RefreshCw
              className={cn("w-4 h-4 text-[var(--text-secondary)]", isLoading && "animate-spin")}
            />
          </button>
        </div>

        {/* 新建会话按钮 */}
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--interactive-primary)] hover:bg-[var(--interactive-primary-hover)] text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>新建会话</span>
          </button>
        )}
      </div>

      {/* 会话列表 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden"
          >
            <div className="h-full overflow-y-auto">
              {/* 错误提示 */}
              {error && (
                <div className="p-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
                    >
                      重试
                    </button>
                  </div>
                </div>
              )}

              {/* 会话列表 */}
              {!error && sessions.length > 0 && (
                <div className="p-2 space-y-1">
                  {sessions.map((session, index) => (
                    <motion.button
                      key={session.session_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectSession(session)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all hover:bg-[var(--surface-elevated)]",
                        currentSessionId === session.session_id &&
                          "bg-[var(--interactive-primary)]/10 border border-[var(--interactive-primary)]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare
                          className={cn(
                            "w-5 h-5 mt-0.5 flex-shrink-0",
                            currentSessionId === session.session_id
                              ? "text-[var(--interactive-primary)]"
                              : "text-[var(--text-secondary)]"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium truncate",
                                currentSessionId === session.session_id
                                  ? "text-[var(--interactive-primary)]"
                                  : "text-[var(--text-primary)]"
                              )}
                              title={session.firstMessage || `会话 ${session.session_id.slice(-8)}`}
                            >
                              {session.isLoadingTitle ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  加载中...
                                </span>
                              ) : session.firstMessage ? (
                                // 截断长文本,最多显示 35 个字符
                                session.firstMessage.length > 35 ? (
                                  session.firstMessage.substring(0, 35) + "..."
                                ) : (
                                  session.firstMessage
                                )
                              ) : (
                                `会话 ${session.session_id.slice(-8)}`
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                            <span className="text-xs text-[var(--text-secondary)]">
                              {formatTime(session.last_activity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* 空状态 */}
              {!error && !isLoading && sessions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <History className="w-12 h-12 text-[var(--text-secondary)] mb-4 opacity-50" />
                  <p className="text-sm text-[var(--text-secondary)]">暂无历史会话</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    开始对话后会显示在这里
                  </p>
                </div>
              )}

              {/* 加载更多 */}
              {hasMore && !isLoading && (
                <div className="p-4">
                  <button
                    onClick={handleLoadMore}
                    className="w-full py-2 text-sm text-[var(--interactive-primary)] hover:bg-[var(--surface-elevated)] rounded-lg transition-colors"
                  >
                    加载更多
                  </button>
                </div>
              )}

              {/* 加载中 */}
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 text-[var(--interactive-primary)] animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
