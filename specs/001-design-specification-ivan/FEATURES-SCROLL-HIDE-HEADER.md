# 滚动隐藏顶部工具栏功能

**实施日期**: 2025年10月16日  
**功能**: 自动隐藏顶部工具栏以最大化内容显示空间

---

## 🎯 功能说明

在 AI 对话页面向下滚动时，顶部工具栏会自动隐藏，为对话内容提供更大的显示空间。这是 Notion 等现代应用常见的 UX 模式。

---

## ✨ 交互逻辑

### 1. **自动显示**
- 页面顶部（滚动距离 < 10px）
- 向上滚动时
- 页面加载时

### 2. **自动隐藏**
- 向下滚动超过 100px 时

### 3. **动画效果**
- 使用 Notion 风格的缓动曲线 `[0.16, 1, 0.3, 1]`
- 300ms 平滑过渡
- 同时调整 Y 轴位移和透明度

---

## 🔧 技术实现

### 核心代码

```tsx
// 滚动监听
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = scrollContainer.scrollTop;
    
    if (currentScrollY < 10) {
      setHeaderVisible(true);          // 顶部始终显示
    } else if (currentScrollY < lastScrollY) {
      setHeaderVisible(true);          // 向上滚动显示
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setHeaderVisible(false);         // 向下滚动隐藏
    }
    
    setLastScrollY(currentScrollY);
  };
  
  scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
}, [lastScrollY]);
```

### 动画实现

```tsx
<motion.div
  animate={{ 
    y: headerVisible ? 0 : -100,
    opacity: headerVisible ? 1 : 0
  }}
  transition={{ 
    duration: 0.3,
    ease: [0.16, 1, 0.3, 1]
  }}
  className="absolute top-0 ..."
>
  {/* 工具栏内容 */}
</motion.div>
```

### 内容区域调整

```tsx
<div 
  ref={scrollContainerRef}
  className="flex-1 overflow-y-auto"
  style={{
    paddingTop: headerVisible ? '72px' : '0px',
    transition: 'padding-top 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  }}
>
  {children}
</div>
```

---

## 📊 用户体验优势

1. **更大的内容显示空间** - 隐藏工具栏后，对话内容获得额外的 72px 垂直空间
2. **沉浸式阅读** - 减少视觉干扰，专注于对话内容
3. **智能交互** - 向上滚动即可快速访问工具栏
4. **流畅动画** - 平滑的过渡效果，不会突兀

---

## 🎨 视觉特性

- **位移动画**: Y 轴从 0 移动到 -100px
- **透明度**: 从 1 淡出到 0
- **缓动曲线**: Notion 特有的 `[0.16, 1, 0.3, 1]`
- **过渡时间**: 300ms
- **性能优化**: 使用 `passive: true` 监听器

---

## 📱 响应式行为

- **桌面端**: 完整的隐藏/显示动画
- **平板端**: 相同的行为
- **移动端**: 相同的行为（更重要，因为屏幕空间有限）

---

## 🔄 可配置选项

如果需要调整行为，可以修改以下参数：

```tsx
// 滚动阈值（隐藏前需要滚动的距离）
const HIDE_THRESHOLD = 100; // px

// 显示阈值（接近顶部多少距离始终显示）
const SHOW_THRESHOLD = 10; // px

// 动画持续时间
const ANIMATION_DURATION = 0.3; // 秒

// 缓动曲线
const EASING = [0.16, 1, 0.3, 1];
```

---

## ✅ 测试场景

- [x] 页面加载时工具栏可见
- [x] 向下滚动超过 100px 后工具栏隐藏
- [x] 向上滚动时工具栏重新显示
- [x] 滚动到顶部时工具栏始终可见
- [x] 动画流畅，无卡顿
- [x] 内容不会跳动（padding 同步调整）
- [x] 侧边栏切换按钮始终可用

---

## 🚀 使用体验

### 典型流程

1. **进入 AI 页面** → 工具栏可见
2. **开始对话** → 工具栏可见
3. **向下滚动查看历史消息** → 工具栏自动隐藏
4. **继续向下滚动** → 工具栏保持隐藏
5. **需要切换侧边栏** → 向上滚动一点，工具栏立即显示
6. **滚动到顶部** → 工具栏始终可见

---

## 🎯 最佳实践

1. **设置合理的阈值** - 100px 是经验值，避免误触发
2. **流畅的动画** - 300ms 足够快又不会太突兀
3. **同步调整 padding** - 避免内容跳动
4. **保持可访问性** - 向上滚动即可快速访问

---

## 📝 相关文件

- `client/src/components/ai/ai-layout.tsx` - 主要实现
- `client/src/lib/motion-config.ts` - 动画配置

---

**状态**: ✅ 已实现并测试  
**兼容性**: 所有现代浏览器  
**性能**: 优秀（使用 passive 监听器）

