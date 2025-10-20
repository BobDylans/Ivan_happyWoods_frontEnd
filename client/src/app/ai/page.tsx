"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AILayout, ChatContainer, AIEmptyState } from '@/components/ai/ai-layout';
import { AISidebar } from '@/components/ai/ai-sidebar';
import { Message } from '@/components/ai/message';
import { AIInput } from '@/components/ai/ai-input';
import { CommandMenu } from '@/components/ai/command-menu';
import { useAIStore, simulateAIResponse } from '@/store/ai-store';
import { notionStaggerContainer, notionStaggerItem } from '@/lib/motion-config';

/**
 * AI 页面
 * 
 * Notion AI 风格的完整对话界面
 * 
 * 特性：
 * - 完整的对话体验
 * - 流式文本输出
 * - 侧边栏对话管理
 * - 响应式布局
 * - 自动滚动到底部
 * - 持久化存储
 */
export default function AIPage() {
  const {
    getCurrentConversation,
    addMessage,
    updateMessage,
    isGenerating,
    setIsGenerating,
  } = useAIStore();

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversation = getCurrentConversation();

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // 处理用户提交消息
  const handleSubmit = async (userMessage: string) => {
    if (!userMessage.trim() || isGenerating) return;

    // 添加用户消息
    addMessage({
      role: 'user',
      content: userMessage,
    });

    // 开始生成
    setIsGenerating(true);

    try {
      // 调用 AI API（这里使用模拟）
      const aiResponse = await simulateAIResponse(userMessage);

      // 添加 AI 回复
      addMessage({
        role: 'assistant',
        content: aiResponse,
        isStreaming: true,
      });

      // 模拟流式输出完成
      setTimeout(() => {
        setIsGenerating(false);
        setStreamingMessageId(null);
      }, 3000);
    } catch (error) {
      console.error('AI 回复失败:', error);
      addMessage({
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后重试。',
      });
      setIsGenerating(false);
    }
  };

  // 处理停止生成
  const handleStop = () => {
    setIsGenerating(false);
    setStreamingMessageId(null);
  };

  // 示例建议
  const suggestions = [
    '帮我写一篇关于 AI 的文章',
    '解释量子计算的基本原理',
    '推荐几本学习 React 的书籍',
    '如何提高工作效率？',
  ];

  return (
    <>
      {/* 命令面板 */}
      <CommandMenu />
      
      <AILayout
        sidebar={<AISidebar />}
        useGradientBackground={true}
      >
        <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto pb-6">
          {!conversation || conversation.messages.length === 0 ? (
            <AIEmptyState
              title="开始与 AI 对话"
              description="向 AI 提问任何问题，我会尽力为您解答"
              suggestions={suggestions}
              onSuggestionClick={handleSubmit}
            />
          ) : (
            <motion.div
              variants={notionStaggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {conversation.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  variants={notionStaggerItem}
                >
                  <Message
                    content={message.content}
                    role={message.role}
                    timestamp={message.timestamp}
                    isStreaming={
                      message.isStreaming &&
                      index === conversation.messages.length - 1
                    }
                    isLoading={false}
                    showActions={true}
                    onRegenerate={() => {
                      // 重新生成逻辑
                      console.log('重新生成消息:', message.id);
                    }}
                    onFeedback={(type) => {
                      console.log('反馈:', type, message.id);
                    }}
                  />
                </motion.div>
              ))}

              {/* 自动滚动锚点 */}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </div>

        {/* 输入框 */}
        <div className="flex-shrink-0">
          <AIInput
            onSubmit={handleSubmit}
            onStop={handleStop}
            isGenerating={isGenerating}
            placeholder="问 AI 任何问题..."
            maxLength={2000}
            showCharCount={true}
            enableAttachments={false}
          />
        </div>
      </div>
      </AILayout>
    </>
  );
}

