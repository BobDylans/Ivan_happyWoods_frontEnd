"use client";

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

/**
 * 代码块组件 - 带复制功能
 * 
 * 特性：
 * - 一键复制代码
 * - 复制成功提示
 * - 语言标签显示
 * - 语法高亮样式支持
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  inline = false,
}) => {
  const [copied, setCopied] = useState(false);

  // 提取语言类型
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  // 复制功能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 行内代码
  if (inline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)] text-sm font-mono"
      >
        {children}
      </code>
    );
  }

  // 代码块
  return (
    <div className="group relative mb-4">
      {/* 语言标签和复制按钮容器 */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] border-b-0 rounded-t-lg">
        {/* 语言标签 */}
        <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          {language}
        </span>

        {/* 复制按钮 - 带动画反馈 */}
        <motion.button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium",
            "transition-all duration-200",
            "hover:bg-[var(--surface-base)]",
            copied
              ? "text-emerald-600 bg-emerald-500/10"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
          aria-label={copied ? "已复制" : "复制代码"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="font-semibold">已复制!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  复制
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 代码内容 */}
      <pre className="p-4 rounded-b-lg bg-[var(--surface-base)] border border-[var(--border-subtle)] overflow-x-auto">
        <code
          className={cn(
            "text-sm font-mono block text-[var(--text-primary)]",
            className
          )}
        >
          {children}
        </code>
      </pre>
    </div>
  );
};
