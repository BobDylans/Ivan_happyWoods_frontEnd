# Quick Start Guide - Ivan_HappyWoods Design System

**Created**: 2025-10-15  
**Version**: 1.0.0  
**Target Audience**: 开发者、设计师

---

## 📦 安装

### 前置要求

- Node.js 20+ 
- pnpm 8+ (推荐) 或 npm/yarn
- Git

### 1. 克隆项目

```bash
git clone <repository-url>
cd frontEnd
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 🎨 核心概念

### 设计令牌层次

Ivan_HappyWoods 设计系统使用三层令牌结构:

```
基础令牌 (Primitive) → 语义令牌 (Semantic) → 组件令牌 (Component)
```

#### 示例

```typescript
// ❌ 不要直接使用原始值
<div style={{ color: '#E4B16B' }}>

// ✅ 使用语义令牌
<div className="text-interactive-primary">

// ✅ 或使用 Tailwind 配置的令牌
<div className="text-primary">
```

### 4px 基准网格

所有间距必须是 4px 的倍数:

```tsx
// ✅ 正确
<div className="p-4 m-8">  // 16px padding, 32px margin

// ❌ 错误
<div className="p-3 m-7">  // 12px, 28px 不符合网格
```

---

## 🚀 快速示例

### 创建一个简单页面

```tsx
// app/demo/page.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function DemoPage() {
  return (
    <div className="container max-w-[900px] mx-auto p-10">
      <h1 className="text-h1 text-text-primary mb-8">
        欢迎来到 Ivan HappyWoods
      </h1>
      
      <Card interactive padding="default" className="mb-card">
        <h2 className="text-h3 mb-4">示例卡片</h2>
        <p className="text-body text-text-secondary mb-6">
          这是一个使用设计系统的示例卡片，展示温暖自然的视觉风格。
        </p>
        
        <div className="flex gap-4">
          <Input placeholder="请输入内容" />
          <Button variant="primary">提交</Button>
          <Button variant="secondary">取消</Button>
        </div>
      </Card>
    </div>
  )
}
```

### 使用动画

```tsx
'use client'

import { motion } from 'framer-motion'
import { fadeIn, slideUp, cardHover } from '@/components/animations'

export function AnimatedCard() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={slideUp}
      whileHover="hover"
      className="bg-surface-elevated rounded-card p-5 shadow-card"
    >
      <h3>动画卡片</h3>
      <p>悬停查看效果</p>
    </motion.div>
  )
}
```

---

## 📁 项目结构

```
frontEnd/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   │
│   ├── components/            # 组件库
│   │   ├── ui/               # 基础 UI 组件
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   └── ...
│   │   ├── layout/           # 布局组件
│   │   │   ├── sidebar/
│   │   │   ├── header/
│   │   │   └── main-layout/
│   │   └── animations/       # 动画变体
│   │
│   ├── styles/               # 样式和令牌
│   │   ├── globals.css       # 全局样式
│   │   ├── design-tokens.ts  # TypeScript 令牌
│   │   └── theme.config.ts   # 主题配置
│   │
│   └── lib/                  # 工具函数
│       └── utils.ts
│
├── tailwind.config.ts        # Tailwind 配置 (设计令牌)
└── .storybook/              # Storybook 配置
```

---

## 🎯 常用任务

### 创建新组件

1. **创建组件目录**:
   ```bash
   mkdir -p src/components/ui/my-component
   cd src/components/ui/my-component
   ```

2. **创建组件文件**:
   ```tsx
   // my-component.tsx
   import { forwardRef } from 'react'
   import { cn } from '@/lib/utils'
   
   export interface MyComponentProps {
     className?: string
     // ... 其他 props
   }
   
   export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
     ({ className, ...props }, ref) => {
       return (
         <div
           ref={ref}
           className={cn('base-styles', className)}
           {...props}
         />
       )
     }
   )
   MyComponent.displayName = 'MyComponent'
   ```

3. **创建 Storybook Story**:
   ```tsx
   // my-component.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { MyComponent } from './my-component'
   
   const meta: Meta<typeof MyComponent> = {
     title: 'UI/MyComponent',
     component: MyComponent,
     tags: ['autodocs'],
   }
   
   export default meta
   type Story = StoryObj<typeof MyComponent>
   
   export const Default: Story = {
     args: {
       // default props
     },
   }
   ```

4. **创建测试**:
   ```tsx
   // my-component.test.tsx
   import { render, screen } from '@testing-library/react'
   import { describe, it, expect } from 'vitest'
   import { MyComponent } from './my-component'
   
   describe('MyComponent', () => {
     it('renders correctly', () => {
       render(<MyComponent>Test</MyComponent>)
       expect(screen.getByText('Test')).toBeInTheDocument()
     })
   })
   ```

### 运行 Storybook

```bash
pnpm storybook
```

访问 [http://localhost:6006](http://localhost:6006) 查看组件文档。

### 运行测试

```bash
# 单元测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 监听模式
pnpm test:watch

