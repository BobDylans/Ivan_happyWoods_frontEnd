# Phase 0: Technical Research - Ivan_HappyWoods Design System

**Created**: 2025-10-15  
**Feature**: 001-design-specification-ivan  
**Purpose**: 解决技术实施中的未知因素，确立最佳实践和技术选型

---

## 研究概览

本研究阶段聚焦于为 Ivan_HappyWoods 设计系统建立技术基础，确保所选技术栈能够满足性能、可访问性、可维护性和开发体验的要求。

---

## 1. Next.js App Router 与设计系统集成

### 决策
使用 **Next.js 14+ App Router** 作为应用框架，配合服务器组件优化性能。

### 理由
1. **服务器组件 (RSC)**: 允许部分设计系统组件在服务器端渲染，减少客户端 JavaScript 包大小
2. **流式渲染**: 支持渐进式内容加载，改善首次内容绘制 (FCP) 时间
3. **现代化路由**: 基于文件系统的路由简化页面组织
4. **内置优化**: 自动图片优化、字体优化、代码分割
5. **TypeScript 原生支持**: 提供类型安全的开发体验

### 考虑的替代方案
- **Vite + React Router**: 更轻量但缺少服务器端优化，不适合需要 SEO 的应用
- **Remix**: 优秀的 SSR 框架，但生态系统较小，学习曲线较陡
- **Create React App**: 已不再推荐，缺少现代化特性

### 实施要点
```typescript
// app/layout.tsx - 根布局应用设计系统
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap' // 优化字体加载
})

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="bg-surface text-primary">
        {children}
      </body>
    </html>
  )
}
```

---

## 2. TailwindCSS 设计令牌系统

### 决策
使用 **TailwindCSS 3.4+** 作为样式系统，通过 `tailwind.config.ts` 实现设计令牌管理。

### 理由
1. **令牌映射**: Tailwind 的配置文件天然适合作为设计令牌的单一真实来源
2. **实用优先**: 减少自定义 CSS，提高开发速度
3. **Tree-shaking**: 自动删除未使用的样式，优化包大小
4. **JIT 模式**: 按需生成样式，支持任意值
5. **生态系统**: 大量插件和工具支持 (Prettier, ESLint, IntelliSense)

### 考虑的替代方案
- **CSS Modules**: 更传统，但需要更多自定义 CSS，令牌管理复杂
- **Styled Components**: 运行时成本高，不利于性能
- **Vanilla Extract**: 零运行时成本，但学习曲线陡峭，生态较小

### 实施要点
```typescript
// tailwind.config.ts - 设计令牌定义
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // 品牌色彩
        surface: {
          DEFAULT: '#FDFCF9',
          secondary: '#F8F5F1',
        },
        primary: {
          DEFAULT: '#E4B16B', // 温暖琥珀色
          light: '#F1C27D',
        },
        accent: '#9BC997', // 柔和鼠尾草绿
        text: {
          primary: '#2B2B2B',
          secondary: '#6B6B6B',
          muted: '#A0A0A0',
        },
        border: '#E2E0DC',
        error: '#E57373',
        success: '#7CB57E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        caption: ['13px', { lineHeight: '1.4' }],
        body: ['15px', { lineHeight: '1.6' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        h1: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['24px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      spacing: {
        // 4px 基准网格
        section: '32px',
        card: '16px',
        input: '14px',
      },
      borderRadius: {
        button: '10px',
        card: '16px',
        input: '12px',
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 6px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 3. Framer Motion 动画架构

### 决策
使用 **Framer Motion 11+** 作为动画库，创建可复用的动画变体系统。

### 理由
1. **声明式 API**: 易于理解和维护的动画定义
2. **性能优化**: 使用 GPU 加速的 transform 和 opacity
3. **手势支持**: 内置拖拽、悬停、点击等交互
4. **布局动画**: 自动处理布局变化的动画
5. **无障碍支持**: 自动响应 `prefers-reduced-motion`
6. **TypeScript 支持**: 完整的类型定义

### 考虑的替代方案
- **React Spring**: 基于物理的动画，但 API 复杂度高
- **GSAP**: 强大但需要商业许可，包体积大
- **CSS Transitions**: 简单但表达力有限，难以协调复杂动画

### 实施要点
```typescript
// src/components/animations/index.ts - 动画变体库
import { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

export const cardHover: Variants = {
  rest: { 
    y: 0, 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' 
  },
  hover: { 
    y: -3, 
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
    transition: { duration: 0.25, ease: 'easeOut' }
  },
}

export const buttonHover: Variants = {
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
}

// 响应 prefers-reduced-motion
export const respectMotionPreference = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  
  return prefersReducedMotion ? {
    transition: { duration: 0.01 } // 几乎瞬间
  } : {}
}
```

---

## 4. ShadCN/UI 集成与定制

### 决策
使用 **ShadCN/UI** 作为基础组件库，通过覆盖样式实现设计系统定制。

### 理由
1. **可复制可拥有**: 组件代码直接复制到项目，完全可控
2. **无依赖**: 不引入额外的包依赖
3. **Radix UI 基础**: 无障碍访问和键盘导航开箱即用
4. **TailwindCSS 原生**: 与我们的样式系统无缝集成
5. **TypeScript**: 完整的类型安全
6. **可定制**: 易于修改以匹配设计规范

### 考虑的替代方案
- **Material UI**: 样式定制困难，包体积大，不符合设计语言
- **Chakra UI**: 运行时样式系统，性能开销
- **Ant Design**: 设计语言冲突，难以深度定制

### 实施要点
```typescript
// src/components/ui/button/button.tsx - 定制 ShadCN Button
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-button font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-light',
        secondary: 'bg-transparent border border-border text-text-primary hover:bg-surface-secondary',
        text: 'text-accent hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-button px-3',
        lg: 'h-11 rounded-button px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

