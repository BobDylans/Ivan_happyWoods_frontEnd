"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps as NextThemesProviderProps } from "next-themes/dist/types";

/**
 * Theme Provider
 *
 * 提供主题切换功能，支持：
 * - 浅色/深色模式切换
 * - 系统主题跟随
 * - SSR 友好
 * - 无闪烁加载
 *
 * @example
 * ```tsx
 * // 在 layout.tsx 中使用
 * <ThemeProvider>
 *   {children}
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: NextThemesProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
