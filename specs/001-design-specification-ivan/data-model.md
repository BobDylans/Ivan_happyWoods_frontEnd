# Phase 1: Data Model - Ivan_HappyWoods Design System

**Created**: 2025-10-15  
**Feature**: 001-design-specification-ivan  
**Purpose**: 定义设计系统的数据结构、设计令牌层次结构和组件状态模型

---

## 设计令牌层次结构

设计令牌是设计系统的原子单位，组织为三层结构：**基础层 → 语义层 → 组件层**

### 1. 基础令牌 (Primitive Tokens)

原始设计值，不包含语义含义。

#### 1.1 色彩基础令牌

```typescript
// src/styles/tokens/colors.ts
export const primitiveColors = {
  // 中性色
  neutral: {
    0: '#FFFFFF',
    50: '#FDFCF9',    // 主背景
    100: '#F8F5F1',   // 次级背景
    200: '#E2E0DC',   // 边框
    400: '#A0A0A0',   // 占位符
    600: '#6B6B6B',   // 次级文本
    900: '#2B2B2B',   // 主要文本
  },
  // 品牌色
  amber: {
    400: '#F1C27D',   // 浅琥珀
    500: '#E4B16B',   // 主琥珀
  },
  sage: {
    500: '#9BC997',   // 鼠尾草绿
  },
  // 功能色
  coral: {
    400: '#E57373',   // 错误/警告
  },
  green: {
    500: '#7CB57E',   // 成功
  },
} as const
```

#### 1.2 间距基础令牌

```typescript
// src/styles/tokens/spacing.ts
export const primitiveSpacing = {
  px: '1px',
  0: '0',
  1: '4px',    // 基准单位
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
} as const
```

#### 1.3 排版基础令牌

```typescript
// src/styles/tokens/typography.ts
export const primitiveTypography = {
  fontFamilies: {
    inter: 'var(--font-inter), system-ui, sans-serif',
    dmSans: 'var(--font-dm-sans), system-ui, sans-serif',
  },
  fontSizes: {
    xs: '12px',
    sm: '13px',
    base: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const
```

#### 1.4 边框半径基础令牌

```typescript
// src/styles/tokens/border-radius.ts
export const primitiveBorderRadius = {
  none: '0',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const
```

---

### 2. 语义令牌 (Semantic Tokens)

基础令牌的语义化映射，表达设计意图。

```typescript
// src/styles/tokens/semantic.ts
import { primitiveColors, primitiveSpacing, primitiveTypography, primitiveBorderRadius } from './index'

export const semanticTokens = {
  colors: {
    // 表面色
    surface: {
      default: primitiveColors.neutral[50],      // #FDFCF9
      secondary: primitiveColors.neutral[100],   // #F8F5F1
      elevated: primitiveColors.neutral[0],      // #FFFFFF
    },
    // 文本色
    text: {
      primary: primitiveColors.neutral[900],     // #2B2B2B
      secondary: primitiveColors.neutral[600],   // #6B6B6B
      muted: primitiveColors.neutral[400],       // #A0A0A0
      inverse: primitiveColors.neutral[0],       // #FFFFFF
    },
    // 交互色
    interactive: {
      primary: primitiveColors.amber[500],       // #E4B16B
      primaryHover: primitiveColors.amber[400],  // #F1C27D
      secondary: primitiveColors.sage[500],      // #9BC997
    },
    // 边框色
    border: {
      default: primitiveColors.neutral[200],     // #E2E0DC
      focus: primitiveColors.amber[500],         // #E4B16B
    },
    // 状态色
    status: {
      error: primitiveColors.coral[400],         // #E57373
      success: primitiveColors.green[500],       // #7CB57E
      warning: primitiveColors.amber[500],       // #E4B16B
    },
  },
  
  spacing: {
    section: primitiveSpacing[8],      // 32px - 主要区块间距
    card: primitiveSpacing[4],         // 16px - 卡片间距
    input: primitiveSpacing[3],        // 12px - 输入框内边距
    containerX: {
      desktop: primitiveSpacing[10],   // 40px
      mobile: primitiveSpacing[5],     // 20px
    },
  },
  
  typography: {
    heading: {
      h1: {
        fontFamily: primitiveTypography.fontFamilies.inter,
        fontSize: primitiveTypography.fontSizes['4xl'],  // 32px
        fontWeight: primitiveTypography.fontWeights.semibold,
        lineHeight: primitiveTypography.lineHeights.tight,
      },
      h2: {
        fontFamily: primitiveTypography.fontFamilies.inter,
        fontSize: primitiveTypography.fontSizes['3xl'],  // 28px
        fontWeight: primitiveTypography.fontWeights.semibold,
        lineHeight: primitiveTypography.lineHeights.snug,
      },
      h3: {
        fontFamily: primitiveTypography.fontFamilies.inter,
        fontSize: primitiveTypography.fontSizes['2xl'],  // 24px
        fontWeight: primitiveTypography.fontWeights.semibold,
        lineHeight: primitiveTypography.lineHeights.normal,
      },
    },
    body: {
      large: {
        fontSize: primitiveTypography.fontSizes.lg,      // 16px
        lineHeight: primitiveTypography.lineHeights.relaxed,
      },
      default: {
        fontSize: primitiveTypography.fontSizes.base,    // 15px
        lineHeight: primitiveTypography.lineHeights.relaxed,
      },
      caption: {
        fontSize: primitiveTypography.fontSizes.sm,      // 13px
        lineHeight: primitiveTypography.lineHeights.normal,
      },
    },
  },
  
  borderRadius: {
    button: primitiveBorderRadius.md,    // 10px
    input: primitiveBorderRadius.lg,     // 12px
    card: primitiveBorderRadius.xl,      // 16px
  },
  
  shadows: {
    card: {
      default: '0 4px 8px rgba(0, 0, 0, 0.05)',
      hover: '0 6px 16px rgba(0, 0, 0, 0.08)',
    },
    header: '0 2px 10px rgba(0, 0, 0, 0.03)',
  },
} as const
```

