"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  MoreVertical,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { useAIStore } from '@/store/ai-store';
import { notionStaggerContainer, notionStaggerItem } from '@/lib/motion-config';

/**
 * AISidebar 组件
 * 
 * Notion AI 风格的侧边栏
 * 
 * 特性：
 * - 对话历史列表
 * - 创建新对话
 * - 删除对话
 * - 重命名对话
 * - 流畅的动画效果
 */
export function AISidebar() {
  const {
    createConversation,
    selectConversation,
    deleteConversation,
    currentConversationId,
    getConversationList,
  } = useAIStore();

  const conversations = getConversationList();

  const handleNewChat = () => {
    const id = createConversation();
    selectConversation(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-white/10">
        <Button
          variant="primary"
          size="default"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleNewChat}
          className="w-full"
        >
          新建对话
        </Button>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 ? (
          <EmptyState onNewChat={handleNewChat} />
        ) : (
          <motion.div
            variants={notionStaggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onSelect={() => selectConversation(conversation.id)}
                onDelete={() => deleteConversation(conversation.id)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-[var(--text-tertiary)] text-center">
          共 {conversations.length} 个对话
        </p>
      </div>
    </div>
  );
}

/**
 * ConversationItem 组件
 * 
 * 单个对话项
 */
function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: any;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(conversation.title);
  const [showActions, setShowActions] = useState(false);
  const { updateConversationTitle } = useAIStore();

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateConversationTitle(conversation.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(conversation.title);
    setIsEditing(false);
  };

  return (
    <motion.div
      variants={notionStaggerItem}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className="relative group"
    >
      {isEditing ? (
        // 编辑模式
        <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            autoFocus
            className="
              flex-1 
              bg-transparent 
              text-sm 
              text-[var(--text-primary)]
              outline-none
              border-b border-[var(--interactive-primary)]
            "
          />
          <button
            onClick={handleSaveTitle}
            className="text-green-500 hover:text-green-600"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // 正常模式
        <button
          onClick={onSelect}
          className={`
            w-full
            flex items-start gap-3
            p-3 rounded-lg
            text-left
            transition-all duration-200
            ${isActive 
              ? 'bg-[var(--interactive-primary)]/20 text-[var(--text-primary)]' 
              : 'hover:bg-white/5 text-[var(--text-secondary)]'
            }
          `}
        >
          {/* 图标 */}
          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate mb-1">
              {conversation.title}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {conversation.messages.length} 条消息
            </p>
          </div>

          {/* 操作按钮 */}
          <AnimatePresence>
            {(showActions || isActive) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="重命名"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}
    </motion.div>
  );
}

/**
 * EmptyState 组件
 * 
 * 空状态提示
 */
function EmptyState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)]" />
      </div>

      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
        还没有对话
      </h3>

      <p className="text-xs text-[var(--text-tertiary)] mb-6">
        点击上方按钮开始新的对话
      </p>

      <button
        onClick={onNewChat}
        className="text-sm text-[var(--interactive-primary)] hover:underline"
      >
        创建第一个对话 →
      </button>
    </motion.div>
  );
}

/**
 * CompactSidebar 组件
 * 
 * 紧凑版侧边栏（移动端）
 */
export function CompactSidebar() {
  const {
    createConversation,
    selectConversation,
    currentConversationId,
    getConversationList,
  } = useAIStore();

  const conversations = getConversationList();

  return (
    <div className="p-4 space-y-3">
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={createConversation}
        className="w-full"
      >
        新建
      </Button>

      <div className="space-y-1">
        {conversations.slice(0, 5).map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => selectConversation(conversation.id)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm
              transition-colors
              ${conversation.id === currentConversationId
                ? 'bg-[var(--interactive-primary)]/20 text-[var(--text-primary)]'
                : 'hover:bg-white/5 text-[var(--text-secondary)]'
              }
            `}
          >
            <p className="truncate">{conversation.title}</p>
          </button>
        ))}
      </div>

      {conversations.length > 5 && (
        <p className="text-xs text-[var(--text-tertiary)] text-center">
          还有 {conversations.length - 5} 个对话...
        </p>
      )}
    </div>
  );
}

