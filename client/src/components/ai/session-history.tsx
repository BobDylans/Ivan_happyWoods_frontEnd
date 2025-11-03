"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, MessageSquare, Clock, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { getUserSessions, type SessionItem } from "@/lib/api-service";
import { cn } from "@/lib/utils";

interface SessionHistoryProps {
  onSelectSession?: (sessionId: string) => void;
  currentSessionId?: string;
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
  currentSessionId,
}) => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 加载会话列表
  const loadSessions = async (pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserSessions(pageNum, 10);

      if (append) {
        setSessions(prev => [...prev, ...response.sessions]);
      } else {
        setSessions(response.sessions);
      }

      setHasMore(response.has_more);
      setPage(pageNum);
    } catch (err) {
      console.error("加载会话列表失败:", err);
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadSessions();
  }, []);

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
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
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
                            >
                              会话 {session.session_id.slice(-8)}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">
                              {session.message_count} 条
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
