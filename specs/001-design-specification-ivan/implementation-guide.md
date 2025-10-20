# 🚀 Suna 设计学习 - 实施指南

**目标**: 将 Suna 项目的优秀实践应用到 Ivan_HappyWoods 项目中  
**预计时间**: 2-3 天  
**优先级**: P1 (高优先级改进)

---

## 📋 改进清单

### ✅ Phase 1 - 组件架构升级 (第1天)

#### 1.1 安装 CVA 并重构 Button 组件

**安装依赖**:
```bash
cd src
pnpm add class-variance-authority
```

**新建**: `src/components/ui/button/button-variants.ts`
```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  // 基础样式
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium",
    "transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--interactive-primary)]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--interactive-primary)]",
          "text-[var(--text-inverse)]",
          "shadow-sm",
          "hover:bg-[var(--interactive-primary-hover)]",
          "active:scale-95",
        ],
        secondary: [
          "bg-transparent",
          "border border-[var(--border-default)]",
          "text-[var(--text-primary)]",
          "hover:bg-[var(--surface-overlay)]",
        ],
        text: [
          "bg-transparent",
          "text-[var(--interactive-secondary)]",
          "hover:bg-[var(--surface-overlay)]",
        ],
        destructive: [
          "bg-[var(--status-error)]",
          "text-white",
          "hover:bg-[var(--status-error)]/90",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[var(--radius-md)] has-[>svg]:px-2.5",
        default: "h-11 px-6 text-base rounded-[var(--radius-md)] has-[>svg]:px-4",
        lg: "h-14 px-8 text-lg rounded-[var(--radius-lg)] has-[>svg]:px-6",
        icon: "size-11 rounded-[var(--radius-md)]",
      },
      loading: {
        true: "cursor-wait",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

**更新**: `src/components/ui/button/button.tsx`
```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariants } from "./button-variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    // 加载状态时禁用按钮
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...props}
      >
        {/* 左侧图标 */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}

        {/* 文字内容 */}
        <span>{children}</span>

        {/* 右侧图标 */}
        {rightIcon && !isLoading && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// 动画版本 (可选)
const MotionButton = motion(Button);

export { Button, MotionButton, buttonVariants };
```

**安装 Radix Slot** (如果还没安装):
```bash
pnpm add @radix-ui/react-slot
```

---

#### 1.2 扩充动画配置

**更新**: `src/lib/motion-config.ts`
```typescript
import { Variants, Transition } from "framer-motion";

// 动画持续时间
export const duration = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  verySlow: 0.4,
} as const;

// 缓动函数
export const easing = {
  // 标准缓动
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  
  // 弹簧缓动
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  } as Transition,
  
  springGentle: {
    type: "spring",
    stiffness: 200,
    damping: 20,
  } as Transition,
} as const;

// 基础动画变体
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: duration.fast,
    }
  },
};

export const slideUp: Variants = {
  initial: { 
    y: 20, 
    opacity: 0 
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: {
      duration: duration.fast,
    }
  },
};

export const slideDown: Variants = {
  initial: { 
    y: -20, 
    opacity: 0 
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: {
      duration: duration.fast,
    }
  },
};

export const scaleIn: Variants = {
  initial: { 
    scale: 0.9, 
    opacity: 0,
    rotateX: -30,
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    rotateX: -10,
    transition: {
      duration: duration.fast,
    }
  },
};

// 方向动画
export const enterFromLeft: Variants = {
  initial: { 
    x: -200, 
    opacity: 0 
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
};

export const enterFromRight: Variants = {
  initial: { 
    x: 200, 
    opacity: 0 
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
};

// 组件专用动画
export const buttonHover: Variants = {
  hover: {
    scale: 1.05,
    transition: easing.spring,
  },
  tap: {
    scale: 0.95,
  },
};

export const cardHover: Variants = {
  hover: {
    y: -3,
    boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

// 列表动画 (交错出现)
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { 
    y: 20, 
    opacity: 0 
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    }
  },
};

// 页面过渡
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.verySlow,
      ease: easing.easeOut,
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.normal,
    }
  },
};

// 响应式动画 - 支持 prefers-reduced-motion
export const prefersReducedMotion = 
  typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const getResponsiveVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion) {
    // 如果用户启用了减少动画，只保留不透明度变化
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return variants;
};
```

---

### ✅ Phase 2 - 深色模式支持 (第1天下午)

#### 2.1 安装 next-themes

```bash
pnpm add next-themes
```

#### 2.2 创建 Theme Provider

**新建**: `src/providers/theme-provider.tsx`
```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