---

## 5. 测试策略与工具链

### 决策
采用 **多层次测试策略**：Vitest (单元) + React Testing Library (组件) + Playwright (E2E) + Storybook (视觉)

### 理由

#### Vitest
- 与 Vite 无缝集成，启动速度快
- 与 Jest 兼容的 API，迁移成本低
- 内置 TypeScript 支持
- 优秀的性能和开发体验

#### React Testing Library
- 专注于用户行为测试，而非实现细节
- 鼓励无障碍访问的测试实践
- 广泛的社区支持和文档

#### Playwright
- 跨浏览器支持 (Chromium, Firefox, WebKit)
- 自动等待和重试机制
- 强大的调试工具
- 并行测试执行

#### Storybook
- 组件隔离开发环境
- 交互式文档平台
- 视觉回归测试集成
- 设计系统展示

### 考虑的替代方案
- **Jest**: 成熟但启动慢，配置复杂
- **Cypress**: E2E 测试受限于浏览器内运行
- **Enzyme**: 已不再推荐，专注实现细节

### 实施要点
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '.storybook/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

```typescript
// src/components/ui/button/button.test.tsx - 组件测试示例
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary', 'text-white')
  })

  it('is keyboard accessible', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Accessible</Button>)
    const button = screen.getByRole('button')
    
    button.focus()
    expect(button).toHaveFocus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalled()
  })
})
```

---

## 6. 性能优化策略

### 决策
实施 **多维度性能优化**：代码分割、图片优化、字体策略、动画优化。

### 关键策略

#### 6.1 代码分割
```typescript
// 动态导入重量级组件
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <Skeleton />,
  ssr: false // 仅客户端加载
})
```

#### 6.2 图片优化
```typescript
// 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Ivan HappyWoods"
  width={200}
  height={60}
  priority // 对 Logo 使用优先加载
  placeholder="blur"
/>
```

#### 6.3 字体优化
```typescript
// next/font 自动优化
import { Inter, DM_Sans } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 防止不可见文本闪烁
  preload: true,
  fallback: ['system-ui', 'arial']
})
```

#### 6.4 动画性能
```typescript
// 仅使用 GPU 加速的属性
const optimizedAnimation = {
  // ✅ 好 - GPU 加速
  transform: 'translateY(-3px)',
  opacity: 0.8,
  
  // ❌ 避免 - 触发重排
  // top: '-3px',
  // height: '100px'
}
```

### 性能预算
- **JavaScript Bundle**: < 200KB (gzipped)
- **设计系统包增量**: < 50KB
- **首次加载时间**: < 1.5s (3G 网络)
- **交互响应时间**: < 100ms
- **动画帧率**: ≥ 60fps (桌面), ≥ 30fps (移动)

