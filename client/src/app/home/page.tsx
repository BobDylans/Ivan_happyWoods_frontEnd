"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Zap,
  Brain,
  ArrowRight,
  Github,
  Star,
  Users,
  Palette,
  Code,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { HappyWoodsLogo, HappyWoodsLogoIcon } from "@/components/icons/happy-woods-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

/**
 * Notion AI 风格智能助手项目主页
 *
 * 特性：
 * - 现代化的英雄区域设计
 * - 功能特性展示
 * - 项目介绍和技术栈
 * - 温暖自然的设计风格
 */
export default function HomePage() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "智能对话",
      description: "基于先进 AI 技术的自然语言对话，支持上下文理解和多轮对话",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "实时响应",
      description: "流式文本输出，思考过程可视化，带来流畅的交互体验",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "温暖设计",
      description: "基于 HappyWoods 设计系统，温暖的琥珀色主题和自然的交互动画",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "现代技术",
      description: "使用 Next.js 15、React 19、TypeScript 和 Framer Motion 构建",
    },
  ];

  const stats = [
    { icon: <Star className="w-5 h-5" />, label: "设计组件", value: "15+" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "AI 功能", value: "多种" },
    { icon: <Users className="w-5 h-5" />, label: "用户体验", value: "AAA" },
    { icon: <Heart className="w-5 h-5" />, label: "开源项目", value: "免费" },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* 导航栏 */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface-base)]/80 backdrop-blur-lg border-b border-[var(--border-subtle)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <HappyWoodsLogoIcon size={32} />
              <div>
                <h1 className="font-semibold text-[var(--text-primary)]">HappyWoods AI</h1>
                <p className="text-xs text-[var(--text-secondary)]">智能对话助手</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/notion-ai">
                <Button variant="secondary" size="sm">
                  体验 AI
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 英雄区域 */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex justify-center">
              <HappyWoodsLogo size="xl" animated />
            </div>

            <h1 className="text-6xl font-bold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-dm-sans)]">
              甜你心，
              <span className="text-[var(--interactive-primary)]">知你意</span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto leading-relaxed">
              基于 Notion AI 设计理念打造的智能对话助手，融合温暖自然的设计语言与先进的 AI 技术，
              为您提供流畅、智能、美观的对话体验。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/notion-ai">
                <Button variant="primary" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                  开始对话
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<Github className="w-5 h-5" />}
                onClick={() => window.open("https://github.com", "_blank")}
              >
                了解更多
              </Button>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-2 text-[var(--interactive-primary)]">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 功能特性 */}
      <section className="py-20 px-6 bg-[var(--surface-elevated)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4 font-[family-name:var(--font-dm-sans)]">
              为什么选择 HappyWoods AI？
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              我们将最先进的 AI 技术与温暖自然的设计理念相结合，创造出独特的对话体验
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[var(--surface-base)] rounded-2xl p-8 border border-[var(--border-subtle)] hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--interactive-primary)]/10 rounded-xl flex items-center justify-center text-[var(--interactive-primary)] flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 font-[family-name:var(--font-dm-sans)]">
              现代化技术栈
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { name: "Next.js 15", desc: "React 框架" },
                { name: "React 19", desc: "UI 库" },
                { name: "TypeScript", desc: "类型安全" },
                { name: "Framer Motion", desc: "动画库" },
                { name: "TailwindCSS", desc: "样式框架" },
                { name: "Zustand", desc: "状态管理" },
                { name: "Lucide", desc: "图标库" },
                { name: "CVA", desc: "组件变体" },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-subtle)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-semibold text-[var(--text-primary)] mb-1">{tech.name}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{tech.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-20 px-6 bg-[var(--surface-elevated)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-dm-sans)]">
              准备开始了吗？
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              立即体验 HappyWoods AI，感受温暖智能的对话助手带来的全新体验
            </p>

            <Link href="/notion-ai">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                立即体验
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 px-6 border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <HappyWoodsLogo size="md" animated />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            © 2025 HappyWoods AI. 基于 HappyWoods 设计系统构建
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            🌿✨ 让设计更温暖、更自然、更智能 ✨🌿
          </p>
        </div>
      </footer>
    </div>
  );
}
