# 🧠 项目记忆 - Ivan_HappyWoods

**创建日期**: 2025-10-21  
**最后更新**: 2025-10-21  
**状态**: 🟢 Active

---

## 📌 项目基本信息

| 项目 | 值 |
|------|---|
| **项目名称** | Ivan_HappyWoods |
| **项目类型** | AI 对话系统 |
| **技术栈** | Next.js 15 + React 19 + TypeScript 5.3 + TailwindCSS 4 |
| **当前版本** | 0.1.0 |
| **开发阶段** | Phase 4（UI 增强与优化） |
| **完成度** | 58% |

---

## 🎯 项目定位

Ivan_HappyWoods 是一个**温暖、自然、智能**的 AI 对话系统，核心特色：

1. **设计优先** - 琥珀色温暖主题，4px 基线网格，WCAG AAA 无障碍标准
2. **用户体验** - 流式响应，Markdown 渲染，深色模式，流畅动画
3. **技术现代** - Next.js 15，React 19，TypeScript strict，Zustand 状态管理
4. **开发规范** - SpecKit 规范文档，宪法原则，任务清单

---

## 📚 核心文档

### 规范文档
- **宪法** ([`.specify/constitution.md`](.specify/constitution.md )) - 项目原则和约束
- **规范** ([`.specify/spec.md`](.specify/spec.md )) - 功能需求和验收标准
- **计划** ([`.specify/plan.md`](.specify/plan.md )) - 架构设计和实施阶段
- **任务** ([`.specify/tasks.md`](.specify/tasks.md )) - 详细任务清单

### 项目文档
- **README** - 项目说明和快速启动
- **PROJECT-STATUS** - 详细进度报告
- **API 手册** - 后端接口文档
- **快速启动指南** - 开发环境搭建

---

## 🏗️ 架构要点

### 目录结构
```
client/src/
├── app/              # Next.js App Router 页面
├── components/       # UI 组件库
│   ├── ui/          # 基础组件（Button, Card, Text等）
│   ├── ai/          # AI 对话组件
│   ├── chat/        # 聊天组件
│   └── icons/       # 图标组件
├── lib/             # 工具库（API, 动画配置）
├── hooks/           # 自定义 Hooks
├── store/           # Zustand 状态管理
└── providers/       # Context Providers
```

### 技术选型理由

**Next.js 15**
- ✅ SSR/SSG 支持，SEO 友好
- ✅ App Router 简化路由
- ✅ Turbopack 构建更快
- ✅ Vercel 部署便捷

**Zustand vs Redux**
- ✅ API 更简单（无 Provider）
- ✅ TypeScript 支持更好
- ✅ 包体积更小（~1KB）

**TailwindCSS vs CSS-in-JS**
- ✅ 性能更好（编译时）
- ✅ 类型安全（v4）
- ✅ 开发效率高

---

## 🎨 设计系统

### 核心设计原则

1. **4px 基线网格** - 所有间距是 4 的倍数
2. **温暖琥珀色** - 主色 #E4B16B，次色 #9CAF88
3. **WCAG AAA** - 对比度 ≥ 7:1
4. **流畅动画** - 60fps，spring 弹性曲线
5. **深色模式** - 无闪烁切换，完整适配

### 组件库

**基础组件** (Phase 1 完成)
- Button（4 变体 × 3 尺寸）
- Card（3 变体）
- Heading（h1-h6）
- Text, Caption
- Logo（3 尺寸 + 光晕）
- ThemeToggle

**AI 对话组件** (Phase 2-3 完成)
- Message（用户/AI 消息气泡）
- MarkdownMessage（Markdown 渲染）
- AIInput（智能输入框）
- AIThinking（加载状态）
- AISidebar（会话列表）
- AILayout（对话布局）

---

## 🔄 开发进度

### 已完成阶段

✅ **Phase 0**: 项目初始化（2025-10-14）
- Next.js 项目搭建
- TypeScript 配置
- TailwindCSS 配置
- 目录结构创建

✅ **Phase 1**: 设计系统建设（2025-10-15~16）
- 10+ 基础组件
- 深色模式支持
- 动画系统（20+ 预设）
- 设计文档完善

✅ **Phase 2**: AI 对话核心功能（2025-10-16~18）
- API Service 层
- SSE 流式响应
- Markdown 渲染
- 代码高亮

✅ **Phase 3**: 会话管理（2025-10-18~19）
- Zustand Store
- 会话列表侧边栏
- 新建/切换/删除会话
- 状态持久化

### 当前阶段

