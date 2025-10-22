"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NodeStatus } from '@/types/workflow';

export interface NodeIndicatorProps {
  /** 节点名称 */
  name: string;
  /** 显示名称 */
  displayName: string;
  /** 节点状态 */
  status: NodeStatus;
  /** 执行时长（毫秒） */
  durationMs?: number;
  /** 类名 */
  className?: string;
}

/**
 * 节点状态指示器组件
 * 
 * 显示工作流节点的执行状态
 * 
 * @example
 * ```tsx
 * <NodeIndicator
 *   name="agent_node"
 *   displayName="AI Agent"
 *   status="running"
 * />
 * ```
 */
export const NodeIndicator: React.FC<NodeIndicatorProps> = ({
  name,
  displayName,
  status,
  durationMs,
  className,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Circle className="w-4 h-4 text-[var(--text-tertiary)]" />;
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-4 h-4 text-blue-500" />
          </motion.div>
        );
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'running':
        return '运行中...';
      case 'completed':
        return '✓ 完成';
      case 'error':
        return '✗ 错误';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      case 'running':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'completed':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-l-red-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg',
        'transition-all duration-300',
        getStatusColor(),
        className
      )}
    >
      {/* 状态图标 */}
      <div className="flex-shrink-0">{getStatusIcon()}</div>

      {/* 节点名称 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {displayName}
        </div>
        {name !== displayName && (
          <div className="text-xs text-[var(--text-tertiary)] truncate">
            {name}
          </div>
        )}
      </div>

      {/* 状态和耗时 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {durationMs !== undefined && (
          <span className="text-xs text-[var(--text-secondary)]">
            {durationMs.toFixed(0)}ms
          </span>
        )}
        <span
          className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            status === 'running' && 'bg-blue-500 text-white animate-pulse',
            status === 'completed' && 'bg-green-500 text-white',
            status === 'error' && 'bg-red-500 text-white',
            status === 'pending' && 'bg-gray-200 text-gray-600'
          )}
        >
          {getStatusText()}
        </span>
      </div>
    </motion.div>
  );
};

/**
 * 节点列表组件
 * 
 * 显示多个节点的执行状态
 */
export interface NodeListProps {
  nodes: Array<{
    name: string;
    displayName: string;
    status: NodeStatus;
    durationMs?: number;
  }>;
  className?: string;
}

export const NodeList: React.FC<NodeListProps> = ({ nodes, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {nodes.map((node, index) => (
        <NodeIndicator
          key={`${node.name}-${index}`}
          name={node.name}
          displayName={node.displayName}
          status={node.status}
          durationMs={node.durationMs}
        />
      ))}
    </div>
  );
};
