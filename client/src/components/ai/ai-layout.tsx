"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { notionSlide, notionFadeIn } from '@/lib/motion-config';
import { GradientBackground } from './gradient-background';

export interface AILayoutProps {
  /** 侧边栏内容 */
  sidebar?: React.ReactNode;
  /** 主要内容区域 */
  children: React.ReactNode;
  /** 右侧面板（可选） */
  rightPanel?: React.ReactNode;
  /** 是否默认显示侧边栏 */
  defaultSidebarOpen?: boolean;
  /** 是否使用渐变背景 */
  useGradientBackground?: boolean;
}

/**
 * AILayout 组件
 * 
 * Notion AI 风格的三栏布局容器
 * 
 * 特性：
 * - 响应式设计（移动/平板/桌面）
 * - 可折叠的侧边栏
 * - 可选的右侧面板
 * - 流畅的展开/收起动画
 * - 支持渐变背景
 * 
 * @example
 * ```tsx
 * <AILayout
 *   sidebar={<AISidebar />}
 *   rightPanel={<SettingsPanel />}
 * >
 *   <ChatArea />
 * </AILayout>
 * ```
 */
export function AILayout({
  sidebar,
  children,
  rightPanel,
  defaultSidebarOpen = true,
  useGradientBackground = true,
}: AILayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const LayoutWrapper = useGradientBackground ? GradientBackground : React.Fragment;
  const wrapperProps = useGradientBackground ? { animated: true } : {};

  // 监听滚动，自动隐藏/显示顶部工具栏
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const currentScrollY = scrollContainer.scrollTop;
      
      // 滚动距离小于 10px 时始终显示
      if (currentScrollY < 10) {
        setHeaderVisible(true);
      } 
      // 向上滚动时显示
      else if (currentScrollY < lastScrollY) {
        setHeaderVisible(true);
      } 
      // 向下滚动且超过 100px 时隐藏
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  return (
    <LayoutWrapper {...wrapperProps}>
      <div className="relative flex h-screen overflow-hidden">
        {/* 移动端遮罩 */}
        <AnimatePresence>
          {sidebarOpen && sidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* 侧边栏 */}
        {sidebar && (
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={notionSlide}
                className={`
                  fixed lg:relative
                  top-0 left-0 h-full
                  w-80 flex-shrink-0
                  bg-white/80 dark:bg-black/40
                  backdrop-blur-xl
                  border-r border-white/20 dark:border-white/10
                  z-50 lg:z-0
                  overflow-y-auto
                `}
              >
                {/* 移动端关闭按钮 */}
                <div className="lg:hidden absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-6">
                  {sidebar}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}

        {/* 主内容区域 */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* 顶部工具栏 - 带滚动隐藏动画 */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ 
              y: headerVisible ? 0 : -100,
              opacity: headerVisible ? 1 : 0
            }}
            transition={{ 
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1] // Notion 风格缓动
            }}
            className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 p-4 bg-white/60 dark:bg-black/30 backdrop-blur-md border-b border-white/20 dark:border-white/10"
          >
            {/* 侧边栏切换按钮 */}
            {sidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "关闭侧边栏" : "打开侧边栏"}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            <div className="flex-1" />

            {/* 其他工具栏内容可以在这里添加 */}
          </motion.div>

          {/* 主要内容 - 添加顶部 padding 避免内容被工具栏遮挡 */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto"
            style={{
              paddingTop: headerVisible ? '72px' : '0px',
              transition: 'padding-top 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div className="max-w-4xl mx-auto px-4 py-6">
              {children}
            </div>
          </div>
        </main>

        {/* 右侧面板（可选） */}
        {rightPanel && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden xl:block w-80 flex-shrink-0 bg-white/60 dark:bg-black/30 backdrop-blur-md border-l border-white/20 dark:border-white/10 overflow-y-auto"
          >
            <div className="p-6">
              {rightPanel}
            </div>
          </motion.aside>
        )}
      </div>
    </LayoutWrapper>
  );
}

/**
 * AI 对话容器组件
 * 
 * 用于包裹对话消息列表
 */
export function ChatContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={notionFadeIn}
      initial="initial"
      animate="animate"
      className={`space-y-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Empty State 组件
 * 
 * 当没有对话时显示
 */
export function AIEmptyState({
  title = "开始对话",
  description = "向 AI 提问任何问题，开始智能对话",
  suggestions = [],
  onSuggestionClick,
}: {
  title?: string;
  description?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}) {
  return (
    <motion.div
      variants={notionFadeIn}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4"
    >
      {/* 图标 */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--interactive-primary)] to-[var(--interactive-secondary)] flex items-center justify-center mb-6"
      >
        <span className="text-3xl">✨</span>
      </motion.div>

      {/* 标题 */}
      <h2 className="text-3xl font-semibold text-[var(--text-primary)] mb-3">
        {title}
      </h2>

      {/* 描述 */}
      <p className="text-[var(--text-secondary)] mb-8 max-w-md">
        {description}
      </p>

      {/* 建议 */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSuggestionClick?.(suggestion)}
              className="
                p-4 rounded-xl
                bg-white/60 dark:bg-white/5
                backdrop-blur-sm
                border border-white/40 dark:border-white/10
                text-left
                hover:bg-white/80 dark:hover:bg-white/10
                hover:border-[var(--interactive-primary)]
                transition-all duration-200
                hover:scale-105
              "
            >
              <span className="text-sm text-[var(--text-primary)]">
                {suggestion}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

