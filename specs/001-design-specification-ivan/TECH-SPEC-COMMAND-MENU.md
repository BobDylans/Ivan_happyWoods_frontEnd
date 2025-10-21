# 🎯 命令菜单 (Command Menu) 技术方案

**功能编号**: TASK-404  
**优先级**: P1  
**预计工时**: 4 小时  
**负责人**: Ivan  
**创建日期**: 2025-10-21  
**状态**: 📝 设计阶段

---

## 📖 目录

- [1. 功能概述](#1-功能概述)
- [2. 技术架构](#2-技术架构)
- [3. 详细设计](#3-详细设计)
- [4. 实现步骤](#4-实现步骤)
- [5. 测试方案](#5-测试方案)
- [6. 风险评估](#6-风险评估)

---

## 1. 功能概述

### 1.1 产品定位

命令菜单是一个**全局快捷操作面板**，类似于：
- VS Code 的 Command Palette (Cmd+Shift+P)
- Notion 的快捷菜单 (Cmd+K)
- Slack 的搜索框 (Cmd+K)

### 1.2 核心功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 快捷键触发 | Cmd+K / Ctrl+K 打开菜单 | P0 |
| 模糊搜索 | 实时过滤命令列表 | P0 |
| 键盘导航 | ↑↓ Enter Esc 完整支持 | P0 |
| 会话切换 | 快速切换到任意会话 | P0 |
| 命令执行 | 新建、删除、导出等操作 | P1 |
| 命令分组 | 会话、导航、设置等分组 | P2 |
| 快捷键提示 | 显示命令的快捷键 | P2 |

### 1.3 用户流程

```
用户按下 Cmd+K
    ↓
弹出命令菜单（输入框自动聚焦）
    ↓
输入搜索词 / 使用 ↑↓ 导航
    ↓
按 Enter 执行命令
    ↓
菜单关闭，执行相应操作
```

---

## 2. 技术架构

### 2.1 组件架构图

```
┌─────────────────────────────────────────┐
│         CommandMenu (容器组件)          │
│  - 状态管理                              │
│  - 快捷键监听                            │
│  - 命令过滤                              │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴───────────┬──────────────┐
    │                      │              │
┌───▼────────┐  ┌─────────▼──────┐  ┌───▼─────────┐
│  Backdrop  │  │  SearchInput   │  │ CommandList │
│  (背景遮罩) │  │  (搜索输入框)  │  │ (命令列表)  │
└────────────┘  └────────────────┘  └──────┬──────┘
                                            │
                                    ┌───────▼────────┐
                                    │  CommandItem   │
                                    │  (单个命令项)  │
                                    └────────────────┘
```

### 2.2 数据流架构

```
┌─────────────┐
│  用户输入    │ (Cmd+K, 搜索, ↑↓, Enter)
└──────┬──────┘
       ↓
┌──────────────────┐
│  CommandMenu     │ (React State)
│  - isOpen        │
│  - searchQuery   │
│  - selectedIndex │
└──────┬───────────┘
       ↓
┌──────────────────┐
│  Filter Logic    │ (模糊搜索算法)
└──────┬───────────┘
       ↓
┌──────────────────┐
│  Filtered List   │ (过滤后的命令)
└──────┬───────────┘
       ↓
┌──────────────────┐
│  UI Render       │ (渲染命令列表)
└──────┬───────────┘
       ↓
┌──────────────────┐
│  Execute Action  │ (执行命令操作)
└──────────────────┘
```

### 2.3 状态管理

使用 **React Local State** + **Zustand Store**：

```typescript
// 本地状态（组件内部）
const [isOpen, setIsOpen] = useState(false);        // 菜单是否打开
const [searchQuery, setSearchQuery] = useState(''); // 搜索关键词
const [selectedIndex, setSelectedIndex] = useState(0); // 当前选中索引

// 全局状态（Zustand）
const { 
  sessions,        // 会话列表
  currentSessionId, // 当前会话 ID
  createSession,   // 新建会话
  switchSession,   // 切换会话
  deleteSession    // 删除会话
} = useAIStore();
```

---

## 3. 详细设计

### 3.1 数据结构设计

#### 3.1.1 Command 接口

```typescript
/**
 * 命令数据结构
 */
interface Command {
  id: string;              // 唯一标识，如 "new-chat", "switch-session-xxx"
  label: string;           // 显示名称，如 "新建对话"
  description?: string;    // 描述信息，如 "创建一个新的对话会话"
  icon?: React.ReactNode;  // 图标组件
  shortcut?: string;       // 快捷键显示，如 "Ctrl+N"
  keywords?: string[];     // 搜索关键词，如 ["新建", "创建", "new"]
  action: () => void;      // 执行函数
  group?: CommandGroup;    // 分组
  disabled?: boolean;      // 是否禁用
}

/**
 * 命令分组
 */
enum CommandGroup {
  SESSION = 'session',     // 会话管理
  NAVIGATION = 'navigation', // 导航
  SETTINGS = 'settings',   // 设置
  ACTIONS = 'actions'      // 操作
}
```

#### 3.1.2 命令列表定义

```typescript
/**
 * 静态命令列表
 */
const staticCommands: Command[] = [
  // 会话管理
  {
    id: 'new-chat',
    label: '新建对话',
    description: '创建一个新的对话会话',
    icon: <PlusCircle className="w-4 h-4" />,
    shortcut: 'Ctrl+N',
    keywords: ['新建', '创建', 'new', 'create'],
    action: () => createSession(),
    group: CommandGroup.SESSION,
  },
  {
    id: 'delete-current',
    label: '删除当前会话',
    description: '删除正在查看的会话',
    icon: <Trash2 className="w-4 h-4" />,
    keywords: ['删除', 'delete', 'remove'],
    action: () => deleteCurrentSession(),
    group: CommandGroup.SESSION,
  },
  
  // 导出功能
  {
    id: 'export-chat',
    label: '导出对话',
    description: '导出当前会话为 Markdown',
    icon: <Download className="w-4 h-4" />,
    keywords: ['导出', 'export', 'download'],
    action: () => exportCurrentChat(),
    group: CommandGroup.ACTIONS,
  },
  
  // 主题切换
  {
    id: 'toggle-theme',
    label: '切换主题',
    description: '在浅色和深色模式之间切换',
    icon: <Moon className="w-4 h-4" />,
    shortcut: 'Ctrl+T',
    keywords: ['主题', '深色', '浅色', 'theme', 'dark', 'light'],
    action: () => toggleTheme(),
    group: CommandGroup.SETTINGS,
  },
];

/**
 * 动态命令列表（会话列表）
 */
const sessionCommands: Command[] = sessions.map(session => ({
  id: `session-${session.id}`,
  label: session.title || '未命名会话',
  description: `${session.messageCount} 条消息`,
  icon: <MessageSquare className="w-4 h-4" />,
  keywords: [session.title, 'session', 'chat'],
  action: () => switchSession(session.id),
  group: CommandGroup.SESSION,
}));

/**
 * 完整命令列表
 */
const allCommands = [...staticCommands, ...sessionCommands];
```

### 3.2 算法设计

#### 3.2.1 模糊搜索算法

**方案 A: 简单字符串匹配**（推荐，满足需求）

```typescript
/**
 * 简单模糊搜索
 * - 不区分大小写
 * - 匹配 label、description、keywords
 * - 支持拼音首字母（可选）
 */
function filterCommands(query: string, commands: Command[]): Command[] {
  if (!query.trim()) return commands;
  
  const lowerQuery = query.toLowerCase().trim();
  
  return commands.filter(cmd => {
    // 匹配标签
    if (cmd.label.toLowerCase().includes(lowerQuery)) return true;
    
    // 匹配描述
    if (cmd.description?.toLowerCase().includes(lowerQuery)) return true;
    
    // 匹配关键词
    if (cmd.keywords?.some(k => k.toLowerCase().includes(lowerQuery))) return true;
    
    return false;
  });
}
```

**方案 B: Fuse.js 模糊搜索**（更智能，可选）

```typescript
import Fuse from 'fuse.js';

const fuse = new Fuse(commands, {
  keys: ['label', 'description', 'keywords'],
  threshold: 0.4,        // 0-1，越小越严格
  minMatchCharLength: 2, // 最小匹配长度
});

const results = fuse.search(query);
const filteredCommands = results.map(r => r.item);
```

**选择**: 先用方案 A，如果效果不好再考虑方案 B

#### 3.2.2 键盘导航算法

```typescript
/**
 * 键盘导航逻辑
 */
function handleKeyDown(e: KeyboardEvent) {
  const filteredLength = filteredCommands.length;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < filteredLength - 1 ? prev + 1 : 0
      );
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev > 0 ? prev - 1 : filteredLength - 1
      );
      break;
      
    case 'Enter':
      e.preventDefault();
      const selectedCommand = filteredCommands[selectedIndex];
      if (selectedCommand && !selectedCommand.disabled) {
        selectedCommand.action();
        setIsOpen(false);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      setIsOpen(false);
      break;
  }
}
```

### 3.3 UI 设计规范

#### 3.3.1 布局尺寸

```css
/* 命令菜单容器 */
.command-menu {
  width: 640px;           /* 宽度 */
  max-height: 480px;      /* 最大高度 */
  border-radius: 12px;    /* 圆角 */
  margin-top: 20vh;       /* 距离顶部 */
}

/* 搜索输入框 */
.search-input {
  height: 48px;           /* 高度 */
  padding: 0 16px;        /* 水平内边距 */
  font-size: 14px;        /* 字体大小 */
}

/* 命令项 */
.command-item {
  height: 48px;           /* 高度 */
  padding: 0 16px;        /* 水平内边距 */
  gap: 12px;              /* 图标和文字间距 */
}
```

#### 3.3.2 颜色规范

```css
/* 背景遮罩 */
background: rgba(0, 0, 0, 0.5);  /* 50% 透明黑色 */

/* 菜单背景 */
background: var(--surface-elevated);
border: 1px solid var(--border-subtle);

/* 输入框 */
background: var(--surface-base);
color: var(--text-primary);

/* 命令项 - 默认 */
color: var(--text-primary);

/* 命令项 - 悬停/选中 */
background: var(--interactive-primary)/10;
color: var(--interactive-primary);

/* 命令项 - 禁用 */
color: var(--text-disabled);
opacity: 0.5;
```

#### 3.3.3 动画规范

```typescript
// Framer Motion 动画配置
const backdropAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const menuAnimation = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
  transition: { 
    duration: 0.2,
    ease: [0.16, 1, 0.3, 1] // spring 缓动
  }
};
```

### 3.4 交互设计

#### 3.4.1 打开菜单

**触发方式**：
1. 键盘快捷键: `Cmd+K` / `Ctrl+K`
2. 点击顶部搜索按钮（可选）

**行为**：
- 弹出菜单
- 输入框自动聚焦
- 选中索引重置为 0
- 搜索词清空

#### 3.4.2 关闭菜单

**触发方式**：
1. 按 `Esc` 键
2. 点击背景遮罩
3. 执行命令后自动关闭

**行为**：
- 菜单消失（淡出动画）
- 移除键盘监听
- 清空搜索状态

#### 3.4.3 搜索过滤

**触发**：输入框内容变化

**行为**：
- 实时过滤命令列表
- 重置选中索引为 0
- 无结果时显示空状态

#### 3.4.4 命令执行

**触发方式**：
1. 按 `Enter` 键
2. 点击命令项

**行为**：
- 执行 `command.action()`
- 关闭菜单
- 显示操作反馈（可选）

---

## 4. 实现步骤

### Phase 1: 基础框架（1 小时）

#### Step 1.1: 创建组件文件
```bash
client/src/components/ai/command-menu.tsx
```

#### Step 1.2: 实现基础结构
- [ ] 创建 CommandMenu 组件
- [ ] 添加背景遮罩
- [ ] 添加搜索输入框
- [ ] 添加命令列表容器

#### Step 1.3: 实现打开/关闭逻辑
- [ ] 添加 isOpen 状态
- [ ] 实现 Cmd+K 监听
- [ ] 实现 Esc 关闭
- [ ] 实现背景点击关闭

**验收标准**：
- ✅ Cmd+K 能打开菜单
- ✅ Esc 能关闭菜单
- ✅ 点击背景能关闭

---

### Phase 2: 命令系统（1.5 小时）

#### Step 2.1: 定义数据结构
- [ ] 创建 Command 接口
- [ ] 创建 CommandGroup 枚举

#### Step 2.2: 实现静态命令
- [ ] 新建对话
- [ ] 删除会话
- [ ] 导出对话
- [ ] 切换主题

#### Step 2.3: 实现动态命令（会话列表）
- [ ] 从 Zustand Store 获取会话
- [ ] 生成会话命令列表
- [ ] 合并静态和动态命令

#### Step 2.4: 实现搜索过滤
- [ ] 编写 filterCommands 函数
- [ ] 绑定搜索输入框
- [ ] 处理空结果状态

**验收标准**：
- ✅ 显示所有命令
- ✅ 输入搜索词能过滤
- ✅ 会话列表正确显示

---

### Phase 3: 键盘导航（1 小时）

#### Step 3.1: 实现选中状态
- [ ] 添加 selectedIndex 状态
- [ ] 高亮当前选中项

#### Step 3.2: 实现键盘监听
- [ ] ↑ 向上导航
- [ ] ↓ 向下导航
- [ ] Enter 执行命令
- [ ] 循环导航（首尾相接）

#### Step 3.3: 优化交互
- [ ] 鼠标悬停更新选中
- [ ] 键盘导航时滚动视图

**验收标准**：
- ✅ ↑↓ 能选择命令
- ✅ Enter 能执行
- ✅ 选中项有高亮

---

### Phase 4: 视觉优化（30 分钟）

#### Step 4.1: 添加动画
- [ ] 背景淡入淡出
- [ ] 菜单滑入滑出
- [ ] 命令项悬停效果

#### Step 4.2: 完善样式
- [ ] 图标显示
- [ ] 快捷键提示
- [ ] 分组标题（可选）
- [ ] 空状态提示

#### Step 4.3: 深色模式适配
- [ ] 测试深色模式
- [ ] 调整颜色变量

**验收标准**：
- ✅ 动画流畅
- ✅ 视觉符合设计系统
- ✅ 深色模式正常

---

### Phase 5: 集成测试（30 分钟）

#### Step 5.1: 集成到应用
- [ ] 在 layout.tsx 中引入
- [ ] 确保全局可用

#### Step 5.2: 功能测试
- [ ] 测试所有命令
- [ ] 测试边界情况
- [ ] 测试性能

#### Step 5.3: 调试优化
- [ ] 修复发现的问题
- [ ] 优化用户体验

**验收标准**：
- ✅ 所有功能正常
- ✅ 无明显 bug
- ✅ 性能良好

---

## 5. 测试方案

### 5.1 功能测试

| 测试项 | 操作 | 预期结果 |
|--------|------|----------|
| 打开菜单 | 按 Cmd+K | 菜单弹出，输入框聚焦 |
| 关闭菜单 | 按 Esc | 菜单关闭 |
| 关闭菜单 | 点击背景 | 菜单关闭 |
| 搜索过滤 | 输入 "新建" | 只显示包含"新建"的命令 |
| 键盘导航 | 按 ↓ 3次 | 选中第4个命令 |
| 执行命令 | 选中后按 Enter | 执行对应操作，菜单关闭 |
| 新建会话 | 执行 "新建对话" | 创建新会话并切换 |
| 切换会话 | 选择会话命令 | 切换到对应会话 |

### 5.2 边界测试

| 测试项 | 场景 | 预期结果 |
|--------|------|----------|
| 空结果 | 搜索不存在的内容 | 显示"无匹配结果" |
| 无会话 | 会话列表为空 | 只显示静态命令 |
| 循环导航 | 在最后一项按 ↓ | 回到第一项 |
| 快速输入 | 快速输入多个字符 | 搜索结果实时更新 |

### 5.3 性能测试

| 测试项 | 指标 | 目标 |
|--------|------|------|
| 打开速度 | 首次渲染时间 | < 100ms |
| 搜索响应 | 输入到过滤完成 | < 50ms |
| 动画流畅度 | FPS | 60fps |
| 内存占用 | 组件内存 | < 5MB |

### 5.4 兼容性测试

| 浏览器 | 版本 | 测试项 |
|--------|------|--------|
| Chrome | 90+ | 全功能测试 |
| Firefox | 88+ | 全功能测试 |
| Safari | 14+ | 全功能测试 |
| Edge | 90+ | 全功能测试 |

---

## 6. 风险评估

### 6.1 技术风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 快捷键冲突 | 中 | 中 | 检查现有快捷键，允许自定义 |
| 性能问题（大量会话） | 高 | 低 | 虚拟滚动，限制显示数量 |
| 搜索结果不准确 | 低 | 低 | 优化搜索算法，添加更多关键词 |
| 动画卡顿 | 中 | 低 | 优化动画，使用 CSS transform |

### 6.2 用户体验风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 用户不知道有这个功能 | 高 | 高 | 添加引导提示，显示快捷键 |
| 搜索结果太多 | 中 | 中 | 分组显示，限制显示数量 |
| 学习成本高 | 低 | 低 | 提供快捷键提示，直观的 UI |

### 6.3 可维护性风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 命令配置分散 | 中 | 高 | 集中管理命令配置 |
| 新增命令麻烦 | 低 | 中 | 提供清晰的添加指南 |

---

## 7. 扩展规划

### 7.1 近期扩展（v0.2.0）

- [ ] 添加更多命令（设置、帮助等）
- [ ] 命令历史记录
- [ ] 自定义快捷键
- [ ] 命令别名

### 7.2 中期扩展（v0.3.0）

- [ ] 插件系统（允许扩展命令）
- [ ] 自然语言搜索（"打开昨天的对话"）
- [ ] 命令面包屑（多级命令）
- [ ] 快捷操作（右键菜单集成）

### 7.3 长期扩展（v1.0+）

- [ ] AI 智能推荐命令
- [ ] 命令使用统计和优化
- [ ] 团队协作（共享命令）
- [ ] 命令市场（社区命令）

---

## 8. 文件清单

### 8.1 新增文件

```
client/src/components/ai/
  ├── command-menu.tsx          (主组件)
  └── command-menu.types.ts     (类型定义，可选)
```

### 8.2 修改文件

```
client/src/app/layout.tsx       (引入 CommandMenu)
client/src/store/ai-store.ts    (可能需要新增方法)
```

### 8.3 文档文件

```
specs/001-design-specification-ivan/
  └── TECH-SPEC-COMMAND-MENU.md (本文档)
```

---

## 9. 验收清单

开发完成后，需要满足：

### 功能完整性
- [ ] Cmd+K / Ctrl+K 打开菜单
- [ ] Esc / 背景点击关闭菜单
- [ ] 搜索输入实时过滤
- [ ] ↑↓ 箭头键导航
- [ ] Enter 执行命令
- [ ] 显示所有会话
- [ ] 新建会话功能
- [ ] 切换会话功能
- [ ] 删除会话功能
- [ ] 导出对话功能
- [ ] 切换主题功能

### 视觉规范
- [ ] 符合设计系统颜色
- [ ] 圆角、间距符合 4px 网格
- [ ] 动画流畅（60fps）
- [ ] 深色模式适配
- [ ] 图标显示正确
- [ ] 快捷键提示清晰

### 用户体验
- [ ] 输入框自动聚焦
- [ ] 空状态提示友好
- [ ] 操作响应快速
- [ ] 无明显延迟或卡顿
- [ ] 错误处理完善

### 代码质量
- [ ] TypeScript 类型完整
- [ ] 通过 ESLint 检查
- [ ] 组件代码清晰
- [ ] 注释充分
- [ ] 无 console.log

### 测试覆盖
- [ ] 所有功能测试通过
- [ ] 边界测试通过
- [ ] 性能测试通过
- [ ] 兼容性测试通过

---

## 10. 参考资料

### 10.1 类似产品

- [Raycast](https://www.raycast.com/) - macOS 效率工具
- [VS Code Command Palette](https://code.visualstudio.com/)
- [Notion Quick Find](https://www.notion.so/)
- [Linear Command Menu](https://linear.app/)

### 10.2 技术文档

- [React Hooks](https://react.dev/reference/react)
- [Framer Motion](https://www.framer.com/motion/)
- [Fuse.js](https://fusejs.io/) (可选)
- [Zustand](https://github.com/pmndrs/zustand)

### 10.3 设计资源

- [项目设计系统](./spec.md)
- [动画配置](../../client/src/lib/motion-config.ts)
- [颜色变量](../../client/src/app/globals.css)

---

## 📝 变更日志

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|---------|------|
| 2025-10-21 | 1.0.0 | 初始版本创建 | Ivan |

---

**审批流程**：

- [ ] 技术方案审批（技术负责人）
- [ ] 设计审批（设计负责人）
- [ ] 开始开发

---

**下一步**：审批通过后，按照实施步骤开始开发 🚀

---

🌿✨ **让设计更温暖、更自然、更智能** ✨🌿