🔄 **Phase 4**: UI 增强与优化（2025-10-19~23，38% 完成）

**已完成**:
- ✅ 响应式布局
- ✅ 页面过渡动画
- ✅ 渐变背景

**进行中**:
- 🔄 命令菜单（Cmd+K）
- 🔄 消息操作菜单

**待开始**:
- ⚪ 代码块复制按钮
- ⚪ 加载状态优化
- ⚪ 错误边界

---

## 🎯 重要决策记录

### 1. 为什么不用传统后端？
- 使用现有 API 服务
- 专注前端体验优化
- 降低开发复杂度

### 2. 为什么选择 Zustand 而不是 Context API？
- 性能更好（避免不必要的重渲染）
- API 更简洁
- TypeScript 支持更好
- 包体积小

### 3. 为什么使用 SSE 而不是 WebSocket？
- 单向数据流更简单
- 服务端推送场景更适合
- 浏览器原生支持好
- 断线自动重连

### 4. 为什么严格遵循 4px 基线网格？
- 视觉节奏统一
- 开发决策简化
- 减少随意性
- 易于维护

---

## ⚠️ 已知问题和限制

### 技术债务

1. **长对话性能** (TASK-601)
   - 问题: 消息 > 100 时滚动卡顿
   - 计划: 实现虚拟滚动
   - 优先级: P1

2. **代码块复制** (TASK-406)
   - 问题: 尚未实现
   - 计划: Phase 4 添加
   - 优先级: P1

3. **测试覆盖** (Phase 7)
   - 问题: 测试覆盖率不足
   - 计划: v1.0 前完成
   - 优先级: P0

### 设计限制

1. **移动端输入框** 
   - iOS 键盘遮挡问题
   - 需要优化布局逻辑

2. **长代码块**
   - 横向滚动体验待优化
   - 考虑行号折叠

---

## 📋 下一步计划

### 近期目标（1-2 周）

1. 完成 Phase 4 剩余任务
   - [ ] 命令菜单（Cmd+K）
   - [ ] 消息操作菜单
   - [ ] 代码块复制

2. 开始 Phase 5 高级功能
   - [ ] 消息搜索
   - [ ] 消息编辑/重新生成
   - [ ] 导出功能

### 中期目标（1-2 月）

1. 完成 Phase 6 性能优化
   - [ ] 虚拟滚动
   - [ ] 包体积优化
   - [ ] 离线支持

2. 完成 Phase 7 测试文档
   - [ ] 单元测试（> 80% 覆盖）
   - [ ] E2E 测试
   - [ ] 完整文档

### 长期目标（3-6 月）

1. **v1.0 发布**
   - 所有核心功能完成
   - 测试覆盖率达标
   - 文档完善

2. **多模态支持**
   - 图片输入
   - 文件上传
   - 语音对话

3. **企业功能**
   - 知识库集成
   - 团队协作
   - 权限管理

---

## 🔑 关键原则（来自宪法）

### MUST（必须）

1. **类型安全** - TypeScript strict 模式，禁止 any
2. **无障碍** - WCAG AAA 标准，完整 ARIA 支持
3. **设计一致** - 遵循设计系统，4px 基线网格
4. **性能优先** - 首屏 < 2s，动画 60fps
5. **代码质量** - 通过 ESLint，函数 < 50 行

### SHOULD（应该）

1. 复用现有组件
2. 单元测试覆盖 > 80%
3. 使用有意义的命名
4. 支持离线访问
5. 定期更新依赖

### 禁止事项

❌ 内联样式（除非动态计算）  
❌ 直接修改 DOM  
❌ 绕过类型检查  
❌ 偏离设计系统  
❌ 非 4px 倍数的间距

---

## 📞 联系和资源

### 文档链接
- GitHub 仓库: (待添加)
- 设计文档: `specs/001-design-specification-ivan/`
- 快速参考: `specs/001-design-specification-ivan/quick-reference.md`

### 外部资源
- [Next.js 文档](https://nextjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [WCAG 指南](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📝 更新日志

### 2025-10-21
- 🎉 初始化 SpecKit 规范文档结构
- 📄 创建 constitution.md（项目宪法）
- 📄 创建 spec.md（功能规范）
- 📄 创建 plan.md（实施计划）
- 📄 创建 tasks.md（任务清单）
- 🧠 创建 memory.md（项目记忆）

---

**记忆维护者**: Ivan  
**最后审查**: 2025-10-21  
**下次审查**: 每周一更新

🌿✨ **让设计更温暖、更自然、更智能** ✨🌿