---

### 3. 组件令牌 (Component Tokens)

特定组件的令牌组合。

```typescript
// src/styles/tokens/components.ts
import { semanticTokens } from './semantic'

export const componentTokens = {
  button: {
    primary: {
      bg: semanticTokens.colors.interactive.primary,
      bgHover: semanticTokens.colors.interactive.primaryHover,
      text: semanticTokens.colors.text.inverse,
      borderRadius: semanticTokens.borderRadius.button,
      paddingX: '16px',
      paddingY: '8px',
      fontSize: '14px',
      fontWeight: 500,
    },
    secondary: {
      bg: 'transparent',
      bgHover: semanticTokens.colors.surface.secondary,
      text: semanticTokens.colors.text.primary,
      border: `1px solid ${semanticTokens.colors.border.default}`,
      borderRadius: semanticTokens.borderRadius.button,
      paddingX: '16px',
      paddingY: '8px',
    },
    text: {
      bg: 'transparent',
      text: semanticTokens.colors.interactive.secondary,
      textDecoration: 'underline',
      textDecorationColor: 'transparent',
      textDecorationColorHover: semanticTokens.colors.interactive.secondary,
    },
  },
  
  card: {
    bg: semanticTokens.colors.surface.elevated,
    borderRadius: semanticTokens.borderRadius.card,
    padding: '20px',
    shadow: semanticTokens.shadows.card.default,
    shadowHover: semanticTokens.shadows.card.hover,
  },
  
  input: {
    bg: semanticTokens.colors.surface.elevated,
    border: `1px solid ${semanticTokens.colors.border.default}`,
    borderFocus: `1px solid ${semanticTokens.colors.border.focus}`,
    borderRadius: semanticTokens.borderRadius.input,
    padding: '12px',
    fontSize: '15px',
    placeholderColor: semanticTokens.colors.text.muted,
  },
  
  sidebar: {
    width: '220px',
    bg: semanticTokens.colors.surface.elevated,
    shadow: semanticTokens.shadows.header,
    itemPadding: '12px 16px',
    itemBorderRadius: '8px',
    activeIndicatorColor: semanticTokens.colors.interactive.primary,
    activeIndicatorHeight: '2px',
  },
  
  header: {
    height: '64px',
    bg: semanticTokens.colors.surface.elevated,
    bgOpacity: 0.8,
    shadow: semanticTokens.shadows.header,
    backdropBlur: '10px',
  },
} as const
```

---

## 组件状态模型

### 通用组件状态

所有交互式组件共享的状态定义。

```typescript
// src/types/component-states.ts
export type ComponentState = 
  | 'default'       // 默认状态
  | 'hover'         // 悬停状态
  | 'active'        // 激活/按下状态
  | 'focus'         // 键盘焦点状态
  | 'disabled'      // 禁用状态
  | 'loading'       // 加载状态
  | 'error'         // 错误状态
  | 'success'       // 成功状态

export interface ComponentStateConfig {
  state: ComponentState
  styles: Record<string, string | number>
  animations?: AnimationConfig
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
    ariaDisabled?: boolean
  }
}
```

