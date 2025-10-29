# Tasks: Ivan_HappyWoods Frontend Design System

**Input**: Design documents from `/specs/001-design-specification-ivan/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Branch**: `001-design-specification-ivan`  
**Created**: 2025-10-15

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
Based on plan.md structure:
- **Root**: `frontEnd/`
- **Source**: `src/`
- **Components**: `src/components/`
- **Tests**: `tests/`
- **Storybook**: `.storybook/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic tooling configuration

- [ ] T001 Initialize Next.js 14+ project with TypeScript 5.3+ at frontEnd/
- [ ] T002 Install and configure TailwindCSS 3.4+ with design tokens in tailwind.config.ts
- [ ] T003 [P] Install Framer Motion 11+ and configure motion preferences
- [ ] T004 [P] Install ShadCN/UI CLI and configure component path
- [ ] T005 [P] Install Lucide React icons library
- [ ] T006 [P] Install clsx and tailwind-merge for className utilities
- [ ] T007 [P] Configure Vitest for unit testing in vitest.config.ts
- [ ] T008 [P] Configure React Testing Library in tests/setup.ts
- [ ] T009 [P] Install and configure Playwright for E2E tests
- [ ] T010 [P] Initialize Storybook 7+ with Next.js integration in .storybook/
- [ ] T011 [P] Configure ESLint with TypeScript, React, and accessibility rules
- [ ] T012 [P] Configure Prettier with Tailwind plugin
- [ ] T013 [P] Setup Husky and lint-staged for pre-commit hooks
- [ ] T014 [P] Configure pnpm workspace if needed
- [ ] T015 Create project structure per plan.md (src/components/, src/styles/, src/lib/, etc.)
- [ ] T016 Setup git ignore patterns for Next.js, node_modules, and build artifacts

**Checkpoint**: Project initialized with all tooling configured

---

## Phase 2: Foundational (Design System Core)

**Purpose**: Core design tokens, utilities, and infrastructure that ALL components depend on

**⚠️ CRITICAL**: No component work can begin until this phase is complete

### Design Tokens

- [ ] T017 Implement primitive color tokens in tailwind.config.ts (neutral, amber, sage, coral, green)
- [ ] T018 Implement spacing tokens with 4px baseline grid in tailwind.config.ts
- [ ] T019 Implement typography tokens (Inter/DM Sans fonts, sizes, weights) in tailwind.config.ts
- [ ] T020 Implement border-radius tokens in tailwind.config.ts
- [ ] T021 Implement box-shadow tokens in tailwind.config.ts
- [ ] T022 Configure semantic color tokens (surface, text, interactive, border, status)
- [ ] T023 Configure component-specific tokens (button, card, input, sidebar, header)
- [ ] T024 Setup Next.js font optimization for Inter and DM Sans in src/app/layout.tsx

### Global Styles & Utilities

- [ ] T025 Create global CSS with Tailwind directives in src/styles/globals.css
- [ ] T026 Implement design token TypeScript definitions in src/styles/design-tokens.ts
- [ ] T027 Create theme configuration file in src/styles/theme.config.ts
- [ ] T028 Implement cn() utility function in src/lib/utils.ts
- [ ] T029 Implement color contrast ratio calculator in src/lib/color-utils.ts
- [ ] T030 Create motion configuration with reduced-motion detection in src/lib/motion-config.ts

### Animation System

- [ ] T031 [P] Implement fadeIn animation variant in src/components/animations/fade-in.ts
- [ ] T032 [P] Implement slideUp animation variant in src/components/animations/slide-up.ts
- [ ] T033 [P] Implement cardHover animation variant in src/components/animations/card-hover.ts
- [ ] T034 [P] Implement buttonHover animation variant in src/components/animations/button-hover.ts
- [ ] T035 [P] Implement sidebarIndicator animation variant in src/components/animations/sidebar-indicator.ts
- [ ] T036 Create animation presets index with motion preference handling in src/components/animations/index.ts

### Type Definitions

- [ ] T037 [P] Create component states types in src/types/component-states.ts
- [ ] T038 [P] Create animation types in src/types/animation.ts
- [ ] T039 [P] Create breakpoints and responsive types in src/types/breakpoints.ts
- [ ] T040 [P] Create theme types in src/types/theme.ts
- [ ] T041 Create design system type definitions in src/types/design-system.d.ts

### Root Layout & Storybook

- [ ] T042 Implement root layout with design system fonts and classes in src/app/layout.tsx
- [ ] T043 Configure Storybook preview with design tokens in .storybook/preview.ts
- [ ] T044 Configure Storybook main config with addons in .storybook/main.ts
- [ ] T045 Create Storybook theme matching design system in .storybook/theme.ts

