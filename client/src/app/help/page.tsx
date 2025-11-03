"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HelpCircle,
  Keyboard,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
} from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

/**
 * 帮助中心页面
 *
 * 包含：
 * - 常见问题 FAQ
 * - 快捷键列表
 * - 功能指南
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

const faqs: FAQItem[] = [
  {
    question: "如何开始第一次对话？",
    answer:
      '点击主页的"开始对话"按钮，或直接访问 /notion-ai 页面。在输入框中输入你的问题，按 Enter 发送即可。',
  },
  {
    question: "支持哪些 Markdown 格式？",
    answer:
      "支持标题、列表、代码块、表格、引用、数学公式、任务列表等常见 Markdown 格式。代码块支持语法高亮，引用支持折叠展开。",
  },
  {
    question: "什么是工具调用可视化？",
    answer:
      "当 AI 需要使用外部工具（如搜索、计算等）时，会实时显示工具调用的过程和结果，让你清楚地看到 AI 的思考路径。",
  },
  {
    question: "如何管理历史会话？",
    answer:
      "点击左侧边栏可以查看所有历史会话。支持搜索、重命名、删除、导出等操作。会话会自动保存到本地或云端（如果已登录）。",
  },
  {
    question: "可以编辑或删除已发送的消息吗？",
    answer:
      "可以。鼠标悬停在消息上会显示编辑和删除按钮。编辑消息后会重新发送，删除消息不可恢复。",
  },
  {
    question: "支持哪些快捷键？",
    answer: '查看下方"快捷键列表"部分，或按 Cmd/Ctrl + K 打开命令面板查看所有快捷键。',
  },
  {
    question: "数据安全吗？会话内容会被存储吗？",
    answer:
      "所有数据通过 HTTPS 加密传输。本地会话存储在浏览器 LocalStorage，云端会话（需登录）存储在加密数据库中，不会用于其他用途。",
  },
  {
    question: "如何导出对话记录？",
    answer:
      '在会话列表中，点击会话右侧的菜单按钮，选择"导出"，可以导出为 Markdown 或 JSON 格式。',
  },
];

const shortcuts: ShortcutItem[] = [
  { keys: ["Enter"], description: "发送消息" },
  { keys: ["Shift", "Enter"], description: "换行" },
  { keys: ["Cmd/Ctrl", "K"], description: "打开命令面板" },
  { keys: ["Cmd/Ctrl", "N"], description: "新建会话" },
  { keys: ["Cmd/Ctrl", "F"], description: "搜索会话" },
  { keys: ["Cmd/Ctrl", "E"], description: "编辑消息" },
  { keys: ["Cmd/Ctrl", "D"], description: "删除消息" },
  { keys: ["↑", "↓"], description: "浏览输入历史" },
  { keys: ["Esc"], description: "关闭模态框/取消操作" },
  { keys: ["Cmd/Ctrl", "/"], description: "切换侧边栏" },
];

export default function HelpPage() {
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* 使用全局导航栏 */}
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--surface-elevated)] to-[var(--surface-base)] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex p-4 bg-[var(--interactive-primary)]/10 rounded-full shadow-lg mb-6">
              <HelpCircle className="w-12 h-12 text-[var(--interactive-primary)]" />
            </div>
            <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4">我们来帮助你</h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              查找常见问题解答、功能指南和快捷键列表
            </p>

            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="搜索帮助文档..."
                className="w-full px-6 py-4 pl-14 bg-[var(--surface-base)] rounded-full shadow-xl border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--interactive-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-secondary)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 快速导航 */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, title: "常见问题", anchor: "#faq" },
            { icon: Keyboard, title: "快捷键", anchor: "#shortcuts" },
            { icon: BookOpen, title: "功能指南", anchor: "#guides" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.anchor}
              className="flex items-center gap-4 p-6 bg-[var(--surface-elevated)] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group border border-[var(--border-subtle)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-[var(--interactive-primary)]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-[var(--interactive-primary)]" />
              </div>
              <span className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* 常见问题 */}
      <section id="faq" className="py-16 px-6 bg-[var(--surface-elevated)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">常见问题</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-[var(--surface-base)] rounded-2xl overflow-hidden border-2 border-[var(--border-subtle)] hover:border-[var(--interactive-primary)]/30 transition-all duration-300 shadow-sm hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-[var(--surface-elevated)] transition-colors group"
                >
                  <span className="text-xl font-bold text-[var(--text-primary)] pr-8 group-hover:text-[var(--interactive-primary)] transition-colors">
                    {faq.question}
                  </span>
                  {expandedFAQs.includes(index) ? (
                    <ChevronUp className="w-6 h-6 text-[var(--interactive-primary)] flex-shrink-0 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--interactive-primary)] flex-shrink-0 transition-colors" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {expandedFAQs.includes(index) && (
                    <motion.div
                      key={`faq-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.43, 0.13, 0.23, 0.96]
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-4 border-t border-[var(--border-subtle)]">
                        <p className="text-lg font-semibold text-[var(--text-primary)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 快捷键列表 */}
      <section id="shortcuts" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">快捷键列表</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-6 bg-[var(--surface-elevated)] rounded-xl shadow-md border border-[var(--border-subtle)]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <span className="text-[var(--text-secondary)]">{shortcut.description}</span>
                <div className="flex items-center gap-2">
                  {shortcut.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <kbd className="px-3 py-1.5 bg-[var(--surface-base)] border border-[var(--border-subtle)] rounded-lg text-sm font-mono font-semibold text-[var(--text-primary)] shadow-sm">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="text-[var(--text-secondary)]">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能指南 */}
      <section id="guides" className="py-16 px-6 bg-[var(--surface-elevated)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">功能指南</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "开始对话",
                description: "输入你的问题，AI 会实时流式输出答案",
                steps: ["点击开始对话按钮", "在输入框输入问题", "按 Enter 发送", "查看 AI 回复"],
              },
              {
                title: "会话管理",
                description: "轻松管理所有历史对话",
                steps: ["查看侧边栏会话列表", "搜索特定会话", "重命名或删除会话", "导出会话记录"],
              },
              {
                title: "工具调用",
                description: "实时查看 AI 的思考过程",
                steps: ["AI 自动调用工具", "查看工具调用卡片", "展开查看详细参数", "追踪执行结果"],
              },
              {
                title: "Markdown 渲染",
                description: "丰富的格式展示能力",
                steps: ["支持代码高亮", "表格和列表", "数学公式渲染", "可折叠引用块"],
              },
            ].map((guide, index) => (
              <motion.div
                key={index}
                className="p-8 bg-[var(--surface-base)] rounded-2xl border border-[var(--border-subtle)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{guide.title}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{guide.description}</p>
                <ol className="space-y-3">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[var(--interactive-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {stepIndex + 1}
                      </span>
                      <span className="text-[var(--text-secondary)] pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[var(--interactive-primary)] to-[var(--interactive-primary-hover)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">还有问题？</h2>
          <p className="text-xl text-white/90 mb-8">随时联系我们，我们很乐意帮助你</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/notion-ai"
              className="px-8 py-4 bg-white text-[var(--interactive-primary)] font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              开始对话
            </Link>
            <Link
              href="mailto:contact@happywoods.ai"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[var(--interactive-primary)] transition-all duration-300"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
