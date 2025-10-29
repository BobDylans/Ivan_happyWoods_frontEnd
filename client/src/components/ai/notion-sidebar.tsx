"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Home, 
  MessageSquare, 
  Settings, 
  FileText,
  Folder,
  Calendar,
  Bookmark,
  Archive,
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { Logo } from '@/components/icons/logo';
import { MessageSearch } from '@/components/ai/message-search';
import { cn } from '@/lib/utils';

interface NotionSidebarProps {
  onNewChat?: () => void;
  currentChatId?: string;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  hasChildren?: boolean;
  children?: SidebarItem[];
}

/**
 * Notion 风格的侧边栏组件
 * 
 * 特性：
 * - 仿 Notion 的导航结构
 * - 可折叠的分组
 * - 搜索功能
 * - 新建对话功能
 */
export const NotionSidebar: React.FC<NotionSidebarProps> = ({
  onNewChat,
  currentChatId
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['ai-chats', 'pages']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // 模拟的聊天记录
  const aiChats: SidebarItem[] = [
    { id: 'chat-1', title: '工作安排', icon: <MessageSquare className="w-4 h-4" />, isActive: currentChatId === 'chat-1' },
    { id: 'chat-2', title: '项目规划', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'chat-3', title: '学习计划', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'chat-4', title: 'React 问题', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // 模拟的页面结构
  const pages: SidebarItem[] = [
    { id: 'home', title: '主页', icon: <Home className="w-4 h-4" /> },
    { id: 'projects', title: '项目', icon: <Folder className="w-4 h-4" /> },
    { id: 'calendar', title: '日历', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notes', title: '笔记', icon: <FileText className="w-4 h-4" /> },
    { id: 'bookmarks', title: '收藏', icon: <Bookmark className="w-4 h-4" /> },
  ];

  const renderSidebarItem = (item: SidebarItem, level = 0) => (
    <motion.div
      key={item.id}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
        "hover:bg-[var(--surface-elevated)]",
        item.isActive && "bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)]",
        !item.isActive && "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      )}
      style={{ paddingLeft: `${12 + level * 16}px` }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex-shrink-0">{item.icon}</div>
      <span className="flex-1 truncate min-w-0">{item.title}</span>
      {item.hasChildren && (
        <ChevronRight className="w-3 h-3 opacity-50 flex-shrink-0" />
      )}
    </motion.div>
  );

  const renderSection = (title: string, items: SidebarItem[], sectionId: string, showAddButton = false) => {
    const isExpanded = expandedSections.includes(sectionId);
    
    return (
      <div className="mb-4">
        <div 
          className="flex items-center justify-between px-3 py-1 text-xs font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <span className="uppercase tracking-wide">{title}</span>
          </div>
          {showAddButton && (
            <Button
              variant="text"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onNewChat?.();
              }}
              className="w-4 h-4 p-0 opacity-50 hover:opacity-100"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="space-y-1 mt-1">
            {items.map(item => renderSidebarItem(item))}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-[var(--surface-base)] flex flex-col shadow-sm">
      {/* 顶部品牌区域 */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="sm" showText={false} />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[var(--text-primary)] text-lg">HappyWoods</h2>
            <p className="text-xs text-[var(--text-secondary)]">AI 助手</p>
          </div>
        </div>
        
        {/* 消息搜索组件 */}
        <MessageSearch
          placeholder="搜索消息..."
          onSelect={(result) => {
            console.log('选中搜索结果:', result);
            // 这里会自动切换到对应会话
          }}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-y-auto py-4 px-1">
        {/* AI 对话记录 */}
        {renderSection('AI 对话', aiChats, 'ai-chats', true)}
        
        {/* 页面列表 */}
        {renderSection('页面', pages, 'pages')}
        
        {/* 工具区域 */}
        <div className="px-3 mt-6 space-y-1">
          <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-2">
            工具
          </div>
          {renderSidebarItem({ id: 'settings', title: '设置', icon: <Settings className="w-4 h-4" /> })}
          {renderSidebarItem({ id: 'archive', title: '归档', icon: <Archive className="w-4 h-4" /> })}
          {renderSidebarItem({ id: 'trash', title: '回收站', icon: <Trash2 className="w-4 h-4" /> })}
        </div>
      </div>

      {/* 底部用户区域 */}
      <div className="p-3 pt-4">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--surface-elevated)] cursor-pointer transition-colors">
          <div className="w-6 h-6 bg-[var(--interactive-primary)] rounded-full flex items-center justify-center text-white text-xs font-medium">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[var(--text-primary)] truncate">用户</div>
            <div className="text-xs text-[var(--text-secondary)] truncate">HappyWoods</div>
          </div>
        </div>
      </div>
    </div>
  );
};