#### 2.3 更新 Layout

**修改**: `src/app/layout.tsx`
```tsx
import { ThemeProvider } from "@/providers/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 2.4 添加深色模式色彩

**更新**: `src/app/globals.css`
```css
@layer base {
  :root {
    /* 浅色模式 (现有的) */
    --surface-base: #FDFCF9;
    --interactive-primary: #E4B16B;
    --text-primary: #2B2B2B;
    /* ... 其他颜色 */
  }

  .dark {
    /* 深色模式 */
    --surface-base: oklch(0.185 0.005 285.823);
    --surface-overlay: oklch(0.22 0.006 285.823);
    --interactive-primary: oklch(78% 0.12 75);
    --interactive-primary-hover: oklch(82% 0.14 75);
    --text-primary: oklch(0.985 0 0);
    --text-secondary: oklch(0.708 0 0);
    --border-default: oklch(0.9911 0 0 / 6%);
    --border-subtle: oklch(0.9911 0 0 / 4%);
    
    /* 状态颜色 */
    --status-success: oklch(0.696 0.17 162.48);
    --status-warning: oklch(0.769 0.188 70.08);
    --status-error: oklch(0.637 0.237 25.331);
  }
}
```

#### 2.5 创建主题切换组件

**新建**: `src/components/ui/theme-toggle.tsx`
```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="text"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="切换主题"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

---

### ✅ Phase 3 - OKLCH 色彩升级 (第2天)

#### 3.1 安装色彩工具

```bash
pnpm add color-bits
```

#### 3.2 创建色彩转换工具

**新建**: `src/lib/color-utils.ts`
```typescript
import * as Color from 'color-bits';

/**
 * 将 Hex 颜色转换为 OKLCH
 */
export function hexToOKLCH(hex: string): string {
  try {
    const color = Color.parse(hex);
    return Color.formatOKLCH(color);
  } catch (e) {
    console.error('Color conversion failed:', e);
    return hex;
  }
}

/**
 * 为颜色添加透明度
 */
export function addOpacity(color: string, opacity: number): string {
  try {
    const parsed = Color.parse(color);
    const withAlpha = Color.alpha(parsed, opacity);
    return Color.formatOKLCH(withAlpha);
  } catch (e) {
    return color;
  }
}

/**
 * 调整颜色亮度
 */
export function adjustLightness(color: string, amount: number): string {
  try {
    // 这里需要实现 OKLCH 的亮度调整逻辑
    // 暂时返回原颜色
    return color;
  } catch (e) {
    return color;
  }
}

// 色彩转换表
export const colorTokens = {
  // 中性色
  neutral: {
    50: hexToOKLCH('#FDFCF9'),
    100: hexToOKLCH('#F8F5F1'),
    200: hexToOKLCH('#E2E0DC'),
    900: hexToOKLCH('#2B2B2B'),
  },
  
  // 主色调
  amber: {
    400: hexToOKLCH('#F1C27D'),
    500: hexToOKLCH('#E4B16B'),
    600: hexToOKLCH('#D19F5A'),
  },
  
  // 次要色
  sage: {
    500: hexToOKLCH('#9CAF88'),
  },
  
  // 状态色
  coral: {
    400: hexToOKLCH('#E89B7D'),
  },
  
  leaf: {
    500: hexToOKLCH('#7CB57E'),
  },
};
```

#### 3.3 更新 globals.css

