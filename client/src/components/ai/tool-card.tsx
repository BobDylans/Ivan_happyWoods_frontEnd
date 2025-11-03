"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wrench, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolStatus } from "@/types/workflow";

export interface ToolCardProps {
  /** 工具名称 */
  name: string;
  /** 工具状态 */
  status: ToolStatus;
  /** 工具参数 */
  args?: Record<string, any>;
  /** 工具结果 */
  result?: {
    success: boolean;
    summary: string;
  };
  /** 执行时长（毫秒） */
  durationMs?: number;
  /** 类名 */
  className?: string;
}

/**
 * 工具执行卡片组件
 *
 * 显示工具调用的执行状态和结果
 *
 * @example
 * ```tsx
 * <ToolCard
 *   name="web_search"
 *   status="executing"
 *   args={{ query: "What is AI?" }}
 * />
 * ```
 */
export const ToolCard: React.FC<ToolCardProps> = ({
  name,
  status,
  args,
  result,
  durationMs,
  className,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-gray-500" />;
      case "executing":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4 text-amber-500" />
          </motion.div>
        );
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "等待执行";
      case "executing":
        return "执行中...";
      case "success":
        return "✓ 成功";
      case "failed":
        return "✗ 失败";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-gray-50";
      case "executing":
        return "bg-amber-50 border-l-4 border-l-amber-500";
      case "success":
        return "bg-green-50 border-l-4 border-l-green-500";
      case "failed":
        return "bg-red-50 border-l-4 border-l-red-500";
    }
  };

  // 格式化参数显示
  const formatArgs = (args: Record<string, any>) => {
    const str = JSON.stringify(args, null, 2);
    return str.length > 100 ? str.substring(0, 100) + "..." : str;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-300",
        getStatusColor(),
        className
      )}
    >
      {/* 头部 */}
      <div className="flex items-center gap-3 px-3 py-2">
        {/* 工具图标 */}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
          </div>
        </div>

        {/* 工具名称 */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[var(--text-primary)]">{name}</div>
        </div>

        {/* 状态 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {getStatusIcon()}
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              status === "pending" && "bg-gray-200 text-gray-700",
              status === "executing" && "bg-amber-500 text-white animate-pulse",
              status === "success" && "bg-green-500 text-white",
              status === "failed" && "bg-red-500 text-white"
            )}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* 参数 */}
      {args && Object.keys(args).length > 0 && (
        <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
          <div className="text-xs text-[var(--text-tertiary)] mb-1">参数:</div>
          <pre className="text-xs bg-white rounded px-2 py-1 overflow-x-auto font-mono text-[var(--text-secondary)]">
            {formatArgs(args)}
          </pre>
        </div>
      )}

      {/* 结果 */}
      {result && (
        <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs text-[var(--text-tertiary)]">结果:</div>
            {durationMs !== undefined && (
              <span className="text-xs text-[var(--text-secondary)]">
                ({durationMs.toFixed(0)}ms)
              </span>
            )}
          </div>
          <div
            className={cn(
              "text-xs rounded px-2 py-1",
              result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {result.summary}
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * 工具列表组件
 *
 * 显示多个工具的执行状态
 */
export interface ToolListProps {
  tools: Array<{
    name: string;
    status: ToolStatus;
    args?: Record<string, any>;
    result?: {
      success: boolean;
      summary: string;
    };
    durationMs?: number;
  }>;
  className?: string;
}

export const ToolList: React.FC<ToolListProps> = ({ tools, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {tools.map((tool, index) => (
        <ToolCard
          key={`${tool.name}-${index}`}
          name={tool.name}
          status={tool.status}
          args={tool.args}
          result={tool.result}
          durationMs={tool.durationMs}
        />
      ))}
    </div>
  );
};
