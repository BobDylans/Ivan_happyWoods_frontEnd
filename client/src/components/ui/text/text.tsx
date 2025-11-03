import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("text-[var(--text-primary)]", {
  variants: {
    variant: {
      "body-sm": "text-sm leading-relaxed",
      body: "text-base leading-relaxed",
      "body-lg": "text-lg leading-relaxed",
      muted: "text-[var(--text-secondary)]",
      subtle: "text-[var(--text-tertiary)]",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  /** Render as a different HTML element */
  as?: "p" | "span" | "div" | "label";
}

/**
 * Text Component
 * Primary text component for body copy
 * Supports multiple sizes and semantic color variants
 * Line height: 1.6 for comfortable reading
 *
 * @example
 * <Text variant="body">Default body text</Text>
 * <Text variant="body-sm" weight="medium">Small medium text</Text>
 * <Text variant="muted">Secondary information</Text>
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, weight, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(textVariants({ variant, weight }), className)}
        {...(props as any)}
      />
    );
  }
);

Text.displayName = "Text";
