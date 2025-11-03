"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * CTA (Call-to-Action) 组件
 *
 * 引导用户开始使用
 */
export const CTASection: React.FC = () => {
  const router = useRouter();

  const handleStartChat = () => {
    router.push("/notion-ai");
  };

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--interactive-primary)]/20 via-transparent to-[var(--interactive-primary)]/10" />

      {/* 装饰性背景图案 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--interactive-primary)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* 标题 */}
          <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
            准备好开始了吗？
          </h2>

          {/* 描述 */}
          <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            立即体验 Ivan HappyWoods 的智能对话功能，
            <br className="hidden md:block" />让 AI 成为你的得力助手。
          </p>

          {/* CTA 按钮 */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              size="large"
              onClick={handleStartChat}
              className="group bg-[var(--interactive-primary)] hover:bg-[var(--interactive-primary)]/90 text-white shadow-2xl hover:shadow-3xl px-10 py-6 text-lg font-semibold"
            >
              <Sparkles className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
              开始免费体验
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>

          {/* 额外信息 */}
          <motion.p
            className="text-sm text-[var(--text-secondary)] mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            无需注册 · 完全免费 · 即刻使用
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
