"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button/button";
import { Sparkles, ArrowRight, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Hero Section 组件
 *
 * 特性：
 * - 全屏轮播图背景
 * - 自动切换（5秒间隔）
 * - 淡入淡出过渡效果
 * - 清新自然风格
 * - CTA 按钮跳转到 AI 对话
 */
export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 图片数据 - 精心挑选的温暖自然主题图片
  // 主题：森林、阳光、温暖色调、自然氛围
  // 优化：使用本地托管的图片，Next.js 自动优化
  const images = [
    {
      // 温暖的森林阳光 - 金色光线穿过树林
      url: "/images/hero/forest-sunlight.jpg",
      alt: "温暖的森林阳光",
    },
    {
      // 秋日森林小径 - 金黄色的树叶和阳光
      url: "/images/hero/autumn-path.jpg",
      alt: "秋日森林小径",
    },
    {
      // 日出森林湖泊 - 温暖金色倒影与宁静氛围
      url: "/images/hero/sunrise-lake.jpg",
      alt: "日出森林湖泊",
    },
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000); // 5秒切换一次

    return () => clearInterval(timer);
  }, [images.length]);

  // 跳转到 AI 对话
  const handleStartChat = () => {
    router.push("/notion-ai");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 背景轮播图 */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          {images.map(
            (image, index) =>
              index === currentSlide && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    duration: 1.0,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                >
                  {/* 使用 Next.js Image 组件优化加载 */}
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      priority={true} // 所有图片都优先加载，确保无缝切换
                      className="object-cover"
                      quality={85} // 本地图片可以提高质量
                      sizes="100vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmgAAAA/9k="
                    />
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* 渐变遮罩 - 确保文字清晰可读 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo/图标 */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-white/10 backdrop-blur-sm rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Ivan HappyWoods
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            温暖、自然、智能的 AI 对话体验
          </motion.p>

          {/* 描述文字 */}
          <motion.p
            className="text-base md:text-lg text-white/80 mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            基于最新 AI 技术，为您提供流畅、自然的智能对话体验。
            <br />
            让沟通更简单，让创作更自由。
          </motion.p>

          {/* CTA 按钮组 */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {/* 主 CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartChat}
              className="group bg-white hover:bg-white/90 text-[var(--interactive-primary)] shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              开始对话
            </Button>

            {/* 次要 CTA */}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                // 平滑滚动到特性区域
                document.getElementById("features")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300 px-8 py-6 text-lg"
            >
              了解更多
            </Button>
          </motion.div>
        </motion.div>

        {/* 滚动提示 */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">向下滚动</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* 轮播指示器 */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`切换到幻灯片 ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
