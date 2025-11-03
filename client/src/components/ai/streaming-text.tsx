"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStreamingText } from "@/hooks/use-streaming-text";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface StreamingTextProps {
  /** 要显示的文本内容 */
  text: string;
  /** 打字速度（毫秒/字符），默认 30ms */
  speed?: number;
  /** 是否自动开始，默认 true */
  autoStart?: boolean;
  /** 是否支持 Markdown 渲染，默认 true */
  markdown?: boolean;
  /** 完成回调 */
  onComplete?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 是否显示光标 */
  showCursor?: boolean;
}

/**
 * StreamingText 组件
 *
 * Notion AI 风格的打字机动画文本组件
 *
 * 特性：
 * - 流畅的打字机动画（60fps）
 * - 支持 Markdown 实时渲染
 * - 可配置的打字速度
 * - 闪烁光标效果
 * - 支持 prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <StreamingText
 *   text="Hello, **World**!"
 *   speed={30}
 *   markdown={true}
 * />
 * ```
 */
export function StreamingText({
  text,
  speed = 30,
  autoStart = true,
  markdown = true,
  onComplete,
  className = "",
  showCursor = true,
}: StreamingTextProps) {
  const { displayedText, isTyping } = useStreamingText(text, {
    speed,
    autoStart,
    onComplete,
  });

  return (
    <div className={`relative ${className}`}>
      {markdown ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // 自定义 Markdown 渲染样式
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              code: ({ inline, children, ...props }: any) =>
                inline ? (
                  <code
                    className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-primary)] text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className="block p-4 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-primary)] text-sm font-mono overflow-x-auto"
                    {...props}
                  >
                    {children}
                  </code>
                ),
              strong: ({ children }) => (
                <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-[var(--text-secondary)]">{children}</em>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-[var(--interactive-primary)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
              ),
            }}
          >
            {displayedText}
          </ReactMarkdown>
        </div>
      ) : (
        <span className="whitespace-pre-wrap leading-relaxed">{displayedText}</span>
      )}

      {/* 打字光标 */}
      {showCursor && isTyping && (
        <motion.span
          className="inline-block w-0.5 h-5 ml-0.5 bg-[var(--interactive-primary)]"
          animate={{
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}

/**
 * StreamingCode 组件
 *
 * 专门用于代码块的打字机动画
 */
export function StreamingCode({
  code,
  language = "javascript",
  speed = 20,
  onComplete,
  className = "",
}: {
  code: string;
  language?: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const { displayedText, isTyping } = useStreamingText(code, {
    speed,
    autoStart: true,
    onComplete,
  });

  return (
    <div className={`relative ${className}`}>
      <pre className="p-4 rounded-lg bg-[var(--surface-elevated)] overflow-x-auto">
        <code className="text-sm font-mono text-[var(--text-primary)]">{displayedText}</code>
      </pre>

      {isTyping && (
        <motion.div
          className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[var(--interactive-primary)]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}
