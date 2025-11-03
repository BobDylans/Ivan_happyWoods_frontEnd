"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Brain, Sparkles } from "lucide-react";

/**
 * How It Works Section 组件
 *
 * 特性：
 * - 展示 3 步使用流程
 * - 步骤卡片 + 连接线
 * - 交错动画效果
 * - 响应式布局
 */

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: <MessageCircle className="w-8 h-8" />,
    title: "输入你的问题",
    description: "在对话框中输入任何问题或需求，支持多行文本、代码片段等多种输入方式。",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: <Brain className="w-8 h-8" />,
    title: "AI 智能分析",
    description:
      "AI 理解你的意图，调用必要的工具，执行思考流程。整个过程实时可视化，透明可见。",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: <Sparkles className="w-8 h-8" />,
    title: "获得精准答案",
    description:
      "获取经过深度思考的答案，支持 Markdown 格式、代码高亮、数学公式等丰富展示。",
    color: "from-green-500 to-emerald-500",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            如何使用
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            三步开启智能对话，简单高效
          </p>
        </motion.div>

        {/* 步骤流程 */}
        <div className="relative">
          {/* 连接线（桌面端） */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20" />

          {/* 步骤卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* 步骤卡片 */}
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                  {/* 步骤编号 */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-gray-700">{step.number}</span>
                  </div>

                  {/* 图标 */}
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} text-white mb-6 mt-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>

                  {/* 标题 */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>

                  {/* 描述 */}
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* 箭头（移动端） */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8">
                      <div className="w-1 h-12 bg-gradient-to-b from-gray-300 to-transparent" />
                    </div>
                  )}
                </div>

                {/* 箭头装饰（桌面端） */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-8 w-16 h-16">
                    <motion.div
                      className="text-gray-300"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    >
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA 按钮 */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="/notion-ai"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>立即体验</span>
            <Sparkles className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
