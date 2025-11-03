"use client";

import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { DemoPreviewSection } from "@/components/home/demo-preview-section";
import { Footer } from "@/components/layout/footer";

/**
 * Notion AI 风格智能助手项目主页
 *
 * 特性：
 * - 现代化的英雄区域设计
 * - 功能特性展示
 * - 项目介绍和技术栈
 * - 温暖自然的设计风格
 */
/**
 * 主页
 *
 * 特性：
 * - Hero Section - 全屏轮播背景
 * - Features Section - 核心特性展示
 * - How It Works Section - 使用流程
 * - Demo Preview Section - 对话演示
 * - Footer - 页脚导航
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - 全屏轮播背景 */}
      <HeroSection />

      {/* Features Section - 核心特性 */}
      <FeaturesSection />

      {/* How It Works Section - 使用流程 */}
      <HowItWorksSection />

      {/* Demo Preview Section - 对话演示 */}
      <DemoPreviewSection />

      {/* Footer - 页脚 */}
      <Footer />
    </div>
  );
}
