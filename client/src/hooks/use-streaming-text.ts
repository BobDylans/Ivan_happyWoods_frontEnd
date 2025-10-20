import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseStreamingTextOptions {
  /** 打字速度（毫秒/字符） */
  speed?: number;
  /** 是否立即开始 */
  autoStart?: boolean;
  /** 完成回调 */
  onComplete?: () => void;
  /** 是否启用（支持 reduced-motion） */
  enabled?: boolean;
}

export interface UseStreamingTextReturn {
  /** 当前显示的文本 */
  displayedText: string;
  /** 是否正在打字 */
  isTyping: boolean;
  /** 是否完成 */
  isComplete: boolean;
  /** 开始打字 */
  start: () => void;
  /** 暂停打字 */
  pause: () => void;
  /** 跳过动画，直接显示全部 */
  skip: () => void;
  /** 重置 */
  reset: () => void;
}

/**
 * 流式打字机动画 Hook
 * 
 * 支持：
 * - 可配置的打字速度
 * - 暂停/继续/跳过
 * - 支持 prefers-reduced-motion
 * - 性能优化（requestAnimationFrame）
 * 
 * @example
 * ```tsx
 * const { displayedText, isTyping } = useStreamingText({
 *   text: "Hello, World!",
 *   speed: 30,
 * });
 * ```
 */
export function useStreamingText(
  text: string,
  options: UseStreamingTextOptions = {}
): UseStreamingTextReturn {
  const {
    speed = 30,
    autoStart = true,
    onComplete,
    enabled = true,
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const indexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const isPausedRef = useRef(false);

  // 检查是否启用动画
  const shouldAnimate = enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cleanup = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const typeNextChar = useCallback((timestamp: number) => {
    if (isPausedRef.current) return;

    // 节流控制
    if (timestamp - lastUpdateRef.current < speed) {
      animationFrameRef.current = requestAnimationFrame(typeNextChar);
      return;
    }

    lastUpdateRef.current = timestamp;

    if (indexRef.current < text.length) {
      indexRef.current++;
      setDisplayedText(text.slice(0, indexRef.current));
      animationFrameRef.current = requestAnimationFrame(typeNextChar);
    } else {
      setIsTyping(false);
      setIsComplete(true);
      onComplete?.();
      cleanup();
    }
  }, [text, speed, onComplete, cleanup]);

  const start = useCallback(() => {
    if (isComplete) return;
    
    isPausedRef.current = false;
    setIsTyping(true);
    
    if (shouldAnimate) {
      lastUpdateRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(typeNextChar);
    } else {
      // 如果禁用动画，直接显示全部
      indexRef.current = text.length;
      setDisplayedText(text);
      setIsTyping(false);
      setIsComplete(true);
      onComplete?.();
    }
  }, [text, shouldAnimate, typeNextChar, isComplete, onComplete]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsTyping(false);
    cleanup();
  }, [cleanup]);

  const skip = useCallback(() => {
    indexRef.current = text.length;
    setDisplayedText(text);
    setIsTyping(false);
    setIsComplete(true);
    cleanup();
    onComplete?.();
  }, [text, cleanup, onComplete]);

  const reset = useCallback(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(false);
    setIsComplete(false);
    isPausedRef.current = false;
    cleanup();
  }, [cleanup]);

  // 自动开始
  useEffect(() => {
    if (autoStart && text && !isComplete) {
      start();
    }

    return cleanup;
  }, [text, autoStart, start, cleanup, isComplete]);

  // 文本变化时重置
  useEffect(() => {
    reset();
    if (autoStart) {
      start();
    }
  }, [text]); // 仅依赖 text

  return {
    displayedText,
    isTyping,
    isComplete,
    start,
    pause,
    skip,
    reset,
  };
}

