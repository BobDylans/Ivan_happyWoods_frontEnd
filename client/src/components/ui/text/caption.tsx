import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const captionVariants = cva("text-[var(--text-secondary)]", {
  variants: {
    size: {
      xs: "text-xs leading-relaxed",
      sm: "text-sm leading-relaxed",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
    },
  },
  defaultVariants: {
    size: "sm",
    weight: "normal",
  },
});

export interface CaptionProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof captionVariants> {
  /** Render as a different HTML element */
  as?: "span" | "p" | "div" | "label";
}

/**
 * Caption Component
 * Small text for labels, hints, and supplementary information
 * Always uses secondary text color for visual hierarchy
 *
 * @example
 * <Caption>Last updated 2 hours ago</Caption>
 * <Caption size="xs">Metadata information</Caption>
 * <Caption weight="medium">Important note</Caption>
 */
export const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, size, weight, as: Component = "span", ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(captionVariants({ size, weight }), className)}
        {...(props as any)}
      />
    );
  }
);

Caption.displayName = "Caption";
