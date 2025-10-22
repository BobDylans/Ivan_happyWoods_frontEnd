"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeList } from './node-indicator';
import { ToolList } from './tool-card';
import type { WorkflowState } from '@/types/workflow';

export interface WorkflowTimelineProps {
  /** 工作流状态 */
  workflowState: WorkflowState;
  /** 是否显示 */
  show?: boolean;
  /** 类名 */
  className?: string;
}

/**
 * 工作流时间线组件
 * 
 * 可视化展示 AI 的思考和执行过程
 * 
 * @example
 * ```tsx
 * <WorkflowTimeline
 *   workflowState={currentWorkflowState}
 *   show={true}
 * />
 * ```
 */
export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  workflowState,
  show = true,
  className,
}) => {
  const {
    isRunning,
    nodes,
    tools,
    thinkingPhases,
    routeDecisions,
    isComplete,
    totalDurationMs,
  } = workflowState;

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-gradient-to-br from-gray-50 to-gray-100',
        'border border-[var(--border-subtle)]',
        'shadow-sm',
        className
      )}
    >
      {/* 头部 */}
      <div className="px-4 py-3 bg-white border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            执行流程
          </span>
          {isRunning && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-auto"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </motion.div>
          )}
          {isComplete && totalDurationMs && (
            <span className="ml-auto text-xs text-[var(--text-secondary)]">
              总耗时: {totalDurationMs.toFixed(0)}ms
            </span>
          )}
        </div>
      </div>

      {/* 内容 */}
      <div className="p-4 space-y-4">
        {/* 节点列表 */}
        {nodes.length > 0 && (
          <div>
            <div className="text-xs font-medium text-[var(--text-tertiary)] mb-2">
              执行节点
            </div>
            <NodeList nodes={nodes} />
          </div>
        )}

        {/* 思考阶段 */}
        <AnimatePresence mode="popLayout">
          {thinkingPhases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-medium text-[var(--text-tertiary)] mb-2">
                思考阶段
              </div>
              <div className="space-y-2">
                {thinkingPhases.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100"
                  >
                    <Brain className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-blue-900">
                        {phase.phase}
                      </div>
                      {phase.details && (
                        <div className="text-xs text-blue-700 mt-0.5">
                          {phase.details}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 路由决策 */}
        <AnimatePresence mode="popLayout">
          {routeDecisions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-medium text-[var(--text-tertiary)] mb-2">
                路由决策
              </div>
              <div className="space-y-2">
                {routeDecisions.map((decision, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium text-amber-900">
                        {decision.from}
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-900">
                        {decision.to}
                      </span>
                    </div>
                    {decision.reason && (
                      <span className="text-xs text-amber-700 flex-shrink-0">
                        ({decision.reason})
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 工具调用 */}
        {tools.length > 0 && (
          <div>
            <div className="text-xs font-medium text-[var(--text-tertiary)] mb-2">
              工具调用
            </div>
            <ToolList tools={tools} />
          </div>
        )}

        {/* 完成横幅 */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-green-900">
                  工作流完成
                </span>
              </div>
              {totalDurationMs && (
                <span className="text-sm text-green-700">
                  {totalDurationMs.toFixed(0)}ms
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 运行中指示 */}
        <AnimatePresence>
          {isRunning && !isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-100"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
              </motion.div>
              <span className="text-sm text-blue-700">AI 正在思考中...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * 精简版工作流指示器
 * 
 * 只显示关键信息，适合内联显示
 */
export interface WorkflowIndicatorProps {
  isRunning: boolean;
  nodeCount: number;
  toolCount: number;
  className?: string;
}

export const WorkflowIndicator: React.FC<WorkflowIndicatorProps> = ({
  isRunning,
  nodeCount,
  toolCount,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs',
        isRunning ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {isRunning && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>
      )}
      <span>
        {nodeCount} 节点 · {toolCount} 工具
      </span>
    </div>
  );
};
