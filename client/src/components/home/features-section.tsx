"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Zap, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card/card';

/**
 * 特性展示组件
 * 
 * 展示产品的核心特性
 */
export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: MessageSquare,
      title: '智能对话',
      description: '基于最新 AI 技术，提供自然流畅的对话体验，理解上下文，给出精准回复。',
      color: 'text-[var(--interactive-primary)]',
      bgColor: 'bg-[var(--interactive-primary)]/10',
    },
    {
      icon: Sparkles,
      title: '流式响应',
      description: '实时流式输出，所见即所得。支持 Markdown 渲染和代码高亮，阅读体验更佳。',
      color: 'text-amber-600',
      bgColor: 'bg-amber-600/10',
    },
    {
      icon: Zap,
      title: '快速高效',
      description: '毫秒级响应速度，60fps 流畅动画。无论是简单问答还是复杂任务，都能快速完成。',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
    {
      icon: Shield,
      title: '安全可靠',
      description: '企业级安全保障，数据加密传输。支持会话管理，历史对话随时查看。',
      color: 'text-green-600',
      bgColor: 'bg-green-600/10',
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <Card
                  variant="hover"
                  className="h-full p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  {/* 图标 */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mb-4`}>
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