**修改**: `src/app/globals.css`
```css
@layer base {
  :root {
    /* 使用 OKLCH 色彩空间 */
    
    /* Surface - 表面颜色 */
    --surface-base: oklch(98.5% 0.01 85);         /* #FDFCF9 */
    --surface-overlay: oklch(97% 0.012 85);       /* #F8F5F1 */
    --surface-raised: oklch(100% 0 0);            /* #FFFFFF */
    
    /* Interactive - 交互色 */
    --interactive-primary: oklch(78% 0.12 75);    /* #E4B16B */
    --interactive-primary-hover: oklch(82% 0.14 75); /* #F1C27D */
    --interactive-secondary: oklch(67% 0.08 135); /* #9CAF88 */
    
    /* Text - 文字色 */
    --text-primary: oklch(25% 0.01 0);           /* #2B2B2B */
    --text-secondary: oklch(48% 0.01 0);         /* #6B6B6B */
    --text-tertiary: oklch(62% 0.01 0);          /* #A0A0A0 */
    --text-inverse: oklch(98% 0 0);              /* #FFFFFF */
    
    /* Border - 边框色 */
    --border-default: oklch(90% 0.01 85 / 80%);  /* #E2E0DC */
    --border-subtle: oklch(90% 0.01 85 / 40%);
    
    /* Status - 状态色 */
    --status-success: oklch(68% 0.12 145);       /* #7CB57E */
    --status-warning: oklch(75% 0.14 80);
    --status-error: oklch(65% 0.15 25);          /* #E89B7D */
  }

  .dark {
    /* 深色模式 - OKLCH 保持感知一致性 */
    --surface-base: oklch(20% 0.01 285);
    --surface-overlay: oklch(24% 0.012 285);
    --surface-raised: oklch(28% 0.01 285);
    
    --interactive-primary: oklch(78% 0.12 75);   /* 保持琥珀色 */
    --interactive-primary-hover: oklch(82% 0.14 75);
    --interactive-secondary: oklch(67% 0.08 135);
    
    --text-primary: oklch(95% 0 0);
    --text-secondary: oklch(70% 0 0);
    --text-tertiary: oklch(55% 0 0);
    --text-inverse: oklch(20% 0 0);
    
    --border-default: oklch(98% 0 0 / 10%);
    --border-subtle: oklch(98% 0 0 / 6%);
    
    --status-success: oklch(68% 0.12 145);
    --status-warning: oklch(75% 0.14 80);
    --status-error: oklch(65% 0.15 25);
  }
}
```

---

### ✅ Phase 4 - 优化 Card 组件 (第2天下午)

**更新**: `src/components/ui/card/card.tsx`
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

function Card({
  className,
  variant = "default",
  padding = "md",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        // 基础样式
        "rounded-[var(--radius-lg)] bg-[var(--surface-raised)]",
        "transition-all duration-250",
        
        // 变体
        {
          "shadow-sm": variant === "default",
          "shadow-md hover:shadow-lg": variant === "elevated",
          "border border-[var(--border-default)]": variant === "outlined",
        },
        
        // 内边距
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        
        // 交互效果
        {
          "hover:-translate-y-1 hover:shadow-xl cursor-pointer": interactive,
        },
        
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col space-y-1.5",
        "has-data-[slot=card-action]:flex-row has-data-[slot=card-action]:items-start has-data-[slot=card-action]:justify-between",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        "text-[var(--text-primary)]",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-sm text-[var(--text-secondary)]",
        className
      )}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-action"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("pt-4", className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};
```

---

## 📝 测试清单

### 组件测试

- [ ] Button 组件所有变体正常显示
- [ ] Button 加载状态正确显示
- [ ] Button 图标位置正确
- [ ] Card 组件所有变体正常
- [ ] Card 交互动画流畅
- [ ] 主题切换按钮工作正常

### 动画测试

- [ ] 页面过渡动画流畅
- [ ] 按钮悬停动画自然
- [ ] 卡片悬停动画正确
- [ ] 支持 prefers-reduced-motion

### 色彩测试

- [ ] 浅色模式对比度达标 (WCAG AAA)
- [ ] 深色模式对比度达标
- [ ] OKLCH 色彩显示正常
- [ ] 主题切换无闪烁

---

## 🎯 验收标准

1. **CVA Button**: 所有变体 (primary, secondary, text, destructive) 和尺寸 (sm, default, lg, icon) 正常工作
2. **深色模式**: 主题切换流畅,无闪烁,所有页面正常显示
3. **OKLCH 色彩**: 色彩感知一致,对比度符合 WCAG AAA
4. **动画系统**: 新增的 15+ 动画预设可正常使用
5. **Card 组件**: 支持 variant, padding, interactive 属性

---

## 📚 后续计划

### Week 2
- [ ] 添加 Zustand 状态管理
- [ ] 实现文件上传组件
- [ ] 完善聊天输入组件

### Week 3
- [ ] 引入 React Query
- [ ] 构建 Storybook 文档
- [ ] 性能优化

---

**开始时间**: _填写实际开始日期_  
**完成时间**: _填写实际完成日期_  
**验收人**: _填写验收人_

