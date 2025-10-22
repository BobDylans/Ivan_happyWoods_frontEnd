import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { Logo } from "@/components/icons/logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--surface-base)]">
      {/* 全局导航栏 */}
      <Navigation />

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

