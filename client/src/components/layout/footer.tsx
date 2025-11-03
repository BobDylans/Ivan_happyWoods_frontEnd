"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Github, Twitter, Mail, MessageCircle } from "lucide-react";

/**
 * Footer 组件
 *
 * 特性：
 * - 导航链接
 * - 快捷入口
 * - 社交链接
 * - 版权信息
 */

export const Footer: React.FC = () => {
  const navigation = {
    product: [
      { name: "功能特性", href: "/#features" },
      { name: "使用指南", href: "/#how-it-works" },
      { name: "开始使用", href: "/notion-ai" },
      { name: "更新日志", href: "/changelog" },
    ],
    resources: [
      { name: "帮助中心", href: "/help" },
      { name: "使用文档", href: "/docs" },
      { name: "快捷键", href: "/help#shortcuts" },
      { name: "常见问题", href: "/help#faq" },
    ],
    company: [
      { name: "关于我们", href: "/about" },
      { name: "联系我们", href: "/contact" },
      { name: "隐私政策", href: "/privacy" },
      { name: "服务条款", href: "/terms" },
    ],
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/BobDylans/Ivan_happyWoods_frontEnd",
      icon: Github,
    },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Email", href: "mailto:contact@happywoods.ai", icon: Mail },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* 主要内容区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* 品牌区 */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Ivan HappyWoods</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              温暖、自然、智能的 AI 对话体验。
              <br />
              让沟通更简单，让创作更自由。
            </p>

            {/* 社交链接 */}
            <div className="flex gap-4">
              {socialLinks.map(social => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300 group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 产品导航 */}
          <div>
            <h3 className="text-white font-semibold mb-4">产品</h3>
            <ul className="space-y-3">
              {navigation.product.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 资源导航 */}
          <div>
            <h3 className="text-white font-semibold mb-4">资源</h3>
            <ul className="space-y-3">
              {navigation.resources.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 公司导航 */}
          <div>
            <h3 className="text-white font-semibold mb-4">公司</h3>
            <ul className="space-y-3">
              {navigation.company.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA 区域 */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">准备好开始了吗？</h3>
            <p className="text-blue-100 mb-6">立即体验智能 AI 对话，开启高效沟通之旅</p>
            <Link
              href="/notion-ai"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>开始对话</span>
            </Link>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 Ivan HappyWoods. All rights reserved.</p>
          <p>Built with ❤️ using Next.js & TypeScript</p>
        </div>
      </div>
    </footer>
  );
};
