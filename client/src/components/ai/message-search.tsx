"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, MessageSquare, Calendar } from 'lucide-react';
import { useAIStore } from '@/store/ai-store';
import type { Message } from '@/store/ai-store';
import { cn } from '@/lib/utils';

interface SearchResult {
  message: Message;
  conversationId: string;
  conversationTitle: string;
  matchedText: string;
  timestamp: Date;
}

interface MessageSearchProps {
  /** 是否自动聚焦 */
  autoFocus?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 最大显示结果数 */
  maxResults?: number;
  /** 自定义类名 */
  className?: string;
  /** 选择结果回调 */
  onSelect?: (result: SearchResult) => void;
}

/**
 * 消息搜索组件（下拉菜单形式）
 * 
 * 支持全文搜索历史消息，实时显示搜索结果
 * 
 * @example
 * ```tsx
 * <MessageSearch 
 *   onSelect={(result) => {
 *     // 跳转到对应消息
 *     switchConversation(result.conversationId);
 *   }}
 * />
 * ```
 */
export function MessageSearch({
  autoFocus = false,
  placeholder = '搜索消息...',
  maxResults = 10,
  className,
  onSelect,
}: MessageSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { conversations, getCurrentConversation, selectConversation } = useAIStore();

  // 搜索逻辑
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // 遍历所有会话
    Object.entries(conversations).forEach(([conversationId, conversation]) => {
      conversation.messages.forEach((message) => {
        // 搜索消息内容
        if (message.content.toLowerCase().includes(lowerQuery)) {
          // 提取匹配的上下文
          const index = message.content.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, index - 30);
          const end = Math.min(message.content.length, index + query.length + 30);
          const matchedText = 
            (start > 0 ? '...' : '') +
            message.content.slice(start, end) +
            (end < message.content.length ? '...' : '');

          results.push({
            message,
            conversationId,
            conversationTitle: conversation.title,
            matchedText,
            timestamp: message.timestamp,
          });
        }
      });
    });

    // 按时间倒序排列，最新的在前
    return results
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxResults);
  }, [query, conversations, maxResults]);

  // 处理选择
  const handleSelect = useCallback((result: SearchResult) => {
    // 切换到对应会话
    selectConversation(result.conversationId);
    
    // 调用回调
    onSelect?.(result);
    
    // 关闭搜索
    setIsOpen(false);
    setQuery('');
    
    // 可以添加滚动到消息的逻辑
    // scrollToMessage(result.message.id);
  }, [onSelect, selectConversation]);

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        break;
    }
  }, [isOpen, searchResults, selectedIndex, handleSelect]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-[var(--interactive-primary)]/20 text-[var(--text-primary)] font-medium">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days} 天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full h-10 pl-10 pr-10 rounded-lg',
            'bg-[var(--surface-elevated)] shadow-sm',
            'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--interactive-primary)]/20',
            'transition-all'
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉菜单 */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-[var(--surface-elevated)] rounded-xl shadow-2xl overflow-hidden'
            )}
          >
            {searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <motion.button
                    key={`${result.conversationId}-${result.message.id}`}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'w-full text-left p-4 transition-colors',
                      'hover:bg-[var(--surface-elevated)]',
                      index === selectedIndex && 'bg-[var(--surface-elevated)]',
                      index !== searchResults.length - 1 && 'border-b border-[var(--border-subtle)]'
                    )}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* 会话标题和时间 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                        <MessageSquare className="w-3 h-3" />
                        <span className="font-medium">{result.conversationTitle}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(result.timestamp)}</span>
                      </div>
                    </div>

                    {/* 消息内容预览 */}
                    <div className="text-sm text-[var(--text-secondary)] line-clamp-2">
                      {highlightText(result.matchedText, query)}
                    </div>

                    {/* 消息角色标签 */}
                    <div className="mt-2">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        result.message.role === 'user'
                          ? 'bg-[var(--surface-base)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                          : 'bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)] border border-[var(--interactive-primary)]/20'
                      )}>
                        {result.message.role === 'user' ? '用户' : 'AI'}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 mx-auto mb-3 text-[var(--text-tertiary)] opacity-50" />
                <p className="text-[var(--text-secondary)] text-sm">
                  没有找到匹配的消息
                </p>
                <p className="text-[var(--text-tertiary)] text-xs mt-1">
                  尝试使用其他关键词
                </p>
              </div>
            )}

            {/* 快捷键提示 */}
            {searchResults.length > 0 && (
              <div className="px-4 py-2 bg-[var(--surface-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <span>↑↓ 导航</span>
                <span>Enter 选择</span>
                <span>Esc 关闭</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
