"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Wrench, Network, Keyboard, FolderOpen, FileText } from "lucide-react";
import { Card } from "@/components/ui/card/card";

/**
 * 特性展示组件
 *
 * 展示产品的核心特性
 */
export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "智能对话",
      description: "基于最新 AI 模型，提供自然流畅的对话体验，理解上下文，给出精准回答。",
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      icon: Wrench,
      title: "工具调用",
      description: "支持实时工具调用可视化，清晰展示 AI 的思考过程和执行步骤。",
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      icon: Network,
      title: "可视化流程",
      description: "工作流节点可视化，实时追踪 AI 思考路径，让 AI 的决策过程透明可见。",
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      icon: Keyboard,
      title: "快捷键支持",
      description: "丰富的键盘快捷键，提升操作效率。支持快速发送、编辑、搜索等常用操作。",
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
    {
      icon: FolderOpen,
      title: "会话管理",
      description: "智能会话分组、搜索、导出功能，轻松管理历史对话，随时找到需要的内容。",
      color: "text-indigo-600",
      bgColor: "bg-indigo-600/10",
    },
    {
      icon: FileText,
      title: "Markdown 渲染",
      description: "增强版 Markdown 渲染，支持代码高亮、表格、数学公式、可折叠引用等丰富格式。",
      color: "text-teal-600",
      bgColor: "bg-teal-600/10",
    },
  ];

  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // 卡片动画变体
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="features"
      className="py-24 px-6 bg-gradient-to-b from-[var(--surface-base)] to-[var(--surface-elevated)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            为什么选择 HappyWoods
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            我们致力于打造最温暖、最自然、最智能的 AI 对话体验
          </p>
        </motion.div>

        {/* 特性卡片网格 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant="elevated"
                  className="h-full p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  {/* 图标 */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mb-4`}
                  >
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                    {feature.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
