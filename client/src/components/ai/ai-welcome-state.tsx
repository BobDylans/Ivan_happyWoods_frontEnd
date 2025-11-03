"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { HappyWoodsLogo } from "@/components/icons/happy-woods-logo";
import { cn } from "@/lib/utils";

interface AIWelcomeStateProps {
  onSubmit: (message: string) => void;
  isTransitioning?: boolean;
}

/**
 * AI 助手欢迎状态组件
 *
 * 特性：
 * - 居中的大型输入框设计
 * - 温暖的标题和引导文案
 * - 功能按钮组
 * - 流畅的入场动画
 */
export const AIWelcomeState: React.FC<AIWelcomeStateProps> = ({
  onSubmit,
  isTransitioning = false,
}) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (input.trim() && !isTransitioning) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 建议问题
  const suggestions = [
    "帮我写一篇关于人工智能的文章",
    "解释一下什么是机器学习",
    "推荐一些学习编程的资源",
    "如何提高工作效率？",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    if (!isTransitioning) {
      onSubmit(suggestion);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <HappyWoodsLogo size="lg" animated />
      </motion.div>

      {/* 标题 */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <h1 className="text-5xl font-semibold text-[var(--text-primary)] mb-4 font-[family-name:var(--font-dm-sans)]">
          甜你心，知你意。
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl">
          HappyWoods AI 助手为您提供智能对话体验
        </p>
      </motion.div>

      {/* 主输入框 */}
      <motion.div
        className="w-full max-w-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div
          className={cn(
            "relative transition-all duration-300",
            isFocused && "transform scale-[1.02]"
          )}
        >
          <div
            className={cn(
              "relative border-2 rounded-xl transition-all duration-300",
              isFocused
                ? "border-[var(--interactive-primary)] shadow-lg shadow-[var(--interactive-primary)]/20"
                : "border-[var(--border-subtle)]",
              isTransitioning && "opacity-50 pointer-events-none"
            )}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="询问、搜索或制作任何内容…"
              disabled={isTransitioning}
              className="w-full h-16 px-6 pr-24 text-lg bg-[var(--surface-base)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-xl outline-none resize-none"
            />

            {/* 右侧按钮组 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="text"
                size="icon"
                disabled={isTransitioning}
                className="w-8 h-8 text-[var(--text-secondary)] hover:text-[var(--interactive-primary)]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="text"
                size="icon"
                disabled={isTransitioning}
                className="w-8 h-8 text-[var(--text-secondary)] hover:text-[var(--interactive-primary)]"
              >
                <Upload className="w-4 h-4" />
              </Button>
              {input.trim() && (
                <Button
                  variant="primary"
                  size="icon"
                  onClick={handleSubmit}
                  disabled={isTransitioning}
                  className="w-8 h-8 ml-1"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 功能按钮组 */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Button variant="secondary" size="sm" disabled={isTransitioning} className="text-sm">
          自动
        </Button>
        <Button variant="secondary" size="sm" disabled={isTransitioning} className="text-sm">
          探究
        </Button>
        <Button variant="secondary" size="sm" disabled={isTransitioning} className="text-sm">
          全部信息源
        </Button>
      </motion.div>

      {/* 建议问题 */}
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className="text-sm text-[var(--text-secondary)] mb-4 text-center">或者试试这些问题：</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isTransitioning}
              className={cn(
                "p-4 text-left text-sm bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-lg transition-all duration-200",
                "hover:border-[var(--interactive-primary)] hover:bg-[var(--surface-elevated)] hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-[var(--interactive-primary)]/20",
                isTransitioning && "opacity-50 pointer-events-none"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-[var(--text-primary)]">{suggestion}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 加载状态指示器 */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-[var(--surface-base)]/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="w-5 h-5 border-2 border-[var(--interactive-primary)] border-t-transparent rounded-full animate-spin" />
            <span>正在启动对话...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
