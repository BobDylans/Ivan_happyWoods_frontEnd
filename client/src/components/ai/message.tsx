"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown,
  MoreHorizontal,
  User,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { StreamingText } from './streaming-text';
import { messageAppear, notionPulse } from '@/lib/motion-config';

export interface MessageProps {
  /** 消息内容 */
  content: string;
  /** 消息角色 */
  role: 'user' | 'assistant';
  /** 是否正在流式输出 */
  isStreaming?: boolean;
  /** 是否正在加载 */
  isLoading?: boolean;
  /** 时间戳 */
  timestamp?: Date;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 重新生成回调 */
  onRegenerate?: () => void;
  /** 反馈回调 */
  onFeedback?: (type: 'positive' | 'negative') => void;
}

/**
 * Message 组件
 * 
 * 通用消息组件，支持用户消息和 AI 消息
 */
export function Message({
  content,
  role,
  isStreaming = false,
  isLoading = false,
  timestamp,
  showActions = true,
  onRegenerate,
  onFeedback,
}: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    onFeedback?.(type);
  };

  if (role === 'user') {
    return <UserMessage content={content} timestamp={timestamp} />;
  }

  return (
    <AIMessage
      content={content}
      isStreaming={isStreaming}
      isLoading={isLoading}
      timestamp={timestamp}
      showActions={showActions}
      onCopy={handleCopy}
      copied={copied}
      onRegenerate={onRegenerate}
      onFeedback={handleFeedback}
      feedback={feedback}
    />
  );
}

/**
 * UserMessage 组件
 * 
 * 用户消息气泡
 */
export function UserMessage({
  content,
  timestamp,
}: {
  content: string;
  timestamp?: Date;
}) {
  return (
    <motion.div
      variants={messageAppear}
      initial="initial"
      animate="animate"
      className="flex justify-end gap-3 group"
    >
      <div className="flex-1 max-w-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="
              px-4 py-3 rounded-2xl
              bg-[var(--interactive-primary)]
              text-white
              shadow-md
            ">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </div>
            
            {timestamp && (
              <span className="text-xs text-[var(--text-tertiary)] mt-1 block px-4">
                {formatTime(timestamp)}
              </span>
            )}
          </div>

          {/* 用户头像 */}
          <div className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-[var(--interactive-primary)] to-[var(--interactive-secondary)]
            flex items-center justify-center
            flex-shrink-0
          ">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * AIMessage 组件
 * 
 * AI 消息气泡，支持流式输出和 Markdown
 */
export function AIMessage({
  content,
  isStreaming = false,
  isLoading = false,
  timestamp,
  showActions = true,
  onCopy,
  copied,
  onRegenerate,
  onFeedback,
  feedback,
}: {
  content: string;
  isStreaming?: boolean;
  isLoading?: boolean;
  timestamp?: Date;
  showActions?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  onRegenerate?: () => void;
  onFeedback?: (type: 'positive' | 'negative') => void;
  feedback?: 'positive' | 'negative' | null;
}) {
  return (
    <motion.div
      variants={messageAppear}
      initial="initial"
      animate="animate"
      className="flex gap-3 group"
    >
      {/* AI 头像 */}
      <div className="
        w-8 h-8 rounded-full
        bg-gradient-to-br from-purple-500 to-blue-500
        flex items-center justify-center
        flex-shrink-0
      ">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 max-w-2xl">
        {/* 消息气泡 */}
        <div className="
          px-4 py-3 rounded-2xl
          bg-[var(--ai-message-bg)]
          backdrop-blur-md
          border border-[var(--ai-message-border)]
          shadow-sm
        ">
          {isLoading ? (
            <AIThinking />
          ) : isStreaming ? (
            <StreamingText
              text={content}
              speed={30}
              markdown={true}
              showCursor={true}
            />
          ) : (
            <StreamingText
              text={content}
              speed={30}
              markdown={true}
              showCursor={false}
            />
          )}
        </div>

        {/* 时间戳和操作 */}
        <div className="flex items-center gap-2 mt-2 px-2">
          {timestamp && (
            <span className="text-xs text-[var(--text-tertiary)]">
              {formatTime(timestamp)}
            </span>
          )}

          {/* 操作按钮 */}
          {showActions && !isLoading && (
            <MessageActions
              onCopy={onCopy}
              copied={copied}
              onRegenerate={onRegenerate}
              onFeedback={onFeedback}
              feedback={feedback}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * MessageActions 组件
 * 
 * 消息操作按钮组
 */
export function MessageActions({
  onCopy,
  copied,
  onRegenerate,
  onFeedback,
  feedback,
}: {
  onCopy?: () => void;
  copied?: boolean;
  onRegenerate?: () => void;
  onFeedback?: (type: 'positive' | 'negative') => void;
  feedback?: 'positive' | 'negative' | null;
}) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* 复制 */}
      {onCopy && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="h-7 w-7"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      )}

      {/* 重新生成 */}
      {onRegenerate && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRegenerate}
          className="h-7 w-7"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      )}

      {/* 点赞 */}
      {onFeedback && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFeedback('positive')}
            className="h-7 w-7"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${feedback === 'positive' ? 'text-green-500 fill-current' : ''}`} />
          </Button>

          {/* 点踩 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFeedback('negative')}
            className="h-7 w-7"
          >
            <ThumbsDown className={`w-3.5 h-3.5 ${feedback === 'negative' ? 'text-red-500 fill-current' : ''}`} />
          </Button>
        </>
      )}

      {/* 更多 */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

/**
 * AIThinking 组件
 * 
 * AI 思考中的加载动画
 */
export function AIThinking() {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-sm text-[var(--text-secondary)]">AI 正在思考</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--ai-pulse-color)]"
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 格式化时间
 */
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 小于 1 分钟
  if (diff < 60000) {
    return '刚刚';
  }
  
  // 小于 1 小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`;
  }
  
  // 今天
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // 其他日期
  return date.toLocaleDateString('zh-CN', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

