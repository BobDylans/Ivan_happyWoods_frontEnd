"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariants } from "./button-variants";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  /** Render as a child component (Slot pattern) */
  asChild?: boolean;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * Primary interactive element with hover animations (scale 1.05, spring easing)
 * Supports keyboard navigation and WCAG AAA accessibility
 *
 * Features:
 * - Type-safe variants using CVA
 * - Slot pattern support for composition
 * - Loading state with spinner
 * - Left/right icon support
 * - Smooth hover/tap animations
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="default">Click me</Button>
 * <Button variant="secondary" leftIcon={<Icon />}>With Icon</Button>
 * <Button isLoading>Loading...</Button>
 * <Button asChild><Link href="/">As Link</Link></Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      asChild = false,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 支持 isLoading 或 loading 两种写法
    const loadingState = isLoading || loading;
    const isDisabled = disabled || loadingState;

    // 使用 Slot 模式或常规 button
    const Comp = asChild ? Slot : "button";
    const MotionComp = motion(Comp) as any;

    return (
      <MotionComp
        ref={ref}
        className={cn(buttonVariants({ variant, size, loading: loadingState, className }))}
        disabled={isDisabled}
        // 动画效果 - 仅在非禁用状态
        whileHover={!isDisabled ? { scale: 1.05 } : undefined}
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        {/* 加载状态显示 spinner */}
        {loadingState && <Loader2 className="animate-spin" />}

        {/* 左侧图标 */}
        {!loadingState && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}

        {/* 按钮内容 */}
        <span>{children}</span>

        {/* 右侧图标 */}
        {!loadingState && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </MotionComp>
    );
  }
);

Button.displayName = "Button";

// 导出 buttonVariants 供外部使用
export { buttonVariants };
