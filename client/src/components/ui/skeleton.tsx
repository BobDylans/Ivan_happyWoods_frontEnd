"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  /** 是否显示动画 */
  animated?: boolean;
  /** 圆角大小 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

/**
 * 骨架屏基础组件
 * 
 * 用于显示加载状态的占位符，使用设计系统的标准颜色
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-48" />
 * <Skeleton className="h-12 w-12" rounded="full" />
 * ```
 */
export function Skeleton({ 
  className, 
  animated = true,
  rounded = 'md',
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <motion.div
      className={cn(
        // 使用设计系统的颜色变量，确保与实际内容一致
        'bg-[var(--border-subtle)]',
        roundedClasses[rounded],
        className
      )}
      animate={animated ? {
        opacity: [0.3, 0.6, 0.3],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * AI 思考动画组件
 * 
 * 显示 AI 正在思考的动画效果
 */
export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl">
      {/* 旋转的思考图标 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex-shrink-0"
      >
        <Brain className="w-4 h-4 text-[var(--text-secondary)]" />
      </motion.div>

      {/* 思考文字 - 使用与实际消息相同的文字样式 */}
      <div className="flex-1">
        <div className="text-sm text-[var(--text-secondary)]">
          正在思考...
        </div>
        <div className="flex items-center gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* 闪烁的星星图标 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="flex-shrink-0"
      >
        <Sparkles className="w-4 h-4 text-[var(--text-tertiary)]" />
      </motion.div>
    </div>
  );
}

/**
 * 消息骨架屏（带思考动画）
 */
export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={cn('flex gap-3 mb-6', isUser && 'flex-row-reverse')}>
      {/* 头像 */}
      <motion.div
        className={cn(
          "w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-cyan-500"
            : "bg-gradient-to-br from-amber-500 to-orange-500"
        )}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {isUser ? (
          <span className="text-white text-sm">👤</span>
        ) : (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </motion.div>
      
      {/* 消息内容 */}
      <div className="flex-1 max-w-2xl space-y-3">
        {!isUser && <ThinkingIndicator />}
        
        {/* 消息框骨架 - 使用与实际消息相同的背景 */}
        <div className={cn(
          "p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
        )}>
          <div className="space-y-2.5">
            {/* 文字行骨架 - 使用更接近实际文字的样式 */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "h-4 rounded bg-[var(--border-subtle)]",
                  i === 2 && "w-3/4" // 最后一行短一些
                )}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 会话列表骨架屏
 */
export function ConversationListSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-subtle)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-[var(--text-tertiary)]" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-2 w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton() {
  return (
    <div className="p-6 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)] space-y-4">
      <div className="flex items-center gap-3">
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" rounded="md" />
        <Skeleton className="h-9 w-20" rounded="md" />
      </div>
    </div>
  );
}

/**
 * 页面加载骨架屏
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--surface-base)] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * 搜索结果骨架屏
 */
export function SearchResultSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-subtle)] space-y-2"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-3 w-40" />
        </motion.div>
      ))}
    </div>
  );
}

