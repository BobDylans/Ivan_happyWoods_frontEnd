import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--surface-base)]">
      {/* 固定顶部的主题切换按钮 */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section - 全屏轮播 */}
      <HeroSection />

      {/* 特性展示 */}
      <FeaturesSection />

      {/* CTA 区域 */}
      <CTASection />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto text-center">
          <Logo size="default" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            © 2025 Ivan HappyWoods · 让对话更温暖、更自然、更智能
          </p>
        </div>
      </footer>
    </main>
  );
}

