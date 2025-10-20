"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  StopCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { notionFadeIn, floating } from '@/lib/motion-config';

export interface AIInputProps {
  /** 提交回调 */
  onSubmit: (message: string) => void;
  /** 停止生成回调 */
  onStop?: () => void;
  /** 是否正在生成 */
  isGenerating?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 最大字符数 */
  maxLength?: number;
  /** 是否显示字符计数 */
  showCharCount?: boolean;
  /** 是否启用附件上传 */
  enableAttachments?: boolean;
  /** 初始值 */
  initialValue?: string;
}

/**
 * AIInput 组件
 * 
 * Notion AI 风格的浮动输入框
 * 
 * 特性：
 * - 自动高度调整
 * - 快捷键支持（Enter 发送，Shift+Enter 换行）
 * - 字符计数
 * - 流畅的动画效果
 * - 支持停止生成
 * - 毛玻璃效果
 * 
 * @example
 * ```tsx
 * <AIInput 
 *   onSubmit={(msg) => console.log(msg)}
 *   isGenerating={false}
 * />
 * ```
 */
export function AIInput({
  onSubmit,
  onStop,
  isGenerating = false,
  disabled = false,
  placeholder = "问 AI 任何问题...",
  maxLength = 2000,
  showCharCount = true,
  enableAttachments = false,
  initialValue = '',
}: AIInputProps) {
  const [message, setMessage] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  // 自动聚焦
  useEffect(() => {
    if (!isGenerating && !disabled) {
      textareaRef.current?.focus();
    }
  }, [isGenerating, disabled]);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isGenerating || disabled) return;

    onSubmit(trimmedMessage);
    setMessage('');
    
    // 重置高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isOverLimit = message.length > maxLength;
  const canSubmit = message.trim().length > 0 && !isOverLimit && !disabled;

  return (
    <motion.div
      variants={notionFadeIn}
      initial="initial"
      animate="animate"
      className="sticky bottom-0 left-0 right-0 z-30"
    >
      <div className="max-w-4xl mx-auto px-4 pb-6">
        {/* 输入框容器 */}
        <motion.div
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`
            relative
            bg-white/90 dark:bg-black/50
            backdrop-blur-xl
            border-2 transition-colors duration-200
            ${isFocused 
              ? 'border-[var(--interactive-primary)] shadow-lg shadow-[var(--interactive-primary)]/20' 
              : 'border-white/30 dark:border-white/10'
            }
            rounded-2xl
            overflow-hidden
          `}
        >
          {/* Glow 效果 */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          )}

          <div className="relative p-4">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder={placeholder}
              rows={1}
              className="
                w-full
                bg-transparent
                text-[var(--text-primary)]
                placeholder:text-[var(--text-tertiary)]
                resize-none
                outline-none
                text-base
                leading-relaxed
                min-h-[24px]
                max-h-[200px]
              "
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--interactive-primary) transparent',
              }}
            />

            {/* 底部工具栏 */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 dark:border-white/10">
              {/* 左侧工具 */}
              <div className="flex items-center gap-1">
                {enableAttachments && (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="h-8 w-8"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  className="h-8 w-8"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>

              {/* 右侧：字符计数和发送按钮 */}
              <div className="flex items-center gap-3">
                {/* 字符计数 */}
                {showCharCount && message.length > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-xs ${
                      isOverLimit 
                        ? 'text-red-500' 
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    {message.length} / {maxLength}
                  </motion.span>
                )}

                {/* 发送/停止按钮 */}
                {isGenerating ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onStop}
                    leftIcon={<StopCircle className="w-4 h-4" />}
                  >
                    停止生成
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    发送
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* AI 标识 */}
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-8 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI 助手</span>
            </motion.div>
          )}
        </motion.div>

        {/* 提示文本 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xs text-[var(--text-tertiary)] mt-3"
        >
          按 <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Enter</kbd> 发送，
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 ml-1">Shift + Enter</kbd> 换行
        </motion.p>
      </div>
    </motion.div>
  );
}

/**
 * CompactAIInput 组件
 * 
 * 紧凑版的 AI 输入框（用于侧边栏或小空间）
 */
export function CompactAIInput({
  onSubmit,
  isGenerating = false,
  disabled = false,
  placeholder = "问 AI...",
}: {
  onSubmit: (message: string) => void;
  isGenerating?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isGenerating || disabled) return;
    onSubmit(trimmedMessage);
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="
      flex items-center gap-2 
      px-3 py-2
      bg-white/80 dark:bg-black/40
      backdrop-blur-md
      border border-white/30 dark:border-white/10
      rounded-xl
      focus-within:border-[var(--interactive-primary)]
      transition-colors
    ">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isGenerating}
        placeholder={placeholder}
        className="
          flex-1
          bg-transparent
          text-sm
          text-[var(--text-primary)]
          placeholder:text-[var(--text-tertiary)]
          outline-none
        "
      />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSubmit}
        disabled={!message.trim() || disabled || isGenerating}
        className="h-7 w-7"
      >
        <Send className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

