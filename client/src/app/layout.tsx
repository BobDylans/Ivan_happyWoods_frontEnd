import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

// 使用系统字体替代 Google Fonts（避免网络问题）
// 如果网络正常，可以恢复使用 Google Fonts

export const metadata: Metadata = {
  title: "Ivan_HappyWoods Design System",
  description: "A warm, natural, and intelligent design system built with warm tones, natural curves, and intelligent interactions",
  keywords: ["design system", "UI components", "React", "Next.js", "accessibility", "WCAG AAA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
