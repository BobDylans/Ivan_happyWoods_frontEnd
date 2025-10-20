"use client";

import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[var(--radius-card)] transition-all duration-[var(--duration-normal)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-elevated)] border border-[var(--border-subtle)]",
        elevated:
          "bg-[var(--surface-elevated)] shadow-[var(--shadow-md)]",
        outlined:
          "bg-transparent border-2 border-[var(--border-default)]",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Enable hover animation (lift 3px) */
  interactive?: boolean;
}

/**
 * Card Component
 * Content container with optional hover animation
 * 
 * @example
 * <Card variant="elevated" padding="lg">Content</Card>
 * <Card interactive>Hover me</Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, children, ...props }, ref) => {
    const Component = interactive ? (motion.div as any) : "div";
    const motionProps = interactive
      ? {
          whileHover: {
            y: -3,
            boxShadow: "var(--shadow-lg)",
          },
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
          },
        }
      : {};

    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

/**
 * Card Header
 * Top section of card for title and description
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 pb-3", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

/**
 * Card Title
 * Primary heading in card header
 */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-[family-name:var(--font-dm-sans)] text-xl font-semibold text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

/**
 * Card Description
 * Secondary text in card header
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

/**
 * Card Content
 * Main content area of card
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));

CardContent.displayName = "CardContent";

/**
 * Card Footer
 * Bottom section of card for actions
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 pt-3", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";
