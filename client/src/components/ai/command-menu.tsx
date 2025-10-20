"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  MessageSquare,
  Plus,
  Trash2,
  Moon,
  Sun,
  Sparkles,
  Settings,
  LogOut,
  Command as CommandIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAIStore } from '@/store/ai-store';
import { backdropBlurIn, notionStaggerContainer, notionStaggerItem } from '@/lib/motion-config';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect: () => void;
}

/**
 * CommandMenu 组件
 * 
 * Notion 风格的命令面板
 * 
 * 特性：
 * - Cmd/Ctrl + K 快捷键唤起
 * - 模糊搜索
 * - 键盘导航
 * - 分组显示
 * - 流畅动画
 * 
 * @example
 * ```tsx
 * <CommandMenu />
 * ```
 */
export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const { createConversation, getConversationList, selectConversation, deleteConversation } = useAIStore();

  // 定义命令
  const commands: Command[] = useMemo(() => {
    const conversations = getConversationList();

    return [
      // 对话管理
      {
        id: 'new-conversation',
        label: '新建对话',
        description: '开始一个新的 AI 对话',
        icon: <Plus className="w-4 h-4" />,
        shortcut: 'Ctrl+N',
        group: '对话',
        onSelect: () => {
          createConversation();
          setIsOpen(false);
        },
      },
      ...conversations.map((conv) => ({
        id: `conv-${conv.id}`,
        label: conv.title,
        description: `${conv.messages.length} 条消息`,
        icon: <MessageSquare className="w-4 h-4" />,
        group: '对话历史',
        onSelect: () => {
          selectConversation(conv.id);
          setIsOpen(false);
        },
      })),
      
      // 主题切换
      {
        id: 'theme-light',
        label: '切换到浅色主题',
        icon: <Sun className="w-4 h-4" />,
        shortcut: 'Ctrl+Shift+L',
        group: '外观',
        onSelect: () => {
          setTheme('light');
          setIsOpen(false);
        },
      },
      {
        id: 'theme-dark',
        label: '切换到深色主题',
        icon: <Moon className="w-4 h-4" />,
        shortcut: 'Ctrl+Shift+D',
        group: '外观',
        onSelect: () => {
          setTheme('dark');
          setIsOpen(false);
        },
      },
      
      // 其他
      {
        id: 'settings',
        label: '设置',
        description: '打开设置面板',
        icon: <Settings className="w-4 h-4" />,
        group: '其他',
        onSelect: () => {
          console.log('打开设置');
          setIsOpen(false);
        },
      },
    ];
  }, [createConversation, getConversationList, selectConversation, setTheme]);

  // 搜索过滤
  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const lowerSearch = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerSearch) ||
        cmd.description?.toLowerCase().includes(lowerSearch)
    );
  }, [commands, search]);

  // 按组分组
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    
    filteredCommands.forEach((cmd) => {
      const group = cmd.group || '其他';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(cmd);
    });
    
    return groups;
  }, [filteredCommands]);

  // 快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开命令面板
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // ESC 关闭
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      
      // 上下键导航
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }
        
        // Enter 执行命令
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          filteredCommands[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <>
      {/* 触发按钮（可选） */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          hidden md:flex
          items-center gap-2
          px-3 py-2
          text-sm text-[var(--text-secondary)]
          bg-white/5 hover:bg-white/10
          border border-white/10
          rounded-lg
          transition-colors
        "
      >
        <Search className="w-4 h-4" />
        <span>搜索或执行命令...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-white/10 rounded border border-white/20">
          ⌘K
        </kbd>
      </button>

      {/* 命令面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              variants={backdropBlurIn}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* 命令面板 */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2 }}
                className="
                  w-full max-w-2xl
                  bg-white/95 dark:bg-black/90
                  backdrop-blur-xl
                  border border-white/20
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* 搜索框 */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="搜索命令..."
                    className="
                      flex-1
                      bg-transparent
                      text-[var(--text-primary)]
                      placeholder:text-[var(--text-tertiary)]
                      outline-none
                    "
                  />
                  <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">
                    ESC
                  </kbd>
                </div>

                {/* 命令列表 */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {Object.keys(groupedCommands).length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-[var(--text-tertiary)]">
                        没有找到匹配的命令
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      variants={notionStaggerContainer}
                      initial="initial"
                      animate="animate"
                      className="space-y-4"
                    >
                      {Object.entries(groupedCommands).map(([group, commands]) => (
                        <div key={group}>
                          {/* 分组标题 */}
                          <div className="px-3 py-2 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">
                            {group}
                          </div>

                          {/* 命令项 */}
                          <div className="space-y-1">
                            {commands.map((cmd, index) => {
                              const globalIndex = filteredCommands.indexOf(cmd);
                              const isSelected = globalIndex === selectedIndex;

                              return (
                                <motion.button
                                  key={cmd.id}
                                  variants={notionStaggerItem}
                                  onClick={() => cmd.onSelect()}
                                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                                  className={`
                                    w-full
                                    flex items-center gap-3
                                    px-3 py-2.5
                                    rounded-lg
                                    text-left
                                    transition-colors
                                    ${isSelected
                                      ? 'bg-[var(--interactive-primary)]/20 text-[var(--text-primary)]'
                                      : 'hover:bg-white/5 text-[var(--text-secondary)]'
                                    }
                                  `}
                                >
                                  {/* 图标 */}
                                  {cmd.icon && (
                                    <div className={isSelected ? 'text-[var(--interactive-primary)]' : ''}>
                                      {cmd.icon}
                                    </div>
                                  )}

                                  {/* 内容 */}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">
                                      {cmd.label}
                                    </div>
                                    {cmd.description && (
                                      <div className="text-xs text-[var(--text-tertiary)]">
                                        {cmd.description}
                                      </div>
                                    )}
                                  </div>

                                  {/* 快捷键 */}
                                  {cmd.shortcut && (
                                    <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded border border-white/20">
                                      {cmd.shortcut}
                                    </kbd>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* 底部提示 */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
                      导航
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                      选择
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded">ESC</kbd>
                      关闭
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI 助手</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

