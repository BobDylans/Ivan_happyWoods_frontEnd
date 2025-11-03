"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HappyWoodsLogoIcon } from "@/components/icons/happy-woods-logo";
import { Menu, X, Home, MessageSquare, Leaf, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 全局导航栏组件
 *
 * 特性：
 * - 固定顶部
 * - 滚动时自动隐藏
 * - 小箭头可重新唤出
 * - 响应式（移动端汉堡菜单）
 * - 当前页面高亮
 * - 平滑过渡动画
 */
export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showToggleButton, setShowToggleButton] = useState(false);

  const navItems = [
    { href: "/", label: "首页", icon: Home },
    { href: "/notion-ai", label: "AI 对话", icon: MessageSquare },
    { href: "/typography", label: "设计系统", icon: Leaf },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 向下滚动超过 100px 时隐藏导航栏
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
        setShowToggleButton(true);
      }
      // 向上滚动或回到顶部时显示导航栏
      else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
        setShowToggleButton(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 手动显示导航栏
  const handleShowNav = () => {
    setIsVisible(true);
    setShowToggleButton(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 桌面端导航栏 - 滚动时可隐藏 */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface-base)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]"
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <HappyWoodsLogoIcon
                size={32}
                className="transition-transform group-hover:scale-110"
              />
              <div className="hidden sm:block">
                <div className="font-semibold text-[var(--text-primary)] text-sm">HappyWoods</div>
                <div className="text-xs text-[var(--text-secondary)]">AI 助手</div>
              </div>
            </Link>

            {/* 桌面端菜单 */}
            <div className="hidden md:flex items-center gap-1 ml-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={cn(
                        "relative px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
                        active
                          ? "text-[var(--interactive-primary)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--interactive-primary)]"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-3">
              {/* 移动端菜单按钮 */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[var(--text-primary)]" />
                ) : (
                  <Menu className="w-6 h-6 text-[var(--text-primary)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 背景遮罩 */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* 菜单内容 */}
            <motion.div
              className="absolute top-[73px] left-0 right-0 bg-[var(--surface-base)] border-b border-[var(--border-subtle)] shadow-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 space-y-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <motion.div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          active
                            ? "bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 占位符，避免内容被导航栏遮挡 */}
      <div className="h-[73px]" />

      {/* 小箭头按钮 - 导航栏隐藏时显示 */}
      <AnimatePresence>
        {showToggleButton && (
          <motion.div
            className="fixed top-0 left-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ transform: "translateX(-50%)" }}
          >
            <motion.button
              onClick={handleShowNav}
              className="mt-2 px-4 py-2 bg-[var(--surface-base)]/90 backdrop-blur-xl border border-[var(--border-subtle)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: 2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="显示导航栏"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  显示菜单
                </span>
                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--interactive-primary)] transition-colors" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
