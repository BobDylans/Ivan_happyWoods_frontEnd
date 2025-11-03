import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva(
  "font-[family-name:var(--font-dm-sans)] text-[var(--text-primary)] font-semibold tracking-tight",
  {
    variants: {
      level: {
        h1: "text-5xl md:text-6xl leading-tight",
        h2: "text-3xl md:text-4xl leading-tight",
        h3: "text-2xl md:text-3xl leading-snug",
        h4: "text-xl md:text-2xl leading-snug",
      },
      weight: {
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      level: "h2",
      weight: "semibold",
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** Heading level (h1-h4) */
  level?: "h1" | "h2" | "h3" | "h4";
}

/**
 * Heading Component
 * Semantic heading component with proper hierarchy
 * Uses DM Sans font family for display text
 * Responsive font sizes across breakpoints
 *
 * @example
 * <Heading level="h1">Page Title</Heading>
 * <Heading level="h2" weight="bold">Section Title</Heading>
 * <Heading level="h3">Subsection</Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h2", weight, ...props }, ref) => {
    const Component = level;

    return (
      <Component
        ref={ref as any}
        className={cn(headingVariants({ level, weight }), className)}
        {...props}
      />
    );
  }
);

Heading.displayName = "Heading";
