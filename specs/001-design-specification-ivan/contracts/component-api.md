# Component API Contracts - Ivan_HappyWoods Design System

**Created**: 2025-10-15  
**Feature**: 001-design-specification-ivan  
**Purpose**: 定义所有设计系统组件的公共 API 契约，确保一致性和可预测性

---

## 契约原则

1. **向后兼容**: 新增属性必须可选，不得破坏现有接口
2. **类型安全**: 所有 Props 必须有完整的 TypeScript 类型定义
3. **无障碍优先**: 所有组件必须支持 ARIA 属性和键盘导航
4. **可组合**: 组件应支持 `asChild` 模式或组合模式
5. **受控/非受控**: 表单组件支持两种模式

---

## 通用契约

所有组件共享的基础接口。

### BaseComponentProps

```typescript
/**
 * 所有设计系统组件的基础属性
 */
export interface BaseComponentProps {
  /**
   * 额外的 CSS 类名
   */
  className?: string
  
  /**
   * 内联样式（谨慎使用）
   */
  style?: React.CSSProperties
  
  /**
   * 测试 ID，用于自动化测试
   */
  'data-testid'?: string
  
  /**
   * 无障碍访问标签
   */
  'aria-label'?: string
  
  /**
   * 无障碍访问描述
   */
  'aria-describedby'?: string
}
```

### InteractiveComponentProps

```typescript
/**
 * 可交互组件的基础属性
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  /**
   * 是否禁用
   */
  disabled?: boolean
  
  /**
   * 加载状态
   */
  isLoading?: boolean
  
  /**
   * 点击事件处理器
   */
  onClick?: (event: React.MouseEvent) => void
  
  /**
   * 键盘事件处理器
   */
  onKeyDown?: (event: React.KeyboardEvent) => void
  
  /**
   * 焦点事件处理器
   */
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
}
```

---

## Button 组件契约

### Interface Definition

```typescript
/**
 * Button 组件属性
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="default" onClick={handleClick}>
 *   点击我
 * </Button>
 * ```
 */
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
          InteractiveComponentProps {
  /**
   * 按钮变体
   * - primary: 主要操作按钮，琥珀色背景
   * - secondary: 次要操作按钮，透明背景带边框
   * - text: 文本按钮，仅文字无背景
   * 
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'text'
  
  /**
   * 按钮尺寸
   * 
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'icon'
  
  /**
   * 加载状态，显示加载指示器
   * 
   * @default false
   */
  isLoading?: boolean
  
  /**
   * 左侧图标
   */
  leftIcon?: React.ReactNode
  
  /**
   * 右侧图标
   */
  rightIcon?: React.ReactNode
  
  /**
   * Radix UI Slot 模式支持
   * 允许将按钮样式应用到子元素
   * 
   * @default false
   */
  asChild?: boolean
}
```

### Behavioral Contract

```typescript
/**
 * Button 组件行为契约
 */
