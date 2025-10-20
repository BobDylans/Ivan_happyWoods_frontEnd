import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button 组件的变体配置
 * 使用 CVA (Class Variance Authority) 实现类型安全的样式变体管理
 */
export const buttonVariants = cva(
  // 基础样式 - 所有按钮共享
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium",
    "rounded-[var(--radius-md)]",
    "transition-all duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--interactive-primary)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // 主要按钮 - 琥珀色背景
        primary: [
          "bg-[var(--interactive-primary)]",
          "text-[var(--text-inverse)]",
          "shadow-sm",
          "hover:bg-[var(--interactive-primary-hover)]",
          "hover:shadow-md",
          "active:scale-95",
        ],
        // 次要按钮 - 透明背景带边框
        secondary: [
          "bg-transparent",
          "border border-[var(--border-default)]",
          "text-[var(--text-primary)]",
          "hover:bg-[var(--surface-overlay)]",
          "hover:border-[var(--interactive-primary)]",
        ],
        // 文字按钮 - 无背景无边框
        text: [
          "bg-transparent",
          "text-[var(--interactive-secondary)]",
          "hover:bg-[var(--surface-overlay)]",
          "hover:text-[var(--interactive-primary)]",
        ],
        // 危险按钮 - 错误状态色
        destructive: [
          "bg-[var(--status-error)]",
          "text-white",
          "shadow-sm",
          "hover:bg-[var(--status-error)]/90",
          "hover:shadow-md",
        ],
        // Ghost 按钮 - 极简样式
        ghost: [
          "bg-transparent",
          "hover:bg-[var(--surface-overlay)]",
          "hover:text-[var(--text-primary)]",
        ],
        // Link 按钮 - 链接样式
        link: [
          "text-[var(--interactive-primary)]",
          "underline-offset-4",
          "hover:underline",
        ],
      },
      size: {
        // 小尺寸
        sm: [
          "h-9 px-3 text-sm",
          "has-[>svg]:px-2.5",
          "[&_svg]:size-4",
        ],
        // 默认尺寸
        default: [
          "h-11 px-6 text-base",
          "has-[>svg]:px-4",
          "[&_svg]:size-5",
        ],
        // 大尺寸
        lg: [
          "h-14 px-8 text-lg",
          "has-[>svg]:px-6",
          "[&_svg]:size-6",
        ],
        // 图标按钮 - 正方形
        icon: [
          "size-11",
          "[&_svg]:size-5",
        ],
      },
      // 加载状态
      loading: {
        true: "cursor-wait opacity-70",
      },
    },
    // 默认变体
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

// 导出类型以供组件使用
export type ButtonVariants = VariantProps<typeof buttonVariants>;

