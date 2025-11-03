"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button/button";
import { HappyWoodsLogo } from "@/components/icons/happy-woods-logo";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 登录页面
 *
 * 特性：
 * - 温暖自然的设计风格，与项目其他页面一致
 * - 支持登录和注册两种模式切换
 * - 密码显示/隐藏功能
 * - 表单验证（前端基础验证）
 * - 流畅的动画效果
 * - 响应式设计
 *
 * TODO:
 * - 接入后端登录/注册 API
 * - 实现 JWT Token 管理
 * - 添加第三方登录（可选）
 * - 添加"忘记密码"功能
 */
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 错误状态
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 切换登录/注册模式
  const toggleMode = () => {
    setMode(prev => (prev === "login" ? "register" : "login"));
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });
  };

  // 表单输入处理
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // 前端表单验证
  const validateForm = (): boolean => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // 注册模式需要验证用户名
    if (mode === "register") {
      if (!formData.username.trim()) {
        newErrors.username = "请输入用户名";
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = "用户名至少3个字符";
        isValid = false;
      }
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = "请输入邮箱";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确";
      isValid = false;
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = "请输入密码";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少6个字符";
      isValid = false;
    }

    // 注册模式需要确认密码
    if (mode === "register") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "请确认密码";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "两次密码不一致";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 调用后端 API
      if (mode === "login") {
        // 登录 API 调用
        console.log("登录:", { email: formData.email, password: formData.password });

        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: 保存 token 到 localStorage
        // localStorage.setItem('auth_token', response.token);

        // 跳转到主页
        router.push("/notion-ai");
      } else {
        // 注册 API 调用
        console.log("注册:", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 注册成功后自动切换到登录
        setMode("login");
        setFormData({ ...formData, password: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("表单提交错误:", error);
      // TODO: 显示错误提示
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[var(--surface-base)] to-[var(--surface-elevated)]">
      {/* 返回主页链接 */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        ← 返回主页
      </Link>

      {/* 登录卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <HappyWoodsLogo size="md" animated />
        </div>

        {/* 标题 */}
        <motion.div
          className="text-center mb-8"
          key={mode}
          initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2 font-[family-name:var(--font-dm-sans)]">
            {mode === "login" ? "欢迎回来" : "创建账号"}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {mode === "login" ? "登录以继续使用 HappyWoods AI" : "开始您的 AI 智能助手之旅"}
          </p>
        </motion.div>

        {/* 表单卡片 */}
        <div className="bg-[var(--surface-elevated)] rounded-2xl shadow-lg border border-[var(--border-subtle)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名（仅注册时显示） */}
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange("username", e.target.value)}
                    placeholder="请输入用户名"
                    className={cn(
                      "w-full h-12 pl-11 pr-4 rounded-lg border bg-[var(--surface-base)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all",
                      errors.username
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-[var(--border-subtle)] focus:border-[var(--interactive-primary)] focus:ring-2 focus:ring-[var(--interactive-primary)]/20"
                    )}
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </motion.div>
            )}

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full h-12 pl-11 pr-4 rounded-lg border bg-[var(--surface-base)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all",
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-[var(--border-subtle)] focus:border-[var(--interactive-primary)] focus:ring-2 focus:ring-[var(--interactive-primary)]/20"
                  )}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={e => handleInputChange("password", e.target.value)}
                  placeholder="请输入密码"
                  className={cn(
                    "w-full h-12 pl-11 pr-12 rounded-lg border bg-[var(--surface-base)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all",
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-[var(--border-subtle)] focus:border-[var(--interactive-primary)] focus:ring-2 focus:ring-[var(--interactive-primary)]/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* 确认密码（仅注册时显示） */}
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  确认密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="再次输入密码"
                    className={cn(
                      "w-full h-12 pl-11 pr-4 rounded-lg border bg-[var(--surface-base)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all",
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-[var(--border-subtle)] focus:border-[var(--interactive-primary)] focus:ring-2 focus:ring-[var(--interactive-primary)]/20"
                    )}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </motion.div>
            )}

            {/* 忘记密码（仅登录时显示） */}
            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-[var(--interactive-primary)] hover:underline"
                >
                  忘记密码？
                </button>
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "处理中..." : mode === "login" ? "登录" : "注册"}
            </Button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {mode === "login" ? "还没有账号？" : "已有账号？"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-[var(--interactive-primary)] hover:underline font-medium"
              >
                {mode === "login" ? "立即注册" : "立即登录"}
              </button>
            </p>
          </div>

          {/* 第三方登录（预留） */}
          {/* 
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-subtle)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
                  或使用第三方登录
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>
          </div>
          */}
        </div>

        {/* 底部提示 */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          登录即表示您同意我们的
          <Link href="/terms" className="text-[var(--interactive-primary)] hover:underline mx-1">
            服务条款
          </Link>
          和
          <Link href="/privacy" className="text-[var(--interactive-primary)] hover:underline ml-1">
            隐私政策
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