export const ButtonContract = {
  /**
   * 视觉反馈时间要求
   */
  interaction: {
    hoverDelay: 0,           // 立即响应
    hoverDuration: 150,      // 150ms 过渡
    tapScale: 0.98,          // 点击时缩放到 98%
    feedbackTime: 100,       // 100ms 内提供视觉反馈
  },
  
  /**
   * 动画参数
   */
  animation: {
    scale: {
      rest: 1,
      hover: 1.05,
      tap: 0.98,
    },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  
  /**
   * 无障碍访问要求
   */
  accessibility: {
    role: 'button',
    tabIndex: 0,
    supportsKeyboard: true,    // Enter 和 Space 键触发
    ariaDisabled: true,        // disabled 时设置 aria-disabled
  },
  
  /**
   * 状态要求
   */
  states: ['default', 'hover', 'active', 'focus', 'disabled', 'loading'] as const,
}
```

### Usage Examples

```tsx
// 基础用法
<Button>保存</Button>

// 带图标
<Button leftIcon={<SaveIcon />}>保存</Button>

// 加载状态
<Button isLoading>保存中...</Button>

// 次要按钮
<Button variant="secondary">取消</Button>

// 作为链接
<Button asChild>
  <Link href="/dashboard">前往仪表板</Link>
</Button>
```

---

## Input 组件契约

### Interface Definition

```typescript
/**
 * Input 组件属性
 * 
 * @example
 * ```tsx
 * <Input 
 *   placeholder="请输入用户名" 
 *   error="用户名不能为空"
 *   leftIcon={<UserIcon />}
 * />
 * ```
 */
export interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement>,
          Omit<InteractiveComponentProps, 'onClick'> {
  /**
   * 输入框尺寸
   * 
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg'
  
  /**
   * 错误消息，非空时显示错误状态
   */
  error?: string
  
  /**
   * 成功状态
   * 
   * @default false
   */
  success?: boolean
  
  /**
   * 左侧图标
   */
  leftIcon?: React.ReactNode
  
  /**
   * 右侧图标
   */
  rightIcon?: React.ReactNode
  
  /**
   * 辅助文本
   */
  helperText?: string
  
  /**
   * 受控模式的值
   */
  value?: string
  
  /**
   * 非受控模式的默认值
   */
  defaultValue?: string
  
  /**
   * 值变化回调
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
```

### Behavioral Contract

```typescript
/**
 * Input 组件行为契约
 */
export const InputContract = {
  /**
   * 视觉反馈时间要求
   */
  interaction: {
    focusTransition: 200,    // 焦点边框过渡 200ms
    errorDisplay: 0,         // 错误立即显示
    feedbackTime: 100,       // 100ms 内提供视觉反馈
  },
  
  /**
   * 焦点状态
   */
  focus: {
    borderColor: '#E4B16B',  // 琥珀色
    borderWidth: '1px',
    glowEffect: true,        // 焦点时发光效果
  },
  
  /**
   * 无障碍访问要求
   */
  accessibility: {
    role: 'textbox',
    ariaInvalid: true,       // error 时设置 aria-invalid
    ariaDescribedby: true,   // error/helperText 时关联描述
  },
  
  /**
   * 状态要求
   */
  states: ['default', 'focus', 'error', 'success', 'disabled'] as const,
}
```

---

## Card 组件契约

### Interface Definition

```typescript
/**
 * Card 组件属性
 * 
 * @example
 * ```tsx
 * <Card interactive padding="default">
 *   <CardHeader>标题</CardHeader>
 *   <CardContent>内容</CardContent>
 * </Card>
 * ```
 */
export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
          BaseComponentProps {
  /**
   * 卡片变体
   * - default: 白色背景带阴影
   * - elevated: 更深的阴影
   * - outlined: 仅边框无阴影
   * 
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'outlined'
  
  /**
   * 是否可交互（悬停效果）
   * 
   * @default false
   */
  interactive?: boolean
  
  /**
   * 内边距尺寸
   * 
   * @default 'default'
   */
  padding?: 'none' | 'sm' | 'default' | 'lg'
  
  /**
   * 子组件
   */
  children: React.ReactNode
}
```

### Behavioral Contract

```typescript
/**
 * Card 组件行为契约
 */
export const CardContract = {
  /**
   * 交互动画（仅当 interactive=true）
   */
  interaction: {
    hoverLift: 3,            // 悬停时向上 3px
    hoverDuration: 250,      // 250ms 过渡
    shadowDeepen: true,      // 悬停时阴影加深
  },
  
  /**
   * 动画参数
   */
  animation: {
    hover: {
      y: -3,
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
  },
  
  /**
   * 无障碍访问要求
   */
  accessibility: {
    role: undefined,         // 默认无 role（语义 div）
    roleIfInteractive: 'button', // interactive=true 时为 button
  },
  
  /**
   * 状态要求
   */
  states: ['default', 'hover'] as const,
}
```

---

## Sidebar 组件契约

### Interface Definition

```typescript
/**
 * Sidebar 组件属性
 */
export interface SidebarProps extends BaseComponentProps {
  /**
   * 侧边栏宽度
   * 
   * @default '220px'
   */
  width?: string
  
  /**
   * 侧边栏位置
   * - left: 左侧（桌面默认）
   * - bottom: 底部（移动默认）
   * 
   * @default 'left'
   */
  position?: 'left' | 'bottom'
  
  /**
   * 是否可见
   * 
   * @default true
   */
  visible?: boolean
  
  /**
   * 侧边栏项目
   */
  items: SidebarItem[]
  
  /**
   * 当前激活的项目 ID
   */
  activeItemId?: string
  
  /**
   * 项目点击回调
   */
  onItemClick?: (item: SidebarItem) => void
}

/**
 * 侧边栏项目
 */
export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
}
```

### Behavioral Contract

```typescript
/**
 * Sidebar 组件行为契约
 */
export const SidebarContract = {
  /**
   * 激活指示器动画
   */
  activeIndicator: {
    height: '2px',
    color: '#E4B16B',        // 琥珀色
    transition: {
      duration: 0.2,
      ease: 'linear',
    },
  },
  
  /**
   * 项目悬停效果
   */
  itemHover: {
    scale: 1.02,
    colorFade: true,
    duration: 150,
  },
  
  /**
   * 响应式行为
   */
  responsive: {
    mobile: { position: 'bottom' },
    tablet: { position: 'left', width: '200px' },
    desktop: { position: 'left', width: '220px' },
  },
  
  /**
   * 无障碍访问要求
   */
  accessibility: {
    role: 'navigation',
    ariaLabel: '主导航',
    itemRole: 'link',
    keyboardNavigation: true,  // Arrow keys 导航
  },
}
```

---

## Header 组件契约

### Interface Definition

```typescript
/**
 * Header 组件属性
 */
export interface HeaderProps extends BaseComponentProps {
  /**
   * Logo 内容
   */
  logo?: React.ReactNode
  
  /**
   * 快速操作按钮
   */
  actions?: React.ReactNode
  
  /**
   * 搜索栏
   */
  searchBar?: React.ReactNode
  
  /**
   * 用户信息
   */
  user?: {
    name: string
    avatar?: string
    onClick?: () => void
  }
  
  /**
   * 是否显示阴影
   * 
   * @default true
   */
  showShadow?: boolean
}
```

### Behavioral Contract

```typescript
/**
 * Header 组件行为契约
 */
export const HeaderContract = {
  /**
   * 固定尺寸
   */
  dimensions: {
    height: '64px',
    bgOpacity: 0.8,
    backdropBlur: '10px',
  },
  
  /**
   * 阴影效果
   */
  shadow: {
    default: '0 2px 10px rgba(0, 0, 0, 0.03)',
  },
  
  /**
   * 无障碍访问要求
   */
  accessibility: {
    role: 'banner',
    landmark: true,
  },
}
```

---

## Logo 组件契约

### Interface Definition

```typescript
/**
 * Logo 组件属性
 */
export interface LogoProps extends BaseComponentProps {
  /**
   * Logo 尺寸
   * 
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg'
  
  /**
   * 是否显示文本
   * 
   * @default true
   */
  showText?: boolean
  
  /**
   * 是否动画效果（呼吸发光）
   * 
   * @default false
   */
  animated?: boolean
  
  /**
   * 点击回调
   */
  onClick?: () => void
}
```

### Behavioral Contract

```typescript
/**
 * Logo 组件行为契约
 */
export const LogoContract = {
  /**
   * 设计要求
   */
  design: {
    shape: 'rounded emblem',  // 圆形徽章
    colors: ['#E4B16B', '#9BC997'],  // 琥珀 + 鼠尾草绿
    style: 'flat',            // 扁平风格
  },
  
  /**
   * 动画效果（animated=true）
   */
  animation: {
    type: 'breathing glow',   // 呼吸发光
    duration: 2000,           // 2秒循环
    ease: 'ease-in-out',
  },
  
  /**
   * 尺寸定义
   */
  sizes: {
    sm: { width: '32px', height: '32px' },
    default: { width: '48px', height: '48px' },
    lg: { width: '64px', height: '64px' },
  },
}
```

---

## Modal/Dialog 组件契约

### Interface Definition

```typescript
/**
 * Modal 组件属性
 */
export interface ModalProps extends BaseComponentProps {
  /**
   * 是否打开
   */
  open: boolean
  
  /**
   * 关闭回调
   */
  onClose: () => void
  
  /**
   * 模态框标题
   */
  title?: string
  
  /**
   * 模态框内容
   */
  children: React.ReactNode
  
  /**
   * 底部操作区
   */
  footer?: React.ReactNode
  
  /**
   * 尺寸
   * 
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'full'
  
  /**
   * 点击背景是否关闭
   * 
   * @default true
   */
  closeOnBackdropClick?: boolean
  
  /**
   * 是否显示关闭按钮
   * 
   * @default true
   */
  showCloseButton?: boolean
}
```

### Behavioral Contract

```typescript
/**
 * Modal 组件行为契约
 */
export const ModalContract = {
  /**
   * 动画效果
   */
  animation: {
    fade: {
      duration: 0.3,
      ease: 'easeInOut',
    },
    backdrop: {
      blur: '10px',
      opacity: 0.5,
    },
  },
  
  /**
   * 无障碍访问要求
   */
  accessibility: {
    role: 'dialog',
    ariaModal: true,
    ariaLabelledby: 'modal-title',
    ariaDescribedby: 'modal-description',
    trapFocus: true,          // 焦点陷阱
    restoreFocus: true,       // 关闭后恢复焦点
    closeOnEscape: true,      // ESC 键关闭
  },
  
  /**
   * Z-index 层级
   */
  zIndex: {
    backdrop: 1000,
    content: 1001,
  },
}
```

---

## 契约测试规范

### 契约测试要求

所有组件必须通过以下契约测试：

```typescript
// tests/contract/component-contracts.test.ts
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button, ButtonContract } from '@/components/ui/button'

describe('Button Contract', () => {
  it('should meet interaction timing requirements', async () => {
    const { rerender } = render(<Button>Test</Button>)
    const startTime = performance.now()
    
    // 模拟悬停
    // ... 测试代码
    
    const feedbackTime = performance.now() - startTime
    expect(feedbackTime).toBeLessThan(ButtonContract.interaction.feedbackTime)
  })
  
  it('should support required accessibility features', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('role', ButtonContract.accessibility.role)
    expect(button).toHaveAttribute('tabindex', String(ButtonContract.accessibility.tabIndex))
  })
  
  it('should implement all required states', () => {
    const states = ButtonContract.states
    expect(states).toContain('default')
    expect(states).toContain('hover')
    expect(states).toContain('disabled')
    // ... 其他状态
  })
})
```

---

## 版本控制

### 契约版本

**Current Version**: 1.0.0  
**Last Updated**: 2025-10-15  
**Breaking Changes**: None

### 变更日志

#### v1.0.0 (2025-10-15)
- 初始契约定义
- Button, Input, Card, Sidebar, Header, Logo, Modal 组件
- 基础和交互组件属性定义
- 行为契约规范

---

**契约状态**: ✅ 完成  
**下一步**: 创建设计令牌 JSON 和快速开始指南
