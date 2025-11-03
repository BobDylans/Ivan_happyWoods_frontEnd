"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HappyWoodsLogo } from "@/components/icons/happy-woods-logo";
import { MarkdownMessage } from "@/components/ai/markdown-message";

export default function MarkdownDemoPage() {
  const demoContent = `# Markdown 渲染增强示例

## ✅ 任务列表支持

### 待办事项
- [ ] 实现任务列表支持
- [x] 添加图片预览功能
- [x] 优化表格响应式
- [ ] 添加 LaTeX 公式支持
- [x] 外部链接图标提示

## 📊 响应式表格

### 用户数据表格

| 姓名 | 年龄 | 职位 | 邮箱 | 部门 | 状态 |
|------|------|------|------|------|------|
| 张三 | 28 | 前端工程师 | zhangsan@example.com | 技术部 | 在职 |
| 李四 | 32 | 后端工程师 | lisi@example.com | 技术部 | 在职 |
| 王五 | 25 | UI设计师 | wangwu@example.com | 设计部 | 在职 |
| 赵六 | 30 | 产品经理 | zhaoliu@example.com | 产品部 | 离职 |

### 项目进度表

| 项目名称 | 开始日期 | 预计完成 | 实际完成 | 进度 | 负责人 |
|---------|---------|---------|---------|------|--------|
| AI 对话系统 | 2025-10-01 | 2025-10-31 | - | 85% | 张三 |
| 用户管理后台 | 2025-09-15 | 2025-10-15 | 2025-10-14 | 100% | 李四 |
| 移动端适配 | 2025-10-10 | 2025-11-10 | - | 45% | 王五 |

> 💡 **提示**: 在移动端上查看时,表格可以横向滚动。

## 🖼️ 图片懒加载和预览

### 示例图片

下面是一张示例图片（点击可放大预览）：

![示例图片](https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=800)

> 图片使用懒加载技术，只有在进入视口时才会加载，提升性能。

## 🔗 链接支持

### 内部链接
- [返回首页](/)
- [AI 对话](/notion-ai)

### 外部链接（带图标提示）
- [GitHub 仓库](https://github.com)
- [React 官方文档](https://react.dev)
- [Next.js 文档](https://nextjs.org)

## 📑 长内容折叠

### 折叠的引用块

> 这是一个很长的引用块示例。
> 
> 当引用块内容超过一定长度时，会自动显示"展开/收起"按钮。
> 
> 这样可以节省页面空间，提升阅读体验。
> 
> 用户可以根据需要选择是否查看完整内容。
> 
> 这是第五段内容。
> 
> 这是第六段内容，用于测试折叠功能。

### 普通引用块

> 这是一个普通的引用块，内容不多，不会显示折叠按钮。

## 💻 代码块

### JavaScript 示例

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Python 示例

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`

### 行内代码

使用 \`const greeting = "Hello World"\` 来定义一个常量。

## 📝 列表嵌套

### 有序列表

1. 第一层级
   1. 第二层级 A
   2. 第二层级 B
      1. 第三层级 A
      2. 第三层级 B
2. 第一层级继续
3. 完成

### 无序列表

- 前端技术栈
  - React 19
    - Hooks
    - Server Components
  - Next.js 15
    - App Router
    - Turbopack
- 后端技术栈
  - Node.js
  - Python
    - FastAPI
    - LangChain

## ✨ 文本样式

这是一段包含 **粗体文字**、*斜体文字*、~~删除线~~ 的文本。

你也可以使用 \`行内代码\` 来突出显示代码片段。

---

## 🎯 总结

这个 Markdown 渲染组件现在支持：

- ✅ 任务列表（复选框）
- 📊 响应式表格（横向滚动）
- 🖼️ 图片懒加载和点击预览
- 🔗 外部链接图标提示
- 📑 长内容自动折叠
- 💻 代码高亮和复制
- 🎨 完整的 GFM 支持

**体验更优，功能更强！** 🚀
`;

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-[var(--surface-base)]/80 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回首页</span>
            </Link>
            <HappyWoodsLogo size="sm" animated={false} />
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Markdown 渲染增强演示
          </h1>
          <p className="text-[var(--text-secondary)]">查看所有新增的 Markdown 渲染功能</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <MarkdownMessage content={demoContent} />
        </div>

        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">💡 测试建议</h3>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
            <li>点击图片查看放大预览效果</li>
            <li>在小屏幕上测试表格的横向滚动</li>
            <li>尝试点击长引用块的展开/收起按钮</li>
            <li>注意外部链接旁边的小图标</li>
            <li>查看任务列表的复选框样式</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
