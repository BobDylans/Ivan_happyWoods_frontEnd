"use client";

import React from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HappyWoodsLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

/**
 * HappyWoods Logo 组件
 *
 * 设计理念：
 * - 树叶图标代表"Woods"（森林）- 自然、生长、智慧
 * - 琥珀色主题色 - 温暖、自然、舒适
 *
 * 特性：
 * - 多种尺寸支持
 * - 可选的呼吸动画
 * - 响应式设计
 */
export const HappyWoodsLogo: React.FC<HappyWoodsLogoProps> = ({
  size = "md",
  animated = true,
  className,
}) => {
  // 尺寸映射
  const sizeMap = {
    sm: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      text: "text-base",
    },
    md: {
      container: "w-16 h-16",
      icon: "w-8 h-8",
      text: "text-lg",
    },
    lg: {
      container: "w-20 h-20",
      icon: "w-10 h-10",
      text: "text-xl",
    },
    xl: {
      container: "w-24 h-24",
      icon: "w-12 h-12",
      text: "text-2xl",
    },
  };

  const sizes = sizeMap[size];

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      {/* Logo 图标 */}
      <motion.div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-amber-400/20 to-orange-400/20",
          "border-2 border-amber-400/30",
          sizes.container
        )}
        animate={
          animated
            ? {
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }
            : undefined
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* 树叶图标 */}
        <motion.div
          animate={
            animated
              ? {
                  rotate: [0, -10, 10, 0],
                }
              : undefined
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf className={cn(sizes.icon, "text-amber-600")} fill="currentColor" strokeWidth={2} />
        </motion.div>

        {/* 光晕效果 */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Logo 文字（可选） */}
      {size !== "sm" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div
            className={cn(
              "font-semibold text-[var(--text-primary)]",
              "font-[family-name:var(--font-dm-sans)]",
              sizes.text
            )}
          >
            HappyWoods
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5">AI 助手</div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * 简化版 Logo - 仅图标
 */
export const HappyWoodsLogoIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 24, className }) => {
  return (
    <Leaf
      className={cn("text-amber-600", className)}
      size={size}
      fill="currentColor"
      strokeWidth={2}
    />
  );
};