### 按钮状态模型

```typescript
// src/components/ui/button/button.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'text'
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'
export type ButtonState = ComponentState

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

export interface ButtonStateStyles {
  default: React.CSSProperties
  hover: React.CSSProperties
  active: React.CSSProperties
  focus: React.CSSProperties
  disabled: React.CSSProperties
  loading: React.CSSProperties
}
```

### 输入框状态模型

```typescript
// src/components/ui/input/input.types.ts
export type InputState = ComponentState
export type InputSize = 'sm' | 'default' | 'lg'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize
  error?: string
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
}

export interface InputStateStyles {
  default: React.CSSProperties
  focus: React.CSSProperties
  error: React.CSSProperties
  success: React.CSSProperties
  disabled: React.CSSProperties
}
```

### 卡片状态模型

```typescript
// src/components/ui/card/card.types.ts
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  interactive?: boolean  // 是否可交互(悬停效果)
  padding?: 'none' | 'sm' | 'default' | 'lg'
}

export interface CardStateStyles {
  default: React.CSSProperties
  hover?: React.CSSProperties  // 仅当 interactive=true
}
```

---

## 动画配置模型

### 动画变体定义

```typescript
// src/types/animation.ts
import { Variants, Transition } from 'framer-motion'

export interface AnimationConfig {
  variants: Variants
  transition?: Transition
  initial?: string
  animate?: string
  exit?: string
  whileHover?: string
  whileTap?: string
}

export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  
  cardHover: {
    rest: { 
      y: 0, 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' 
    },
    hover: { 
      y: -3, 
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.25, ease: 'easeOut' }
    },
  },
  
  buttonHover: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }
    },
    tap: { scale: 0.98 }
  },
  
  sidebarIndicator: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { duration: 0.2, ease: 'linear' }
  },
} as const

export type AnimationPreset = keyof typeof animationPresets
```

---

## 响应式断点模型

### 断点定义

```typescript
// src/types/breakpoints.ts
export const breakpoints = {
  mobile: '640px',     // ≤ 640px
  tablet: '1024px',    // 641px - 1024px
  desktop: '1025px',   // ≥ 1025px
} as const

export type Breakpoint = keyof typeof breakpoints

export interface ResponsiveConfig<T> {
  mobile?: T
  tablet?: T
  desktop: T  // 始终提供 desktop 默认值
}

// 示例：响应式间距配置
export interface ResponsiveSpacing {
  mobile: string
  tablet?: string
  desktop: string
}

// 示例：响应式布局配置
export interface LayoutConfig {
  sidebar: ResponsiveConfig<{
    visible: boolean
    position: 'left' | 'bottom'
    width?: string
  }>
  contentMaxWidth: string
  containerPadding: ResponsiveSpacing
}

export const defaultLayoutConfig: LayoutConfig = {
  sidebar: {
    mobile: { visible: true, position: 'bottom' },
    tablet: { visible: true, position: 'left', width: '200px' },
    desktop: { visible: true, position: 'left', width: '220px' },
  },
  contentMaxWidth: '900px',
  containerPadding: {
    mobile: '20px',
    desktop: '40px',
  },
}
```

---

## 主题配置模型

### 主题结构

```typescript
// src/types/theme.ts
import { semanticTokens, componentTokens } from '@/styles/tokens'

export interface Theme {
  name: string
  mode: 'light' | 'dark'
  colors: typeof semanticTokens.colors
  spacing: typeof semanticTokens.spacing
  typography: typeof semanticTokens.typography
  borderRadius: typeof semanticTokens.borderRadius
  shadows: typeof semanticTokens.shadows
  components: typeof componentTokens
  animations: {
    reducedMotion: boolean
  }
}

// 亮色主题（当前实施）
export const lightTheme: Theme = {
  name: 'Ivan HappyWoods Light',
  mode: 'light',
  colors: semanticTokens.colors,
  spacing: semanticTokens.spacing,
  typography: semanticTokens.typography,
  borderRadius: semanticTokens.borderRadius,
  shadows: semanticTokens.shadows,
  components: componentTokens,
  animations: {
    reducedMotion: false,
  },
}

// 暗色主题（未来扩展）
export const darkTheme: Partial<Theme> = {
  name: 'Ivan HappyWoods Dark',
  mode: 'dark',
  // TODO: 在未来规格说明中定义暗色令牌
}
```

---

## 组件 Props 验证模型

### 验证规则

