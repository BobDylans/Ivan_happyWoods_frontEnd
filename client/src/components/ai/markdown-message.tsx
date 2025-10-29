"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code-block';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

/**
 * Markdown 消息渲染组件
 * 
 * 特性：
 * - 支持 GitHub Flavored Markdown (GFM)
 * - 代码块语法高亮样式
 * - 表格、列表等完整支持
 * - 自定义样式，符合项目设计系统
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  className
}) => {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 标题
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          
          // 段落
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-[var(--text-primary)] mb-4 last:mb-0">
              {children}
            </p>
          ),
          
          // 列表
          ul: ({ children }) => (
            <ul className="list-disc list-outside mb-4 space-y-1 text-[var(--text-primary)] pl-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside mb-4 space-y-1 text-[var(--text-primary)] pl-6">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // 检查是否包含嵌套列表
            const hasNestedList = React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && (child.type === 'ul' || child.type === 'ol')
            );
            
            return (
              <li className={cn(
                "text-sm leading-relaxed",
                hasNestedList ? "mb-2" : "mb-1"
              )}>
                {children}
              </li>
            );
          },
          
          // 代码块 - 使用 CodeBlock 组件
          code: ({ node, inline, className, children, ...props }: any) => {
            return (
              <CodeBlock
                inline={inline}
                className={className}
              >
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          
          // 引用
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[var(--interactive-primary)] pl-4 py-2 mb-4 text-[var(--text-secondary)] italic">
              {children}
            </blockquote>
          ),
          
          // 表格
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full border border-[var(--border-subtle)] rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--surface-elevated)]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] last:border-b-0">
              {children}
            </td>
          ),
          
          // 链接
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--interactive-primary)] hover:underline"
            >
              {children}
            </a>
          ),
          
          // 水平线
          hr: () => (
            <hr className="my-6 border-[var(--border-subtle)]" />
          ),
          
          // 强调
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--text-primary)]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[var(--text-secondary)]">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