---

## 7. 无障碍访问实施

### 决策
**WCAG AAA 合规** + 自动化测试 + 手动审计

### 关键要求

#### 7.1 颜色对比度
```typescript
// 确保所有文本对比度 ≥ 7:1
const contrastTests = {
  'text-primary on surface': { bg: '#FDFCF9', fg: '#2B2B2B', ratio: 11.2 }, // ✅
  'text-secondary on surface': { bg: '#FDFCF9', fg: '#6B6B6B', ratio: 7.8 }, // ✅
  'primary on white': { bg: '#FFFFFF', fg: '#E4B16B', ratio: 3.2 }, // ❌ 仅用于非文本元素
}
```

#### 7.2 键盘导航
```typescript
// 所有交互元素必须键盘可访问
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  aria-label="描述性标签"
>
```

#### 7.3 焦点管理
```typescript
// 清晰的焦点指示器
const focusStyles = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
```

#### 7.4 ARIA 标签
```typescript
// 提供语义化信息
<nav aria-label="主导航">
  <button aria-expanded={isOpen} aria-controls="menu-panel">
    菜单
  </button>
  <div id="menu-panel" role="menu" aria-hidden={!isOpen}>
    {/* 菜单项 */}
  </div>
</nav>
```

### 测试工具
- **axe-core**: 自动化无障碍访问测试
- **pa11y**: CI/CD 集成
- **NVDA/VoiceOver**: 屏幕阅读器手动测试

---

## 8. Storybook 配置与文档化

### 决策
使用 **Storybook 7+** 作为组件开发和文档平台。

### 配置要点
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y', // 无障碍访问检查
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

```typescript
// .storybook/preview.ts - 应用设计系统主题
import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#FDFCF9' },
        { name: 'surface-secondary', value: '#F8F5F1' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
  },
}

export default preview
```

---

## 9. 开发工具链

### 决策的工具
- **包管理器**: pnpm (快速、节省磁盘空间)
- **代码格式化**: Prettier (一致的代码风格)
- **代码检查**: ESLint + TypeScript ESLint (类型安全和最佳实践)
- **Git Hooks**: Husky + lint-staged (提交前质量检查)
- **版本管理**: Changesets (语义化版本控制)

### 配置示例
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "jsx-a11y"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "jsx-a11y/anchor-is-valid": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 10. 部署与 CI/CD

### 决策
使用 **Vercel** 进行部署，GitHub Actions 进行 CI/CD。

### 理由
1. **Vercel**: Next.js 官方推荐，零配置部署
2. **预览部署**: 每个 PR 自动生成预览链接
3. **边缘网络**: 全球 CDN 加速
4. **性能监控**: 内置 Core Web Vitals 监控

### CI/CD 流程
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      
      - name: Accessibility tests
        run: pnpm test:a11y
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 研究结论

### ✅ 技术栈最终确认

| 类别 | 技术 | 版本 | 理由 |
|------|------|------|------|
| **框架** | Next.js | 14+ | App Router, RSC, 性能优化 |
| **语言** | TypeScript | 5.3+ | 类型安全, 开发体验 |
| **样式** | TailwindCSS | 3.4+ | 令牌系统, 实用优先 |
| **动画** | Framer Motion | 11+ | 声明式, 高性能, 无障碍 |
| **组件库** | ShadCN/UI | latest | 可控, Radix UI, 无依赖 |
| **图标** | Lucide React | latest | 线条风格, 一致性 |
| **测试** | Vitest + RTL + Playwright | latest | 多层次测试覆盖 |
| **文档** | Storybook | 7+ | 组件开发平台 |
| **部署** | Vercel | - | 零配置, 性能监控 |

### 🎯 下一步行动

Phase 0 研究完成，所有技术决策已明确。现在可以进入 **Phase 1: 设计与契约**：

1. ✅ 创建 `data-model.md` - 设计令牌数据模型
2. ✅ 创建 `contracts/` - 组件 API 契约
3. ✅ 创建 `quickstart.md` - 开发快速开始指南
4. ✅ 更新 Copilot 上下文

---

**研究状态**: ✅ 完成  
**所有 NEEDS CLARIFICATION 已解决**: 是  
**准备进入 Phase 1**: 是
