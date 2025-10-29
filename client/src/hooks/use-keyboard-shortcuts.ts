"use client";

import { useEffect, useCallback } from 'react';

/**
 * 键盘快捷键配置
 */
export interface KeyboardShortcut {
  /** 快捷键标识 */
  key: string;
  /** 是否需要 Ctrl/Cmd */
  ctrlOrCmd?: boolean;
  /** 是否需要 Shift */
  shift?: boolean;
  /** 是否需要 Alt */
  alt?: boolean;
  /** 回调函数 */
  handler: () => void;
  /** 描述 */
  description?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 检测是否为 Mac
 */
const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

/**
 * 键盘快捷键 Hook
 * 
 * 提供全局键盘快捷键管理
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: 'k',
 *     ctrlOrCmd: true,
 *     handler: () => openCommandMenu(),
 *     description: '打开命令菜单'
 *   },
 *   {
 *     key: 'Escape',
 *     handler: () => closeDialog(),
 *     description: '关闭对话框'
 *   }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 忽略输入框中的快捷键（除了 Escape）
      const target = event.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.isContentEditable;

      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;

        // Escape 键总是响应
        const shouldIgnoreInput = shortcut.key !== 'Escape' && isInput;
        if (shouldIgnoreInput) continue;

        // 检查按键匹配
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlOrCmdMatch = !shortcut.ctrlOrCmd || (isMac ? event.metaKey : event.ctrlKey);
        const shiftMatch = !shortcut.shift || event.shiftKey;
        const altMatch = !shortcut.alt || event.altKey;

        if (keyMatch && ctrlOrCmdMatch && shiftMatch && altMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * 格式化快捷键显示
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlOrCmd) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push('Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(isMac ? '' : '+');
}