```typescript
// src/lib/validation.ts
export interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

export const propValidation = {
  // 颜色对比度验证
  contrastRatio: (fg: string, bg: string): ValidationRule<number> => ({
    validate: (ratio) => ratio >= 7,  // WCAG AAA
    message: `Contrast ratio ${ratio.toFixed(2)} is below WCAG AAA standard (7:1)`,
  }),
  
  // 响应时间验证
  interactionDelay: (): ValidationRule<number> => ({
    validate: (delay) => delay < 100,
    message: `Interaction delay ${delay}ms exceeds 100ms requirement`,
  }),
  
  // 动画帧率验证
  frameRate: (device: 'desktop' | 'mobile'): ValidationRule<number> => ({
    validate: (fps) => device === 'desktop' ? fps >= 60 : fps >= 30,
    message: `Frame rate ${fps}fps is below ${device === 'desktop' ? 60 : 30}fps requirement`,
  }),
}
```

---

## 数据模型关系图

```
┌─────────────────────────────────────────────────────────────┐
│                     Design Token Hierarchy                   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ├─ Primitive Tokens
                               │  ├─ Colors (neutral, brand, functional)
                               │  ├─ Spacing (4px grid)
                               │  ├─ Typography (fonts, sizes, weights)
                               │  └─ Border Radius
                               │
                               ├─ Semantic Tokens
                               │  ├─ Surface colors
                               │  ├─ Text colors
                               │  ├─ Interactive colors
                               │  ├─ Spacing scale
                               │  ├─ Typography scale
                               │  └─ Shadows
                               │
                               └─ Component Tokens
                                  ├─ Button variants
                                  ├─ Card styles
                                  ├─ Input styles
                                  ├─ Sidebar config
                                  └─ Header config

┌─────────────────────────────────────────────────────────────┐
│                      Component State Model                   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ├─ Common States
                               │  (default, hover, active, focus, disabled)
                               │
                               ├─ Component-Specific Props
                               │  ├─ Button (variant, size, loading)
                               │  ├─ Input (error, success, icons)
                               │  └─ Card (interactive, padding)
                               │
                               └─ State Styles
                                  └─ CSS Properties per state

┌─────────────────────────────────────────────────────────────┐
│                      Animation Model                         │
└─────────────────────────────────────────────────────────────┘
                               │
                               ├─ Animation Presets
                               │  ├─ fadeIn, slideUp
                               │  ├─ cardHover, buttonHover
                               │  └─ sidebarIndicator
                               │
                               └─ Animation Config
                                  ├─ Variants (Framer Motion)
                                  ├─ Transition (duration, easing)
                                  └─ Reduced Motion Support

┌─────────────────────────────────────────────────────────────┐
│                      Responsive Model                        │
└─────────────────────────────────────────────────────────────┘
                               │
                               ├─ Breakpoints (mobile, tablet, desktop)
                               │
                               ├─ Responsive Configs
                               │  ├─ Layout (sidebar, content width)
                               │  ├─ Spacing (padding, margins)
                               │  └─ Typography (font sizes)
                               │
                               └─ Media Queries (CSS/JS)
```

---

## 类型定义索引

完整的 TypeScript 类型定义，确保类型安全。

```typescript
// src/types/index.ts - 统一导出
export * from './component-states'
export * from './animation'
export * from './breakpoints'
export * from './theme'
export * from './design-system'

// src/types/design-system.d.ts - 全局类型增强
import '@/styles/tokens'

declare module '@/styles/tokens' {
  export const primitiveColors: typeof import('@/styles/tokens/colors').primitiveColors
  export const semanticTokens: typeof import('@/styles/tokens/semantic').semanticTokens
  export const componentTokens: typeof import('@/styles/tokens/components').componentTokens
}
```

---

## 验证与测试

### 令牌验证测试

```typescript
// tests/unit/tokens.test.ts
import { describe, it, expect } from 'vitest'
import { semanticTokens, primitiveColors } from '@/styles/tokens'
import { calculateContrastRatio } from '@/lib/color-utils'

describe('Design Tokens', () => {
  it('should have valid color contrast ratios', () => {
    const textOnSurface = calculateContrastRatio(
      semanticTokens.colors.text.primary,
      semanticTokens.colors.surface.default
    )
    expect(textOnSurface).toBeGreaterThanOrEqual(7) // WCAG AAA
  })
  
  it('should follow 4px spacing grid', () => {
    const spacingValues = Object.values(semanticTokens.spacing)
    spacingValues.forEach(value => {
      if (typeof value === 'string') {
        const numValue = parseInt(value)
        expect(numValue % 4).toBe(0)
      }
    })
  })
})
```

---

**数据模型状态**: ✅ 完成  
**下一步**: 创建组件契约 (contracts/)
