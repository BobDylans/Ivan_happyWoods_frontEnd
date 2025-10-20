import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card/card";
import { Heart, Sparkles, Leaf, ArrowRight, MessageSquare, Mic, Volume2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-[var(--surface-base)]">
      {/* Header with Theme Toggle */}
      <div className="max-w-5xl mx-auto mb-12 relative">
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <Logo size="lg" withGlow />
        <p className="mt-4 text-[var(--text-secondary)] text-lg">
          A warm, natural, and intelligent design system
        </p>
      </div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-dm-sans)]">
          Welcome to <span className="text-[var(--interactive-primary)]">HappyWoods</span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
          A design system built with warm tones, natural curves, and intelligent interactions.
          Every component is crafted with care to meet WCAG AAA accessibility standards and deliver smooth animation experiences.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/home">
            <Button variant="primary" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
              项目主页
            </Button>
          </Link>
          <Link href="/notion-ai">
            <Button variant="secondary" size="lg" leftIcon={<MessageSquare className="w-5 h-5" />}>
              HappyWoods AI 体验
            </Button>
          </Link>
          <Link href="/ai">
            <Button variant="secondary" size="lg" leftIcon={<MessageSquare className="w-5 h-5" />}>
              AI 助手
            </Button>
          </Link>
          <Link href="/typography">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              查看排版系统
            </Button>
          </Link>
          <Button variant="text" size="lg" rightIcon={<Heart className="w-5 h-5" />}>
            收藏
          </Button>
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-dm-sans)]">
          Color System
        </h2>
        <p className="text-[var(--text-secondary)] mb-8">
          Warm neutral tones (#FDFCF9) paired with amber primary (#E4B16B) create a comfortable, natural visual experience
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="elevated" padding="lg">
            <div className="w-full h-20 rounded-[var(--radius-md)] bg-[var(--color-neutral-50)] mb-3 border border-[var(--border-subtle)]" />
            <p className="text-sm font-medium">Surface Base</p>
            <p className="text-xs text-[var(--text-secondary)]">#FDFCF9</p>
          </Card>
          <Card variant="elevated" padding="lg">
            <div className="w-full h-20 rounded-[var(--radius-md)] bg-[var(--interactive-primary)] mb-3" />
            <p className="text-sm font-medium">Amber Primary</p>
            <p className="text-xs text-[var(--text-secondary)]">#E4B16B</p>
          </Card>
          <Card variant="elevated" padding="lg">
            <div className="w-full h-20 rounded-[var(--radius-md)] bg-[var(--interactive-secondary)] mb-3" />
            <p className="text-sm font-medium">Sage Secondary</p>
            <p className="text-xs text-[var(--text-secondary)]">#9CAF88</p>
          </Card>
          <Card variant="elevated" padding="lg">
            <div className="w-full h-20 rounded-[var(--radius-md)] bg-[var(--status-error)] mb-3" />
            <p className="text-sm font-medium">Coral Error</p>
            <p className="text-xs text-[var(--text-secondary)]">#E89B7D</p>
          </Card>
        </div>
      </div>

      {/* Components Showcase */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-dm-sans)]">
          Core Components
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Chat Feature */}
          <Card interactive padding="lg" variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-[var(--interactive-primary)]" />
                <CardTitle>AI Chat</CardTitle>
              </div>
              <CardDescription>
                Intelligent conversation with streaming responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-center">
                <Sparkles className="w-4 h-4 text-[var(--interactive-primary)]" />
                <p className="text-sm text-[var(--text-primary)]">Real-time streaming responses</p>
              </div>
              <div className="flex gap-2 items-center">
                <Mic className="w-4 h-4 text-[var(--interactive-primary)]" />
                <p className="text-sm text-[var(--text-primary)]">Voice input (STT)</p>
              </div>
              <div className="flex gap-2 items-center">
                <Volume2 className="w-4 h-4 text-[var(--interactive-primary)]" />
                <p className="text-sm text-[var(--text-primary)]">Text-to-speech output</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/chat" className="w-full">
                <Button variant="primary" size="default" className="w-full">
                  开始对话
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Button Showcase */}
          <Card interactive padding="lg">
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>
                1.05x scale on hover with spring easing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="text">Text</Button>
              </div>
              <div className="flex gap-2">
                <Button isLoading>加载中...</Button>
                <Button disabled>已禁用</Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Showcase */}
          <Card interactive padding="lg">
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>
                Lifts 3px on hover with deepened shadow, 250ms transition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Card variant="default" padding="sm">
                <p className="text-sm">Default Card</p>
              </Card>
              <Card variant="elevated" padding="sm">
                <p className="text-sm">Elevated Card</p>
              </Card>
              <Card variant="outlined" padding="sm">
                <p className="text-sm">Outlined Card</p>
              </Card>
            </CardContent>
          </Card>

          {/* Logo Showcase */}
          <Card interactive padding="lg">
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Brand identity with optional breathing glow animation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Logo size="sm" />
              <Logo size="default" />
              <Logo size="lg" withGlow />
            </CardContent>
          </Card>

          {/* Design Principles */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle>Design Principles</CardTitle>
              <CardDescription>
                Core philosophies behind the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-[var(--interactive-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">4px Baseline Grid</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      All spacing values are multiples of 4
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-5 h-5 text-[var(--interactive-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">WCAG AAA Accessibility</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Minimum 7:1 contrast ratio
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--interactive-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Smooth Animations</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      60fps on desktop, reduced-motion support
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="text" size="sm">
                了解更多
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto text-center pt-12 border-t border-[var(--border-subtle)]">
        <Logo size="default" />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          © 2025 HappyWoods Design System · MVP v0.1.0
        </p>
      </div>
    </main>
  );
}

