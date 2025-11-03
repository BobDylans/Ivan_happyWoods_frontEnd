"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

// 折叠引用组件
const CollapsibleBlockquote: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const content = React.Children.toArray(children);
  const isLong = content.length > 3;

  return (
    <div className="mb-4">
      <blockquote className="border-l-4 border-[var(--interactive-primary)] pl-4 py-2 text-[var(--text-secondary)] italic bg-[var(--surface-elevated)] rounded-r-lg">
        <div
          className={cn(
            "transition-all duration-300",
            !isExpanded && isLong && "max-h-24 overflow-hidden"
          )}
        >
          {children}
        </div>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-[var(--interactive-primary)] hover:underline flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                展开
              </>
            )}
          </button>
        )}
      </blockquote>
    </div>
  );
};

/**
 * Markdown 消息渲染组件（增强版）
 *
 * 特性：
 * - 支持 GitHub Flavored Markdown (GFM)
 * - ✅ 任务列表支持 (checkbox)
 * - 📊 响应式表格（横向滚动）
 * - 🖼️ 图片懒加载和点击预览
 * - 🔗 外部链接图标提示
 * - 📑 长内容折叠展开
 * - 代码块语法高亮
 * - 自定义样式，符合项目设计系统
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, className }) => {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
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
          li: ({ children }: { children?: React.ReactNode }) => {
            // 检查是否是任务列表项
            const firstChild = React.Children.toArray(children)[0];
            const isTaskList =
              typeof firstChild === "string" &&
              (firstChild.startsWith("[ ] ") ||
                firstChild.startsWith("[x] ") ||
                firstChild.startsWith("[X] "));

            if (isTaskList) {
              const isChecked =
                typeof firstChild === "string" &&
                (firstChild.startsWith("[x] ") || firstChild.startsWith("[X] "));
              const text =
                typeof firstChild === "string"
                  ? firstChild.replace(/^\[(x|X| )\] /, "")
                  : firstChild;

              return (
                <li className="flex items-start gap-2 text-sm leading-relaxed mb-2 list-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="mt-1 cursor-default accent-[var(--interactive-primary)]"
                  />
                  <span className={cn(isChecked && "line-through text-[var(--text-tertiary)]")}>
                    {text}
                    {React.Children.toArray(children).slice(1)}
                  </span>
                </li>
              );
            }

            // 检查是否包含嵌套列表
            const hasNestedList = React.Children.toArray(children).some(
              child => React.isValidElement(child) && (child.type === "ul" || child.type === "ol")
            );

            return (
              <li className={cn("text-sm leading-relaxed", hasNestedList ? "mb-2" : "mb-1")}>
                {children}
              </li>
            );
          },

          // 代码块 - 使用 CodeBlock 组件
          code: ({
            inline,
            className,
            children,
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) => {
            return (
              <CodeBlock inline={inline} className={className}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            );
          },

          // 引用 - 带折叠功能
          blockquote: ({ children }: { children?: React.ReactNode }) => {
            return <CollapsibleBlockquote>{children}</CollapsibleBlockquote>;
          },

          // 表格 - 响应式优化
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
              <table className="min-w-full divide-y divide-[var(--border-subtle)]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--surface-elevated)]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[var(--border-subtle)] bg-white dark:bg-gray-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[var(--surface-base)] transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-[var(--text-primary)] whitespace-nowrap">
              {children}
            </td>
          ),

          // 链接 - 添加外部链接图标
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-[var(--interactive-primary)] hover:underline inline-flex items-center gap-1"
              >
                {children}
                {isExternal && <ExternalLink className="w-3 h-3 inline-block" />}
              </a>
            );
          },

          // 图片 - 懒加载 + 点击预览
          img: ({ src, alt }) => (
            <Zoom>
              <img
                src={src}
                alt={alt || ""}
                loading="lazy"
                className="max-w-full h-auto rounded-lg my-4 cursor-zoom-in hover:opacity-90 transition-opacity"
              />
            </Zoom>
          ),

          // 水平线
          hr: () => <hr className="my-6 border-[var(--border-subtle)]" />,

          // 强调
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--text-primary)]">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-[var(--text-secondary)]">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
