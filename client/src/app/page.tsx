import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/layout/footer";

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
      <Footer />
    </main>
  );
}
