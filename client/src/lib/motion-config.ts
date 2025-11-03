/**
 * Motion Configuration Library
 * Comprehensive animation presets for Ivan_HappyWoods Design System
 *
 * Learned from Suna/Kortix - expanded from 4 to 20+ animation variants
 * All animations respect `prefers-reduced-motion` for accessibility
 */

import { Variants, Transition } from "framer-motion";

// ============================================================================
// Utility: Check User Preference
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// ============================================================================
// Animation Constants
// ============================================================================

/**
 * Animation durations (matches CSS design tokens)
 */
export const duration = {
  fast: 0.15, // 150ms - quick interactions
  normal: 0.2, // 200ms - standard transitions
  slow: 0.25, // 250ms - smooth transitions
  verySlow: 0.4, // 400ms - page transitions
} as const;

/**
 * Easing functions
 */
export const easing = {
  // Standard CSS easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom easings
  smooth: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],

  // Spring presets
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

  springBouncy: {
    type: "spring",
    stiffness: 500,
    damping: 15,
  } as Transition,
} as const;

// ============================================================================
// Core Animation Variants
// ============================================================================

/**
 * Fade In/Out - Simple opacity transitions
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

export const fadeOut: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 0,
    transition: {
      duration: duration.normal,
    },
  },
};

/**
 * Slide Up/Down - Vertical slide with fade
 */
export const slideUp: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

export const slideDown: Variants = {
  initial: {
    y: -20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Scale In/Out - Zoom effect with 3D rotation
 */
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
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    rotateX: -10,
    transition: {
      duration: duration.fast,
    },
  },
};

export const scaleOut: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

// ============================================================================
// Directional Animations
// ============================================================================

/**
 * Enter from Left/Right - Horizontal slide
 */
export const enterFromLeft: Variants = {
  initial: {
    x: -200,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: -200,
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

export const enterFromRight: Variants = {
  initial: {
    x: 200,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: 200,
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

export const exitToLeft: Variants = {
  initial: { x: 0, opacity: 1 },
  animate: {
    x: -200,
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

export const exitToRight: Variants = {
  initial: { x: 0, opacity: 1 },
  animate: {
    x: 200,
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

// ============================================================================
// Component-Specific Animations
// ============================================================================

/**
 * Button Hover/Tap - Spring-based scale
 */
export const buttonHover: Variants = {
  hover: {
    scale: 1.05,
    transition: easing.spring,
  },
  tap: {
    scale: 0.95,
  },
};

/**
 * Card Hover - Lift effect with shadow
 */
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

/**
 * Logo Glow - Breathing animation for logo
 */
export const logoGlow: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

// ============================================================================
// List & Stagger Animations
// ============================================================================

/**
 * Stagger Container - For parent of staggered items
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/**
 * Stagger Item - For children in staggered list
 */
export const staggerItem: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

// ============================================================================
// Page Transitions
// ============================================================================

/**
 * Page Transition - For route changes
 */
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
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.normal,
    },
  },
};

/**
 * Slide Page - For sliding page transitions
 */
export const slidePage: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: {
      duration: duration.verySlow,
      ease: easing.easeInOut,
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: duration.verySlow,
      ease: easing.easeInOut,
    },
  },
};

// ============================================================================
// Special Effects
// ============================================================================

/**
 * Pulse - Attention-grabbing pulse effect
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Shake - Error or notification shake
 */
export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Bounce - Playful bounce effect
 */
export const bounce: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

// ============================================================================
// Utility: Responsive Variants with Reduced Motion Support
// ============================================================================

/**
 * Get animation variants with reduced-motion fallback
 * If user prefers reduced motion, returns simplified variants
 */
export const getResponsiveVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    // Simplified animation - fade only
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  return variants;
};

/**
 * Create motion variant with fallback
 * @deprecated Use getResponsiveVariants instead
 */
export const createMotionVariant = (animatedVariant: any, staticVariant: any = {}) => {
  return prefersReducedMotion() ? staticVariant : animatedVariant;
};

// ============================================================================
// Notion AI 风格动画预设
// ============================================================================

/**
 * Notion Fade In - 淡入 + 轻微上移
 * Notion 特有的优雅入场动画
 */
export const notionFadeIn: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Notion Pulse - AI 加载脉冲动画
 * 用于 AI 思考状态
 */
export const notionPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Notion Slide - 侧边栏滑动动画
 * 用于侧边栏展开/收起
 */
export const notionSlide: Variants = {
  closed: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeInOut,
    },
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

/**
 * Message Appear - 消息出现动画
 * 模拟 Notion AI 消息渐显效果
 */
export const messageAppear: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: [0.16, 1, 0.3, 1], // Notion 特有的缓动曲线
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Notion Shimmer - 加载闪烁效果
 * 用于内容加载状态
 */
export const notionShimmer: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Floating - 浮动动画
 * 用于输入框等浮动元素
 */
export const floating: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Backdrop Blur In - 背景模糊入场
 * 用于模态框和浮层
 */
export const backdropBlurIn: Variants = {
  initial: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  animate: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Smooth Expand - 平滑展开
 * 用于下拉菜单、折叠面板
 */
export const smoothExpand: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeInOut,
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

/**
 * AI Thinking - AI 思考动画
 * 三个点的跳动效果
 */
export const aiThinking = {
  dot1: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easing.easeInOut,
        delay: 0,
      },
    },
  },
  dot2: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easing.easeInOut,
        delay: 0.2,
      },
    },
  },
  dot3: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easing.easeInOut,
        delay: 0.4,
      },
    },
  },
} as const;

/**
 * Notion 风格的交错动画容器
 * 用于消息列表
 */
export const notionStaggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

/**
 * Notion 风格的交错项目
 * 配合 notionStaggerContainer 使用
 */
export const notionStaggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ============================================================================
// Notion 风格响应式动画工具
// ============================================================================

/**
 * 获取 Notion 风格的响应式动画变体
 * 自动处理 reduced-motion
 */
export const getNotionVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: 0.15 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.1 },
      },
    };
  }
  return variants;
};
