"use client";

import React from "react";
import { Button } from "@/components/ui/button/button";
import { Text } from "@/components/ui/text/text";
import { Caption } from "@/components/ui/text/caption";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface Session {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
}

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

/**
 * SessionSidebar Component
 * Displays list of chat sessions with create/delete actions
 */
export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <div className="w-64 h-full border-r border-[var(--border-subtle)] bg-[var(--surface-elevated)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <Button
          variant="primary"
          size="default"
          className="w-full"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onNewSession}
        >
          新对话
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <MessageSquare className="w-12 h-12 text-[var(--text-tertiary)] mb-3" />
            <Text variant="muted" className="text-sm">
              暂无对话记录
            </Text>
            <Caption className="mt-2">
              点击上方按钮开始新对话
            </Caption>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group"
              >
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-[var(--radius-md)]",
                    "transition-colors duration-200",
                    "hover:bg-[var(--surface-base)]",
                    activeSessionId === session.id
                      ? "bg-[var(--interactive-primary)] bg-opacity-10 border border-[var(--interactive-primary)] border-opacity-30"
                      : "border border-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Text
                        variant="body-sm"
                        weight="medium"
                        className={cn(
                          "truncate",
                          activeSessionId === session.id &&
                            "text-[var(--interactive-primary)]"
                        )}
                      >
                        {session.title}
                      </Text>
                      {session.lastMessage && (
                        <Caption
                          size="xs"
                          className="truncate mt-1 block"
                        >
                          {session.lastMessage}
                        </Caption>
                      )}
                      <Caption size="xs" className="mt-1 block">
                        {formatDate(session.updatedAt)}
                      </Caption>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className={cn(
                        "flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100",
                        "hover:bg-[var(--status-error)] hover:bg-opacity-10",
                        "transition-all duration-200"
                      )}
                      title="删除对话"
                    >
                      <Trash2 className="w-4 h-4 text-[var(--status-error)]" />
                    </button>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
