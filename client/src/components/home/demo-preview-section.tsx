"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

/**
 * Demo Preview Section 组件
 *
 * 特性：
 * - 展示对话示例
 * - 消息气泡样式
 * - 打字机动画效果
 * - 工具调用可视化
 */

interface Message {
  role: "user" | "assistant";
  content: string;
  delay: number;
}

const demoMessages: Message[] = [
  {
    role: "user",
    content: "帮我分析一下最新的前端技术趋势",
    delay: 0.2,
  },
  {
    role: "assistant",
    content:
      "好的！我来帮你分析最新的前端技术趋势。让我先搜索一些最新的行业数据...\n\n📊 **调用工具**: 搜索引擎\n\n根据分析，2024年前端技术有以下几个主要趋势：\n\n1. **AI 驱动的开发工具**\n2. **Web 组件标准化**\n3. **性能优化优先**\n4. **TypeScript 普及**",
    delay: 0.6,
  },
];

export const DemoPreviewSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">体验智能对话</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            看看 AI 如何理解你的需求，给出精准答案
          </p>
        </motion.div>

        {/* 对话窗口 */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* 窗口顶部装饰 */}
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-4 text-sm text-gray-500 font-medium">AI 对话演示</span>
          </div>

          {/* 消息列表 */}
          <div className="space-y-6">
            {demoMessages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: message.delay }}
              >
                {/* AI 头像 */}
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* 消息气泡 */}
                <div
                  className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>

                {/* 用户头像 */}
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* 输入框预览 */}
            <motion.div
              className="flex items-center gap-3 pt-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-gray-400 text-sm">
                输入你的问题...
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow duration-300">
                发送
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <a
            href="/notion-ai"
            className="inline-block text-blue-600 hover:text-purple-600 font-semibold text-lg transition-colors duration-300"
          >
            开始你的对话 →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
