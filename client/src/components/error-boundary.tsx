"use client";

import React, { Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { HappyWoodsLogo } from "@/components/icons/happy-woods-logo";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * 错误边界组件
 *
 * 捕获子组件树中的 JavaScript 错误，显示友好的错误提示
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到控制台
    console.error("错误边界捕获到错误:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // 这里可以添加错误上报逻辑
    // reportError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--surface-base)] to-[var(--surface-elevated)] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-[var(--border-subtle)]">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <HappyWoodsLogo size="sm" animated={false} />
              </div>

              {/* 错误图标 */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[var(--status-error)]/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-[var(--status-error)]" />
                </div>
              </div>

              {/* 标题 */}
              <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-3">
                哎呀，出错了
              </h1>

              {/* 友好提示 */}
              <p className="text-center text-[var(--text-secondary)] mb-6">
                很抱歉，应用遇到了一个意外错误。请尝试刷新页面或返回首页。
              </p>

              {/* 错误详情（开发环境显示） */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-6 p-4 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-default)]">
                  <summary className="cursor-pointer text-sm font-medium text-[var(--text-secondary)] mb-2">
                    查看错误详情
                  </summary>
                  <div className="text-xs font-mono text-[var(--status-error)] overflow-auto max-h-40">
                    <p className="mb-2 font-bold">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap text-[var(--text-tertiary)]">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="lg" onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新加载
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    返回首页
                  </Button>
                </Link>
              </div>

              {/* 帮助文本 */}
              <p className="text-xs text-center text-[var(--text-tertiary)] mt-6">
                如果问题持续存在，请联系技术支持或稍后再试
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 简单的错误边界 Hook 版本（用于功能组件）
 * 注意：这不是真正的错误边界，仅用于展示错误状态
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error("捕获到错误:", error);
    setError(error);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, resetError };
}
