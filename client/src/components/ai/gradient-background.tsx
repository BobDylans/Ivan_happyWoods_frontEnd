"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface GradientBackgroundProps {
  /** 是否启用动画渐变 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * GradientBackground 组件
 * 
 * Notion AI 风格的动态渐变背景
 * 
 * 特性：
 * - 支持浅色/深色模式自动切换
 * - 细腻的渐变效果
 * - 可选的动画渐变
 * - 性能优化（GPU 加速）
 * 
 * @example
 * ```tsx
 * <GradientBackground animated>
 *   <YourContent />
 * </GradientBackground>
 * ```
 */
export function GradientBackground({
  animated = true,
  className = '',
  children,
}: GradientBackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* 主渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--ai-gradient-start)] via-[var(--ai-gradient-mid)] to-[var(--ai-gradient-end)]" />
      
      {/* 动画光晕 - 左上角 */}
      {animated && (
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-radial from-purple-400/30 via-transparent to-transparent blur-3xl" />
        </motion.div>
      )}
      
      {/* 动画光晕 - 右下角 */}
      {animated && (
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-radial from-blue-400/20 via-transparent to-transparent blur-3xl" />
        </motion.div>
      )}
      
      {/* 静态装饰渐变 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-amber-300/10 to-transparent blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-sage-300/10 to-transparent blur-2xl" />
      
      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * GlassPanel 组件
 * 
 * 毛玻璃效果面板，配合 GradientBackground 使用
 */
export function GlassPanel({
  children,
  className = '',
  blur = 'md',
}: {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={`
        bg-white/80 dark:bg-black/40
        ${blurClasses[blur]}
        border border-white/20 dark:border-white/10
        rounded-2xl
        shadow-xl shadow-black/5
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * FloatingCard 组件
 * 
 * 浮动卡片，带有轻微的悬浮动画
 */
export function FloatingCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      <GlassPanel blur="lg">
        {children}
      </GlassPanel>
    </motion.div>
  );
}

/**
 * MeshGradient 组件
 * 
 * 网格渐变背景（更现代的效果）
 */
export function MeshGradient({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* 基础渐变 */}
      <div className="absolute inset-0 bg-[var(--surface-base)]" />
      
      {/* 网格渐变层 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.3) 0px, transparent 50%),
            radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.2) 0px, transparent 50%),
            radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.2) 0px, transparent 50%),
            radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.3) 0px, transparent 50%),
            radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.3) 0px, transparent 50%),
            radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.2) 0px, transparent 50%),
            radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.3) 0px, transparent 50%)
          `,
        }}
      />
      
      {/* 动画遮罩 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              transparent 0%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 100%
            )
          `,
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

