"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * AI 思考动画组件
 * 
 * 特性：
 * - 简洁的旋转圆圈动画
 * - 流畅的动画过渡
 */
export const AIThinking: React.FC = () => {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex justify-start max-w-4xl mx-auto mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* 思考内容 - 简单的旋转圆圈 */}
      <div className="max-w-3xl bg-[var(--surface-elevated)] rounded-2xl px-4 py-3 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          {/* 旋转加载圆圈 */}
          <Loader2 className="w-5 h-5 text-[var(--interactive-primary)] animate-spin" />
          
          {/* 思考文字 - 动态点点 */}
          <span className="text-sm text-[var(--text-secondary)] min-w-[100px]">
            Thinking{dots}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 简化版思考动画
 */
export const AIThinkingSimple: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-1.5 h-1.5 bg-[var(--interactive-primary)] rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <span>AI 正在思考...</span>
    </div>
  );
};