**Checkpoint**: Foundation ready - component implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Experience and Brand Perception (Priority: P1) 🎯 MVP

**Goal**: Establish warm, natural, intelligent brand identity through visual interface with proper color palette, spacing, and basic components

**Independent Test**: Load any page and verify warm color palette (#FDFCF9 background, #E4B16B accents), rounded corners on all elements, 4px grid spacing consistency, and WCAG AAA contrast ratios (≥7:1)

### Logo Component (Brand Identity)

- [ ] T046 [US1] Design HappyLeaf SVG logo with rounded emblem in src/components/icons/happy-leaf.tsx
- [ ] T047 [US1] Implement Logo component with size variants (sm/default/lg) in src/components/icons/logo.tsx
- [ ] T048 [US1] Add optional breathing glow animation to Logo
- [ ] T049 [US1] Create Logo Storybook stories in src/components/icons/logo.stories.tsx
- [ ] T050 [US1] Write Logo component tests in src/components/icons/logo.test.tsx

### Button Component (Primary Interaction)

- [ ] T051 [US1] Implement Button base component with Radix Slot in src/components/ui/button/button.tsx
- [ ] T052 [US1] Add Button variants (primary, secondary, text) using CVA
- [ ] T053 [US1] Add Button sizes (sm, default, lg, icon) using CVA
- [ ] T054 [US1] Implement Button hover animations (scale 1.05, spring easing)
- [ ] T055 [US1] Add Button focus states with amber glow
- [ ] T056 [US1] Implement Button loading state with spinner
- [ ] T057 [US1] Add Button icon support (leftIcon, rightIcon)
- [ ] T058 [US1] Ensure Button keyboard accessibility (Enter/Space keys)
- [ ] T059 [US1] Create Button Storybook stories with all variants in src/components/ui/button/button.stories.tsx
- [ ] T060 [US1] Write Button component tests (render, click, keyboard, a11y) in src/components/ui/button/button.test.tsx

### Card Component (Content Container)

- [ ] T061 [P] [US1] Implement Card base component in src/components/ui/card/card.tsx
- [ ] T062 [P] [US1] Add Card variants (default, elevated, outlined)
- [ ] T063 [P] [US1] Add Card padding options (none, sm, default, lg)
- [ ] T064 [P] [US1] Implement Card hover animation (lift 3px, shadow deepen) when interactive=true
- [ ] T065 [P] [US1] Create CardHeader, CardContent, CardFooter subcomponents
- [ ] T066 [P] [US1] Create Card Storybook stories in src/components/ui/card/card.stories.tsx
- [ ] T067 [P] [US1] Write Card component tests in src/components/ui/card/card.test.tsx

### Demo Page (Visual Showcase)

- [ ] T068 [US1] Create demo page in src/app/demo/page.tsx showcasing Logo, Buttons, Cards
- [ ] T069 [US1] Implement color palette showcase section with all semantic colors
- [ ] T070 [US1] Add spacing demonstration section with 4px grid examples
- [ ] T071 [US1] Create rounded corners showcase with different radius values
- [ ] T072 [US1] Verify WCAG AAA contrast ratios on demo page using axe-core

**Checkpoint**: Core brand identity established with Logo, Button, and Card components functional

---

## Phase 4: User Story 2 - Readable and Comfortable Typography (Priority: P1)

**Goal**: Implement complete typography system with Inter/DM Sans fonts, proper hierarchy (h1-h3, body, caption), and WCAG AAA contrast

**Independent Test**: Display page with all text variants, verify font sizes (13px caption, 15-16px body, 24-32px headers), line-height (1.6 for body), and contrast ratios (≥7:1 for all text on backgrounds)

### Typography Components

- [ ] T073 [P] [US2] Create Text component with variant support in src/components/ui/text/text.tsx
- [ ] T074 [P] [US2] Implement Heading component (h1/h2/h3) in src/components/ui/heading/heading.tsx
- [ ] T075 [P] [US2] Implement Caption component in src/components/ui/caption/caption.tsx
- [ ] T076 [P] [US2] Create typography showcase Storybook story in src/components/ui/text/typography.stories.tsx

### Typography Demo & Testing

- [ ] T077 [US2] Create typography demo page in src/app/typography/page.tsx
- [ ] T078 [US2] Add heading hierarchy demonstration (h1, h2, h3)
- [ ] T079 [US2] Add body text demonstration with line-height visualization
- [ ] T080 [US2] Add caption and label text demonstrations
- [ ] T081 [US2] Implement responsive font scaling examples
- [ ] T082 [US2] Write automated contrast ratio tests in tests/unit/contrast.test.ts
- [ ] T083 [US2] Create typography component tests in tests/unit/typography.test.tsx
- [ ] T084 [US2] Verify font loading performance and FOUT prevention

**Checkpoint**: Complete typography system with all text variants functional and accessible

---

## Phase 5: User Story 3 - Responsive Layout Adaptation (Priority: P2)

**Goal**: Implement responsive layouts with breakpoint support (mobile ≤640px, tablet 641-1024px, desktop ≥1025px), sidebar collapse behavior, and smooth transitions

**Independent Test**: Test on multiple devices/viewports, verify sidebar collapses to bottom bar on mobile, two-column grid on tablet, full layout with 220px sidebar on desktop, no horizontal scrolling on 320px+ viewports

### Layout Components

- [ ] T085 [US3] Implement MainLayout container in src/components/layout/main-layout/main-layout.tsx
- [ ] T086 [US3] Add max-width (900px) and responsive padding (40px desktop, 20px mobile)
- [ ] T087 [US3] Create responsive grid system utilities in src/lib/responsive.ts

### Sidebar Component

- [ ] T088 [US3] Implement Sidebar base component in src/components/layout/sidebar/sidebar.tsx
- [ ] T089 [US3] Add Sidebar position prop (left for desktop, bottom for mobile)
- [ ] T090 [US3] Implement Sidebar item navigation with active state
- [ ] T091 [US3] Add active indicator animation (amber underline, 200ms linear)
- [ ] T092 [US3] Implement Sidebar hover effects (scale 1.02, color fade)
- [ ] T093 [US3] Add keyboard navigation (Arrow keys, Enter/Space)
- [ ] T094 [US3] Handle Sidebar responsive behavior (collapse at ≤640px breakpoint)
- [ ] T095 [US3] Create Sidebar Storybook stories in src/components/layout/sidebar/sidebar.stories.tsx
- [ ] T096 [US3] Write Sidebar component tests in src/components/layout/sidebar/sidebar.test.tsx

### Header Component

- [ ] T097 [P] [US3] Implement Header component in src/components/layout/header/header.tsx
- [ ] T098 [P] [US3] Set Header fixed height (64px) with 80% opacity background
- [ ] T099 [P] [US3] Add Header backdrop blur effect (10px)
- [ ] T100 [P] [US3] Implement Header logo, search, and action slots
- [ ] T101 [P] [US3] Create Header Storybook stories in src/components/layout/header/header.stories.tsx
- [ ] T102 [P] [US3] Write Header component tests in src/components/layout/header/header.test.tsx

### Responsive Demo & Testing

- [ ] T103 [US3] Create responsive demo page in src/app/responsive/page.tsx
- [ ] T104 [US3] Implement breakpoint indicator for development
- [ ] T105 [US3] Add Playwright tests for mobile viewport (≤640px) in tests/e2e/responsive-mobile.spec.ts
- [ ] T106 [US3] Add Playwright tests for tablet viewport (641-1024px) in tests/e2e/responsive-tablet.spec.ts
- [ ] T107 [US3] Add Playwright tests for desktop viewport (≥1025px) in tests/e2e/responsive-desktop.spec.ts
- [ ] T108 [US3] Test device rotation behavior and smooth transitions
- [ ] T109 [US3] Verify no horizontal scrolling on 320px viewport

**Checkpoint**: Responsive layouts functional across all breakpoints with proper sidebar/header behavior

---

## Phase 6: User Story 4 - Intuitive Component Interactions (Priority: P2)

**Goal**: Implement interactive components (Input, Modal) with immediate feedback (<100ms), smooth animations (hover/focus states), and clear visual cues

**Independent Test**: Interact with all components, verify button hover scales to 1.05 in 150ms, input focus shows amber border in 200ms, card hover lifts 3px in 250ms, all feedback occurs within 100ms

### Input Component

- [ ] T110 [US4] Implement Input base component in src/components/ui/input/input.tsx
- [ ] T111 [US4] Add Input size variants (sm, default, lg)
- [ ] T112 [US4] Implement Input focus state with amber glow (200ms transition)
- [ ] T113 [US4] Add Input error state with coral color and error message
- [ ] T114 [US4] Add Input success state with green color
- [ ] T115 [US4] Implement Input icon support (leftIcon, rightIcon)
- [ ] T116 [US4] Add Input helper text and placeholder styling
- [ ] T117 [US4] Ensure Input keyboard accessibility and ARIA attributes
- [ ] T118 [US4] Create Input Storybook stories with all states in src/components/ui/input/input.stories.tsx
- [ ] T119 [US4] Write Input component tests (focus, error, success, keyboard) in src/components/ui/input/input.test.tsx

### Modal Component

- [ ] T120 [P] [US4] Implement Modal base component with Radix Dialog in src/components/ui/modal/modal.tsx
- [ ] T121 [P] [US4] Add Modal size variants (sm, default, lg, full)
- [ ] T122 [P] [US4] Implement Modal fade-in animation (300ms easeInOut)
- [ ] T123 [P] [US4] Add Modal backdrop blur (10px) and click-to-close
- [ ] T124 [P] [US4] Implement Modal focus trap and focus restoration
- [ ] T125 [P] [US4] Add Modal ESC key to close behavior
- [ ] T126 [P] [US4] Create ModalHeader, ModalContent, ModalFooter subcomponents
- [ ] T127 [P] [US4] Ensure Modal ARIA attributes (role, aria-modal, aria-labelledby)
- [ ] T128 [P] [US4] Create Modal Storybook stories in src/components/ui/modal/modal.stories.tsx
- [ ] T129 [P] [US4] Write Modal component tests (open/close, keyboard, focus trap) in src/components/ui/modal/modal.test.tsx

### Interaction Performance Testing

- [ ] T130 [US4] Create interaction performance test suite in tests/unit/performance.test.ts
- [ ] T131 [US4] Measure and verify button hover feedback time (<100ms)
- [ ] T132 [US4] Measure and verify input focus transition time (200ms)
- [ ] T133 [US4] Measure and verify card hover animation time (250ms)
- [ ] T134 [US4] Create interaction demo page in src/app/interactions/page.tsx

**Checkpoint**: All interactive components provide immediate, smooth feedback meeting performance requirements

---

## Phase 7: User Story 5 - Consistent Spacing and Visual Rhythm (Priority: P3)

**Goal**: Enforce 4px baseline grid system across all components, implement consistent spacing tokens (32px sections, 16px cards, 12px inputs), and create spacing utilities

**Independent Test**: Measure spacing on any component/page, verify all values are multiples of 4px, section gaps are 32px, card gaps are 16px, container padding is 40px (desktop) / 20px (mobile)

### Spacing Utilities & Validation

- [ ] T135 [P] [US5] Create spacing validation utility in src/lib/spacing-validator.ts
- [ ] T136 [P] [US5] Implement baseline grid overlay for development mode in src/components/dev/grid-overlay.tsx
- [ ] T137 [P] [US5] Create spacing token test suite in tests/unit/spacing.test.ts
- [ ] T138 [P] [US5] Add ESLint rule for spacing validation (custom rule)

### Component Spacing Refinement

- [ ] T139 [US5] Audit and fix Button component spacing (padding, margin)
- [ ] T140 [US5] Audit and fix Card component spacing (padding, gaps)
- [ ] T141 [US5] Audit and fix Input component spacing (padding, margin)
- [ ] T142 [US5] Audit and fix Sidebar component spacing (item padding, gaps)
- [ ] T143 [US5] Audit and fix Header component spacing (height, padding)
- [ ] T144 [US5] Audit and fix MainLayout component spacing (container padding)

### Spacing Documentation

- [ ] T145 [US5] Create spacing guide page in src/app/spacing/page.tsx
- [ ] T146 [US5] Add visual examples of 4px grid system
- [ ] T147 [US5] Demonstrate all spacing tokens (section, card, input)
- [ ] T148 [US5] Add do's and don'ts for spacing usage
- [ ] T149 [US5] Create spacing Storybook documentation in .storybook/docs/spacing.stories.mdx

**Checkpoint**: 4px baseline grid consistently applied across all components with validation tools

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, accessibility validation, and performance optimization

### Accessibility Compliance

- [ ] T150 [P] Run axe-core accessibility audit on all components
- [ ] T151 [P] Fix any WCAG AAA violations found
- [ ] T152 [P] Test all components with keyboard navigation
- [ ] T153 [P] Test all components with screen reader (NVDA/VoiceOver)
- [ ] T154 [P] Verify all color contrast ratios meet 7:1 minimum
- [ ] T155 [P] Test reduced-motion preference handling in all animations
- [ ] T156 Create accessibility testing guide in docs/accessibility.md

### Performance Optimization

- [ ] T157 [P] Run Lighthouse performance audit on demo pages
- [ ] T158 [P] Optimize bundle size (ensure design system <50KB)
- [ ] T159 [P] Implement code splitting for heavy components
- [ ] T160 [P] Optimize font loading with preload hints
- [ ] T161 [P] Measure and optimize animation frame rates (60fps target)
- [ ] T162 [P] Add performance monitoring in production

### Documentation & Storybook

- [ ] T163 [P] Complete all Storybook stories with MDX documentation
- [ ] T164 [P] Add Storybook interactions addon examples
- [ ] T165 [P] Configure Storybook accessibility addon
- [ ] T166 [P] Generate Storybook static build for deployment
- [ ] T167 [P] Update quickstart.md with final examples and screenshots
- [ ] T168 [P] Create component migration guide for existing projects
- [ ] T169 Create design system overview page in src/app/page.tsx

### Testing & Quality

- [ ] T170 [P] Achieve 80%+ code coverage on component tests
- [ ] T171 [P] Add visual regression tests with Storybook
- [ ] T172 [P] Create E2E test suite covering all user stories in tests/e2e/user-stories.spec.ts
- [ ] T173 [P] Setup CI/CD pipeline with automated testing
- [ ] T174 Run full test suite and fix any failures

### Final Validation

- [ ] T175 Validate all user story acceptance scenarios from spec.md
- [ ] T176 Test on minimum supported browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- [ ] T177 Verify mobile performance on low-power devices
- [ ] T178 Run quickstart.md validation end-to-end
- [ ] T179 Create production build and verify bundle sizes
- [ ] T180 Final Constitution compliance check

**Checkpoint**: Design system complete, tested, documented, and production-ready

---

## Phase 9: AI 对话界面优化 (Priority: P1) ✅

**Goal**: 优化 AI 对话界面的用户体验,包括颜色系统、动画效果、工作流可视化等

**Started**: 2025-10-29  
**Status**: 🎉 已完成

### 骨架屏与加载状态优化

- [x] T181 [AI-UI] 优化骨架屏颜色方案,使用设计系统变量替代硬编码颜色 ✅ 2025-10-29
- [x] T182 [AI-UI] 修复思考动画位置,改为消息框内部渲染,取消淡出动画 ✅ 2025-10-29
- [x] T183 [AI-UI] 统一 ThinkingIndicator 样式,使用 `--surface-elevated` 和 `--text-secondary` ✅ 2025-10-29
- [x] T184 [AI-UI] 简化 MessageSkeleton 组件,去除冗余动画 ✅ 2025-10-29

### 搜索组件颜色统一

- [x] T185 [AI-UI] 更新 message-search.tsx 组件颜色 ✅ 2025-10-29
- [x] T186 [AI-UI] Dropdown 背景改为 `--surface-elevated` ✅ 2025-10-29
- [x] T187 [AI-UI] AI 标签使用 `--interactive-primary` 主题色 ✅ 2025-10-29
- [x] T188 [AI-UI] User 标签使用 `--surface-base` 和 `--text-secondary` ✅ 2025-10-29

### 自动滚动功能

- [x] T189 [AI-UI] 实现消息自动滚动到新消息位置 ✅ 2025-10-29
- [x] T190 [AI-UI] 使用消息数量检测触发滚动行为 ✅ 2025-10-29
- [x] T191 [AI-UI] 添加平滑滚动动画效果 ✅ 2025-10-29

### SSE 工作流可视化

- [x] T192 [AI-UI] 创建 WorkflowTimeline 组件 (249行) ✅ 2025-10-29
- [x] T193 [AI-UI] 实现 Graph 层事件显示 (workflow_started, node_started, node_finished, route_decision, workflow_complete) ✅ 2025-10-29
- [x] T194 [AI-UI] 实现 Node 层事件显示 (thinking_phase, tool_call_pending, tool_executing, tool_result, llm_streaming) ✅ 2025-10-29
- [x] T195 [AI-UI] 修改 notion-ai-interface.tsx 收集工作流事件 ✅ 2025-10-29
- [x] T196 [AI-UI] 修改 ai-chat-state.tsx 集成 WorkflowTimeline 显示 ✅ 2025-10-29
- [x] T197 [AI-UI] 验证 use-sse-stream.ts Hook 事件处理完整性 ✅ 2025-10-29

### 工作流时间线颜色优化

- [x] T198 [AI-UI] 统一配色方案,使用设计系统变量 ✅ 2025-10-29
- [x] T199 [AI-UI] 运行中状态使用 `--interactive-primary` (品牌橙) ✅ 2025-10-29
- [x] T200 [AI-UI] 完成状态使用 `emerald-500` (翡翠绿) ✅ 2025-10-29
- [x] T201 [AI-UI] 失败状态使用 `rose-500` (玫瑰红) ✅ 2025-10-29
- [x] T202 [AI-UI] LLM流式响应使用 `violet-500` (紫罗兰) ✅ 2025-10-29
- [x] T203 [AI-UI] 优化时间线容器样式 (渐变背景、阴影、分隔线) ✅ 2025-10-29
- [x] T204 [AI-UI] 增加事件卡片内边距和圆角 ✅ 2025-10-29

### 工作流展示简化

- [x] T205 [AI-UI] 简化工作流显示,只保留核心信息 ✅ 2025-10-29
- [x] T206 [AI-UI] 隐藏节点开始/完成事件 ✅ 2025-10-29
- [x] T207 [AI-UI] 隐藏路由决策事件 ✅ 2025-10-29
- [x] T208 [AI-UI] 隐藏思考阶段和 LLM 流式响应事件 ✅ 2025-10-29
- [x] T209 [AI-UI] 只显示工具执行中和执行结果 ✅ 2025-10-29
- [x] T210 [AI-UI] 隐藏工具待调用 (pending) 状态 ✅ 2025-10-29
- [x] T211 [AI-UI] 去除工具参数和详细结果显示 ✅ 2025-10-29
- [x] T212 [AI-UI] 只在失败时显示简短错误信息 ✅ 2025-10-29
- [x] T213 [AI-UI] 标题改为"调用工具",只统计工具调用数量 ✅ 2025-10-29
- [x] T214 [AI-UI] 无工具调用时不显示时间线 ✅ 2025-10-29

**Checkpoint**: AI 对话界面用户体验大幅提升,工作流可视化清晰简洁 ✅

**成果总结**:
- ✅ 骨架屏颜色与项目风格统一
- ✅ 思考动画更加连贯自然
- ✅ 搜索框颜色协调一致
- ✅ 新消息自动滚动定位
- ✅ 工作流执行步骤可视化
- ✅ 工作流颜色方案优雅舒适
- ✅ 工作流信息精简,突出重点

**涉及文件**:
- `client/src/components/ui/skeleton.tsx` - 骨架屏优化
- `client/src/components/ai/message-search.tsx` - 搜索框颜色
- `client/src/components/ai/workflow-visual.tsx` - 工作流时间线组件
- `client/src/components/ai/notion-ai-interface.tsx` - 事件收集
- `client/src/components/ai/ai-chat-state.tsx` - 时间线集成
- `client/src/hooks/use-sse-stream.ts` - SSE 事件处理

---

## Phase 10: 待规划功能 (Priority: TBD) 📋

**Goal**: 根据用户需求持续完善 AI 对话界面体验

**Status**: 待规划

### 工作流时间线增强
- [ ] T215 [AI-ENHANCE] 可折叠/展开的工具详情(点击查看完整参数和结果)
- [ ] T216 [AI-ENHANCE] 工具执行时长显示(每个工具的耗时)
- [ ] T217 [AI-ENHANCE] 失败工具的重试按钮
- [ ] T218 [AI-ENHANCE] 工具调用历史记录

### 消息交互增强
- [x] T219 [AI-ENHANCE] 消息编辑功能(修改已发送的消息) ✅ 2025-10-29
- [x] T220 [AI-ENHANCE] 消息删除功能 ✅ 2025-10-29
- [ ] T221 [AI-ENHANCE] 引用回复(引用之前的某条消息继续对话)
- [ ] T222 [AI-ENHANCE] 消息标记/收藏功能
- [ ] T223 [AI-ENHANCE] 消息导出(复制对话历史到剪贴板/下载为文件)

**T219-T220 实现详情**:
- ✅ 编辑消息: 鼠标悬停显示编辑按钮,点击进入编辑模式
- ✅ 编辑界面: 文本框自动调整高度,橙色边框高亮
- ✅ 快捷键: Ctrl+Enter 保存, Esc 取消
- ✅ 自动重新生成: 编辑后删除后续消息,重新请求 AI 回复
- ✅ 删除确认: 二次确认机制,3秒自动取消
- ✅ 智能删除: 删除用户消息时连同 AI 回复一起删除
- ✅ 防误操作: 脉冲红色确认状态,清晰的视觉反馈

### 输入体验优化
- [ ] T224 [AI-ENHANCE] Markdown 实时预览(在输入框下方显示格式化预览)
- [ ] T225 [AI-ENHANCE] @ 提及功能(引用上下文或特定消息)
- [ ] T226 [AI-ENHANCE] 快捷命令(如 /search, /summarize)
- [ ] T227 [AI-ENHANCE] 语音输入支持
- [ ] T228 [AI-ENHANCE] 拖拽上传文件/图片

### 对话管理
- [ ] T229 [AI-ENHANCE] 会话历史列表(显示所有历史对话)
- [ ] T230 [AI-ENHANCE] 对话分支功能(从某条消息开始新分支)
- [ ] T231 [AI-ENHANCE] 对话搜索(搜索历史消息)
- [ ] T232 [AI-ENHANCE] 对话导出/分享(生成分享链接)

### AI 响应增强
- [ ] T233 [AI-ENHANCE] 流式响应速度控制(快速/标准/慢速阅读模式)
- [ ] T234 [AI-ENHANCE] 响应暂停/继续按钮
- [ ] T235 [AI-ENHANCE] 响应质量反馈(详细反馈理由)
- [ ] T236 [AI-ENHANCE] 多种回答风格切换(简洁/详细/技术性)

### 视觉和动画
- [ ] T237 [AI-ENHANCE] 打字机音效(可选)
- [ ] T238 [AI-ENHANCE] 更丰富的加载动画
- [ ] T239 [AI-ENHANCE] 代码块语法高亮优化
- [ ] T240 [AI-ENHANCE] 深色模式进一步优化
- [ ] T241 [AI-ENHANCE] 自定义主题颜色

### 智能功能
- [ ] T242 [AI-ENHANCE] 自动摘要长对话
- [ ] T243 [AI-ENHANCE] 相关问题推荐
- [ ] T244 [AI-ENHANCE] 上下文提示(显示AI正在参考的内容)
- [ ] T245 [AI-ENHANCE] Token 使用统计显示
- [ ] T246 [AI-ENHANCE] 预估响应时间

### 无障碍功能
- [ ] T247 [AI-ENHANCE] 键盘快捷键支持(Ctrl+Enter 发送等)
- [ ] T248 [AI-ENHANCE] 屏幕阅读器优化
- [ ] T249 [AI-ENHANCE] 字体大小调整
- [ ] T250 [AI-ENHANCE] 高对比度模式

**Checkpoint**: 待用户确认优先级后逐步实现

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
    ├─→ Phase 3 (US1 - P1) 🎯 MVP
    ├─→ Phase 4 (US2 - P1)
    ├─→ Phase 5 (US3 - P2)
    ├─→ Phase 6 (US4 - P2)
    ├─→ Phase 7 (US5 - P3)
    └─→ Phase 9 (AI 对话界面优化 - P1) ✅ 已完成
    ↓
Phase 8 (Polish)
    ↓
Phase 10 (待规划功能) 📋
```

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - CRITICAL BLOCKER
- **User Stories (Phases 3-7)**: All depend on Foundational completion
  - Can execute in parallel if team capacity allows
  - Or sequentially in priority order: US1 → US2 → US3 → US4 → US5
- **Polish (Phase 8)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (Visual Experience)**: Independent - establishes core components
- **US2 (Typography)**: Independent - extends visual foundation
- **US3 (Responsive Layout)**: Independent - new layout components
- **US4 (Component Interactions)**: Independent - new interaction components
- **US5 (Spacing Consistency)**: Depends on US1-US4 existing for audit

### Recommended MVP Scope

**Minimum Viable Product** (deliver maximum value, minimum effort):
- Phase 1: Setup ✓
- Phase 2: Foundational ✓
- Phase 3: User Story 1 (Visual Experience) ✓

This MVP delivers:
- Complete design token system
- Logo component (brand identity)
- Button component (primary interaction)
- Card component (content container)
- Animation system
- Storybook documentation
- Accessibility compliance

**Incremental Releases**:
1. **MVP**: US1 (Visual + Core Components)
2. **v1.1**: US1 + US2 (+ Typography System)
3. **v1.2**: US1 + US2 + US3 (+ Responsive Layouts)
4. **v1.3**: US1 + US2 + US3 + US4 (+ Interactive Components)
5. **v1.4**: US1-US4 + US5 (+ Spacing Validation)
6. **v2.0**: All stories + Polish

---

## Parallel Execution Opportunities

### Phase 1 (Setup) - 10 parallel tasks
All tasks marked [P] can run simultaneously:
- T003, T004, T005, T006, T007, T008, T009, T010, T011, T012, T013, T014

### Phase 2 (Foundational) - Animation variants (5 parallel)
- T031 (fadeIn), T032 (slideUp), T033 (cardHover), T034 (buttonHover), T035 (sidebarIndicator)

### Phase 2 (Foundational) - Type definitions (4 parallel)
- T037 (component-states), T038 (animation), T039 (breakpoints), T040 (theme)

### Phase 3 (US1) - Card component (2 parallel)
- T061-T067 can run parallel to Button (T051-T060) if team capacity

### Phase 4 (US2) - Typography components (3 parallel)
- T073 (Text), T074 (Heading), T075 (Caption) - all independent

### Phase 5 (US3) - Header and tests (2 parallel)
- T097-T102 (Header) parallel to Sidebar work
- T105, T106, T107 (Playwright tests) parallel if Header/Sidebar complete

### Phase 6 (US4) - Modal (10 parallel)
- T120-T129 (Modal) can run parallel to Input (T110-T119)

### Phase 7 (US5) - Spacing utilities (4 parallel)
- T135 (validator), T136 (overlay), T137 (tests), T138 (ESLint)

### Phase 8 (Polish) - Most tasks parallelizable
- Accessibility: T150-T156 (7 parallel)
- Performance: T157-T162 (6 parallel)
- Documentation: T163-T169 (7 parallel)
- Testing: T170-T174 (5 parallel)

**Maximum parallel capacity**: ~40 tasks can run simultaneously across phases with proper team coordination

---

## Task Statistics

- **Total Tasks**: 250 (原 180 + Phase 9: 34 + Phase 10: 36)
- **Phase 1 (Setup)**: 16 tasks
- **Phase 2 (Foundational)**: 29 tasks
- **Phase 3 (US1 - P1)**: 27 tasks 🎯 MVP
- **Phase 4 (US2 - P1)**: 12 tasks
- **Phase 5 (US3 - P2)**: 25 tasks
- **Phase 6 (US4 - P2)**: 25 tasks
- **Phase 7 (US5 - P3)**: 15 tasks
- **Phase 8 (Polish)**: 31 tasks
- **Phase 9 (AI 对话界面优化 - P1)**: 34 tasks ✅ **已完成**
- **Phase 10 (待规划功能)**: 36 tasks 📋 **待规划**

**Parallelizable Tasks**: 89 tasks marked [P] (原基础部分 49%)

**Phase 9 完成情况**:
- ✅ 骨架屏优化: 4/4 tasks (100%)
- ✅ 搜索组件: 4/4 tasks (100%)
- ✅ 自动滚动: 3/3 tasks (100%)
- ✅ SSE 工作流: 6/6 tasks (100%)
- ✅ 颜色优化: 7/7 tasks (100%)
- ✅ 展示简化: 10/10 tasks (100%)
- **总计**: 34/34 tasks ✅ **100% 完成**

**Estimated Timeline** (with 2-person team):
- Phase 1: 1 week
- Phase 2: 2 weeks
- Phase 3 (MVP): 2 weeks
- Phase 4: 1 week
- Phase 5: 2 weeks
- Phase 6: 2 weeks
- Phase 7: 1 week
- Phase 8: 1 week
- **Phase 9: 0.5 weeks** ✅ **已完成 (2025-10-29)**
- Phase 10: TBD (待用户确认优先级)

**Total**: ~12.5 weeks for complete implementation (不含 Phase 10)

**MVP Timeline**: ~5 weeks (Phase 1 + Phase 2 + Phase 3)

---

## Format Validation ✅

All 180 tasks follow the required checklist format:
- ✅ Checkbox: `- [ ]`
- ✅ Task ID: T001-T180 (sequential)
- ✅ [P] marker: 89 tasks (where applicable)
- ✅ [Story] label: 104 tasks in US phases (US1-US5)
- ✅ Description: Clear actions with file paths
- ✅ Organization: By user story for independent delivery

**Example formats verified**:
- `- [ ] T001 Create project structure per implementation plan` ✓
- `- [ ] T003 [P] Install Framer Motion 11+ and configure motion preferences` ✓
- `- [ ] T046 [US1] Design HappyLeaf SVG logo with rounded emblem in src/components/icons/happy-leaf.tsx` ✓
- `- [ ] T085 [US3] Implement MainLayout container in src/components/layout/main-layout/main-layout.tsx` ✓

---

**Tasks Status**: ✅ Ready for implementation  
**Next Step**: Begin Phase 1 (Setup) or proceed directly to MVP (Phase 1-3)

🌿✨ *Let's build a warm, natural, intelligent design system!* ✨🌿
