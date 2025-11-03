"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 工作流事件类型
 */
export interface WorkflowEventData {
  // Graph 层事件
  type:
    | "workflow_started"
    | "node_started"
    | "node_finished"
    | "route_decision"
    | "workflow_complete"
    // Node 层事件
    | "thinking_phase"
    | "tool_call_pending"
    | "tool_executing"
    | "tool_result"
    | "llm_streaming";
  level?: "graph" | "node";
  data?: any;
  timestamp?: number;
}

/**
 * 工作流可视化时间线组件
 *
 * 显示 AI 思考过程的详细执行步骤
 */
export function WorkflowTimeline({ events }: { events: WorkflowEventData[] }) {
  if (events.length === 0) return null;

  // 只统计工具调用相关的事件
  const toolEvents = events.filter(
    e => e.level === "node" && (e.type === "tool_executing" || e.type === "tool_result")
  );

  // 如果没有工具调用事件,不显示时间线
  if (toolEvents.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface-base)] rounded-xl p-4 mb-3 shadow-sm"
    >
      {/* 时间线标题 */}
      <div className="flex items-center gap-2 mb-3 pb-2">
        <Wrench className="w-4 h-4 text-[var(--interactive-primary)]" />
        <span className="text-xs font-semibold text-[var(--text-primary)]">调用工具</span>
        <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">
          {toolEvents.length} 个
        </span>
      </div>

      {/* 时间线内容 */}
      <div className="space-y-2">
        {events.map((event, index) => (
          <WorkflowEventItem key={index} event={event} />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * 单个工作流事件项
 */
function WorkflowEventItem({ event }: { event: WorkflowEventData }) {
  // 只显示工具调用相关事件,隐藏节点和思考过程的详细信息

  // Graph 层事件 - 只显示工作流完成
  if (event.level === "graph") {
    if (event.type === "workflow_complete") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg text-xs font-semibold shadow-sm"
        >
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            处理完成
          </span>
          <span className="text-[var(--text-tertiary)] text-[10px]">
            耗时: {event.data?.total_duration_ms?.toFixed(0)}ms
          </span>
        </motion.div>
      );
    }

    // 隐藏其他 graph 层事件
    return null;
  }

  // Node 层事件 - 只显示工具调用
  if (event.level === "node") {
    // 隐藏思考阶段和 LLM 流式响应
    if (event.type === "thinking_phase" || event.type === "llm_streaming") {
      return null;
    }

    // 只显示工具调用的结果状态
    if (
      event.type === "tool_call_pending" ||
      event.type === "tool_executing" ||
      event.type === "tool_result"
    ) {
      const isResult = event.type === "tool_result";
      const isExecuting = event.type === "tool_executing";
      const success = event.data?.success;

      // 只显示执行中和结果,隐藏 pending 状态
      if (event.type === "tool_call_pending") {
        return null;
      }

      return (
        <motion.div
          layout // 启用布局动画,实现平滑的状态过渡
          layoutId={`tool-${event.data?.tool}`} // 相同工具使用相同 ID
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
            isResult && success && "bg-emerald-500/8 text-emerald-700",
            isResult && !success && "bg-rose-500/8 text-rose-700",
            isExecuting && "bg-[var(--interactive-primary)]/8 text-[var(--text-primary)]"
          )}
        >
          <motion.div layout>
            <Wrench
              className={cn(
                "w-3.5 h-3.5",
                isResult && success && "text-emerald-600",
                isResult && !success && "text-rose-600",
                isExecuting && "text-[var(--interactive-primary)] animate-pulse"
              )}
            />
          </motion.div>

          <span className="font-medium">{event.data?.tool}</span>

          <motion.span
            layout
            className={cn(
              "text-[10px] ml-auto font-medium",
              isResult && success && "text-emerald-600",
              isResult && !success && "text-rose-600",
              isExecuting && "text-[var(--interactive-primary)]"
            )}
          >
            {isResult && success && "✓ 成功"}
            {isResult && !success && "✗ 失败"}
            {isExecuting && "执行中..."}
          </motion.span>

          {/* 只在失败时显示简短错误信息 */}
          {isResult && !success && event.data?.error && (
            <span className="text-[10px] text-rose-600 ml-2 truncate max-w-xs">
              ({event.data.error})
            </span>
          )}
        </motion.div>
      );
    }
  }

  return null;
}
