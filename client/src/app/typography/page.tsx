import { Navigation } from "@/components/layout/navigation";
import { Heading } from "@/components/ui/heading/heading";
import { Text } from "@/components/ui/text/text";
import { Caption } from "@/components/ui/text/caption";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/card";
import { HappyWoodsLogo } from "@/components/icons/happy-woods-logo";
import { Footer } from "@/components/layout/footer";
import { Type, AlignLeft } from "lucide-react";

export default function TypographyPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-base)]">
      {/* 全局导航栏 */}
      <Navigation />

      <div className="p-8">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="mt-6">
            <HappyWoodsLogo size="md" animated />
            <Heading level="h1" className="mt-6">
              Typography System
            </Heading>
            <Text variant="body-lg" className="mt-4">
              A comprehensive typographic scale designed for readability and visual hierarchy. Built
              with Inter for body text and DM Sans for display text.
            </Text>
          </div>
        </div>

        {/* Heading Scale */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-6 h-6 text-[var(--interactive-primary)]" />
            <Heading level="h2">Heading Scale</Heading>
          </div>
          <Text variant="muted" className="mb-8">
            Four heading levels using DM Sans font family, responsive sizing, and proper semantic
            HTML
          </Text>

          <div className="space-y-8">
            <Card variant="elevated" padding="lg">
              <div className="space-y-6">
                <div className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <Caption weight="medium">H1 - Page Title</Caption>
                    <Caption size="xs">48px / 60px (mobile / desktop)</Caption>
                  </div>
                  <Heading level="h1">The quick brown fox jumps over the lazy dog</Heading>
                </div>

                <div className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <Caption weight="medium">H2 - Section Title</Caption>
                    <Caption size="xs">30px / 36px</Caption>
                  </div>
                  <Heading level="h2">The quick brown fox jumps over the lazy dog</Heading>
                </div>

                <div className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <Caption weight="medium">H3 - Subsection Title</Caption>
                    <Caption size="xs">24px / 30px</Caption>
                  </div>
                  <Heading level="h3">The quick brown fox jumps over the lazy dog</Heading>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <Caption weight="medium">H4 - Card Title</Caption>
                    <Caption size="xs">20px / 24px</Caption>
                  </div>
                  <Heading level="h4">The quick brown fox jumps over the lazy dog</Heading>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Body Text Scale */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-6">
            <AlignLeft className="w-6 h-6 text-[var(--interactive-primary)]" />
            <Heading level="h2">Body Text Scale</Heading>
          </div>
          <Text variant="muted" className="mb-8">
            Three body text sizes with consistent 1.6 line height for comfortable reading
          </Text>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <div className="flex items-baseline justify-between mb-2">
                  <Caption weight="medium">Body Large</Caption>
                  <Caption size="xs">18px</Caption>
                </div>
              </CardHeader>
              <CardContent>
                <Text variant="body-lg">
                  The quick brown fox jumps over the lazy dog. This is large body text used for
                  emphasis or introductory paragraphs.
                </Text>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader>
                <div className="flex items-baseline justify-between mb-2">
                  <Caption weight="medium">Body Default</Caption>
                  <Caption size="xs">16px</Caption>
                </div>
              </CardHeader>
              <CardContent>
                <Text variant="body">
                  The quick brown fox jumps over the lazy dog. This is the default body text size
                  used for most content throughout the application.
                </Text>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader>
                <div className="flex items-baseline justify-between mb-2">
                  <Caption weight="medium">Body Small</Caption>
                  <Caption size="xs">14px</Caption>
                </div>
              </CardHeader>
              <CardContent>
                <Text variant="body-sm">
                  The quick brown fox jumps over the lazy dog. This is small body text used for
                  dense information or compact layouts.
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Text Variants */}
        <div className="max-w-5xl mx-auto mb-16">
          <Heading level="h2" className="mb-6">
            Text Color Variants
          </Heading>
          <Text variant="muted" className="mb-8">
            Semantic color variants maintain proper contrast ratios (WCAG AAA: ≥7:1)
          </Text>

          <Card variant="elevated" padding="lg">
            <div className="space-y-6">
              <div>
                <Caption weight="medium" className="mb-2">
                  Primary (Default)
                </Caption>
                <Text variant="body">
                  This is primary text color used for main content. It has the highest contrast
                  against the background for optimal readability.
                </Text>
              </div>

              <div>
                <Caption weight="medium" className="mb-2">
                  Muted (Secondary)
                </Caption>
                <Text variant="muted">
                  This is muted text color used for secondary information, descriptions, and less
                  important content that should not compete with primary text.
                </Text>
              </div>

              <div>
                <Caption weight="medium" className="mb-2">
                  Subtle (Tertiary)
                </Caption>
                <Text variant="subtle">
                  This is subtle text color used for metadata, timestamps, and supplementary
                  information that should fade into the background.
                </Text>
              </div>
            </div>
          </Card>
        </div>

        {/* Caption & Labels */}
        <div className="max-w-5xl mx-auto mb-16">
          <Heading level="h2" className="mb-6">
            Captions & Labels
          </Heading>
          <Text variant="muted" className="mb-8">
            Small text for metadata, labels, and supplementary information
          </Text>

          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle>Caption Small (12px)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Caption size="xs">Normal weight</Caption>
                  <Text variant="body-sm" className="mt-1">
                    Used for timestamps, metadata, and very small labels
                  </Text>
                </div>
                <div>
                  <Caption size="xs" weight="medium">
                    Medium weight
                  </Caption>
                  <Text variant="body-sm" className="mt-1">
                    Used when caption needs slight emphasis
                  </Text>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle>Caption Default (14px)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Caption>Normal weight</Caption>
                  <Text variant="body-sm" className="mt-1">
                    Used for form labels, hints, and helper text
                  </Text>
                </div>
                <div>
                  <Caption weight="medium">Medium weight</Caption>
                  <Text variant="body-sm" className="mt-1">
                    Used for emphasized labels or section markers
                  </Text>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Font Weights */}
        <div className="max-w-5xl mx-auto mb-16">
          <Heading level="h2" className="mb-6">
            Font Weights
          </Heading>
          <Text variant="muted" className="mb-8">
            Available font weights for both Inter and DM Sans
          </Text>

          <Card variant="elevated" padding="lg">
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <Caption weight="medium" className="w-32">
                  Normal (400)
                </Caption>
                <Text weight="normal">The quick brown fox jumps over the lazy dog</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <Caption weight="medium" className="w-32">
                  Medium (500)
                </Caption>
                <Text weight="medium">The quick brown fox jumps over the lazy dog</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <Caption weight="medium" className="w-32">
                  Semibold (600)
                </Caption>
                <Text weight="semibold">The quick brown fox jumps over the lazy dog</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <Caption weight="medium" className="w-32">
                  Bold (700)
                </Caption>
                <Heading level="h4" weight="bold" className="text-base">
                  The quick brown fox jumps over the lazy dog
                </Heading>
              </div>
            </div>
          </Card>
        </div>

        {/* Usage Guidelines */}
        <div className="max-w-5xl mx-auto mb-16">
          <Heading level="h2" className="mb-6">
            Usage Guidelines
          </Heading>

          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <CardTitle className="text-[var(--status-success)]">✓ Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-[var(--status-success)]">•</span>
                    <Text variant="body-sm">Use H1 only once per page for main title</Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-success)]">•</span>
                    <Text variant="body-sm">Maintain proper heading hierarchy (H1 → H2 → H3)</Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-success)]">•</span>
                    <Text variant="body-sm">
                      Use body text with 1.6 line height for readability
                    </Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-success)]">•</span>
                    <Text variant="body-sm">Use muted text for secondary information</Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-success)]">•</span>
                    <Text variant="body-sm">Keep line length between 50-75 characters</Text>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="lg">
              <CardHeader>
                <CardTitle className="text-[var(--status-error)]">✗ Don&apos;t</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-[var(--status-error)]">•</span>
                    <Text variant="body-sm">Don&apos;t skip heading levels (H1 → H3)</Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-error)]">•</span>
                    <Text variant="body-sm">Don&apos;t use multiple H1s on the same page</Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-error)]">•</span>
                    <Text variant="body-sm">Don&apos;t use heading tags for styling alone</Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-error)]">•</span>
                    <Text variant="body-sm">
                      Don&apos;t set line height below 1.4 for body text
                    </Text>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--status-error)]">•</span>
                    <Text variant="body-sm">Don&apos;t use all caps for long sentences</Text>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accessibility */}
        <div className="max-w-5xl mx-auto mb-16">
          <Heading level="h2" className="mb-6">
            Accessibility Compliance
          </Heading>

          <Card variant="elevated" padding="lg">
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Heading level="h4" className="mb-3">
                    WCAG AAA Contrast Ratios
                  </Heading>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Caption weight="medium">Primary Text</Caption>
                      <Text variant="body-sm" className="mt-1">
                        Contrast: 8.2:1 (Exceeds 7:1 requirement)
                      </Text>
                    </div>
                    <div>
                      <Caption weight="medium">Muted Text</Caption>
                      <Text variant="body-sm" className="mt-1">
                        Contrast: 7.1:1 (Meets 7:1 requirement)
                      </Text>
                    </div>
                  </div>
                </div>

                <div>
                  <Heading level="h4" className="mb-3">
                    Semantic HTML
                  </Heading>
                  <Text variant="body-sm">
                    All heading components use proper semantic HTML tags (h1-h4) for screen reader
                    compatibility and SEO. Never use heading components purely for styling—use Text
                    component with appropriate variants instead.
                  </Text>
                </div>

                <div>
                  <Heading level="h4" className="mb-3">
                    Font Loading Strategy
                  </Heading>
                  <Text variant="body-sm">
                    Fonts are optimized with Next.js font loading to prevent layout shift and flash
                    of unstyled text (FOUT). Display swap ensures text remains visible during font
                    download.
                  </Text>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