# E2E 测试
pnpm test:e2e
```

### 代码质量检查

```bash
# ESLint
pnpm lint

# 类型检查
pnpm type-check

# 格式化
pnpm format
```

---

## 🎨 使用 Tailwind 令牌

### 颜色

```tsx
<div className="bg-surface text-text-primary">
  <p className="text-text-secondary">次级文本</p>
  <button className="bg-primary hover:bg-primary-light">按钮</button>
</div>
```

### 间距

```tsx
<div className="p-5 m-section">           {/* 20px padding, 32px margin */}
  <div className="space-y-card">          {/* 16px 垂直间距 */}
    <div>项目 1</div>
    <div>项目 2</div>
  </div>
</div>
```

### 排版

```tsx
<h1 className="text-h1 font-semibold">标题 1</h1>
<h2 className="text-h2">标题 2</h2>
<p className="text-body text-text-secondary">正文内容</p>
<span className="text-caption text-text-muted">说明文字</span>
```

### 圆角

```tsx
<button className="rounded-button">按钮</button>
<div className="rounded-card">卡片</div>
<input className="rounded-input" />
```

---

## 🔧 自定义配置

### 扩展 Tailwind 配置

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // 添加自定义颜色
        'my-color': '#123456',
      },
      spacing: {
        // 添加自定义间距
        '72': '288px',
      },
    },
  },
}

export default config
```

### 添加全局样式

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 自定义基础样式 */
  body {
    @apply bg-surface text-text-primary;
  }
}

@layer components {
  /* 自定义组件样式 */
  .btn-custom {
    @apply px-4 py-2 rounded-button bg-primary text-white;
  }
}
```

---

## 📚 进一步学习

### 文档资源

- [规格说明](./spec.md) - 完整的功能需求和用户故事
- [数据模型](./data-model.md) - 设计令牌和组件状态模型
- [组件契约](./contracts/component-api.md) - 组件 API 定义
- [技术研究](./research.md) - 技术选型和最佳实践

### 外部资源

- [Next.js 文档](https://nextjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [ShadCN/UI 文档](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

## ❓ 常见问题

### Q: 如何添加新的设计令牌?

**A**: 

1. 在 `tailwind.config.ts` 中添加原始值
2. 在 `styles/design-tokens.ts` 中创建语义映射
3. 在组件中使用语义类名

示例:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'new-color': '#ABC123',
    }
  }
}

// 使用
<div className="bg-new-color">
```

### Q: 如何确保无障碍访问合规?

**A**:

1. 使用语义化 HTML 标签
2. 添加适当的 ARIA 属性
3. 确保键盘导航支持
4. 测试色彩对比度 (≥7:1)
5. 运行自动化测试: `pnpm test:a11y`

### Q: 动画性能不佳怎么办?

**A**:

1. 仅使用 GPU 加速属性 (transform, opacity)
2. 避免动画期间改变布局
3. 使用 `will-change` CSS 属性
4. 在移动设备上禁用复杂动画

```tsx
<motion.div
  animate={{ transform: 'translateY(-3px)' }}  // ✅ GPU 加速
  // 避免: animate={{ top: '-3px' }}          // ❌ 触发重排
/>
```

### Q: 如何支持暗色模式?

**A**:

暗色模式将在未来版本中添加。当前版本仅支持亮色主题。计划在下一个规格说明中定义暗色令牌。

---

## 🤝 贡献指南

### 提交代码

1. 从 `main` 分支创建功能分支
2. 遵循命名约定: `feat/`, `fix/`, `docs/`
3. 编写测试并确保通过
4. 运行 lint 和格式化检查
5. 提交 Pull Request

### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 遵循 ESLint 规则

---

## 📞 获取帮助

- **问题跟踪**: GitHub Issues
- **讨论**: GitHub Discussions
- **文档**: 查看 `specs/` 目录

---

**快速开始指南版本**: 1.0.0  
**最后更新**: 2025-10-15  
**维护者**: Ivan HappyWoods Team

✨ 祝编码愉快！
