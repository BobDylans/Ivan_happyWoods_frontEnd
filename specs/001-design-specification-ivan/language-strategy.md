# Ivan_HappyWoods Design System - Language & Content Strategy

**Document Type**: Design Guidelines  
**Created**: 2025-10-15  
**Status**: Active

## Language Strategy

### Overview

The Ivan_HappyWoods design system follows a bilingual strategy that balances international aesthetics with local usability.

### Primary Principle: English for Content, Chinese for Actions

**English Usage (Primary)**
- Headlines and page titles
- Descriptions and explanatory text
- Marketing copy and brand messaging
- Component showcase labels
- Design principle descriptions
- Documentation and technical content
- Success/error message descriptions

**Chinese Usage (Functional)**
- Action buttons and CTAs (e.g., "开始探索", "查看文档", "加载中...")
- Form labels and input placeholders
- Status indicators (e.g., "已禁用", "已完成")
- Navigation menu items
- Confirmation prompts
- Toast notifications
- Critical user feedback

### Rationale

1. **Modern Aesthetic**: English headlines create a contemporary, international feel that aligns with the design system's sophisticated visual language
2. **Clarity for Actions**: Chinese functional text ensures Chinese-speaking users can quickly understand and complete actions without hesitation
3. **Brand Positioning**: Positions the interface as globally-minded while remaining accessible to the local market
4. **User Experience**: Combines aspirational design with practical usability

### Examples

#### ✅ Good
```tsx
// English headline, Chinese action
<h1>Welcome to HappyWoods</h1>
<Button>开始探索</Button>

// English description, Chinese status
<p>A warm, natural, and intelligent design system</p>
<Badge>加载中...</Badge>

// English section title, Chinese form label
<h2>Design Principles</h2>
<Label>用户名</Label>
```

#### ❌ Avoid
```tsx
// All Chinese (loses modern aesthetic)
<h1>欢迎来到 HappyWoods</h1>
<p>一个温暖、自然、智能的设计系统</p>

// All English (reduces clarity for actions)
<Button>Start Exploring</Button>
<Label>Username</Label>
<Badge>Loading...</Badge>
```

### Implementation Guidelines

#### For Developers

1. **Component Props**: Use `label` for Chinese functional text, `title` for English content
2. **Page Structure**: 
   - Use English for `<h1>`, `<h2>`, `<h3>` tags
   - Use Chinese for `<Button>`, form `<Label>`, status `<Badge>` tags
3. **Localization**: Store functional Chinese text in i18n files for future multi-language support
4. **Consistency**: Follow the examples in the main demo page (`src/app/page.tsx`)

#### For Designers

1. **Mockups**: Label mockups with mixed language to reflect final implementation
2. **Copy Deck**: Specify which copy is English vs. Chinese in design specifications
3. **Testing**: Ensure both languages are legible and well-balanced in visual hierarchy

#### For Content Writers

1. **Headlines**: Write in English (translate conceptually, not literally)
2. **Descriptions**: Write in English with clear, simple language
3. **Actions**: Write in Chinese with direct, action-oriented language
4. **Consistency**: Maintain consistent terminology across the application

### Edge Cases

**Code Examples in Documentation**
- Code itself: English
- Explanations: English
- Button labels in code: Chinese (as they would appear in production)

**Mixed Sentences**
- Avoid mixing languages within a single sentence
- If necessary, use English as the primary language with Chinese terms in parentheses

**Proper Nouns**
- "HappyWoods" brand name: Always English
- Feature names: English
- UI component names: English in code, can be Chinese in user-facing descriptions

### Future Considerations

**Full Internationalization (i18n)**
- When adding full i18n support, maintain the "English content, local action" pattern
- Content translations should feel natural, not literal
- Action text should always use the user's native language

**Dark Mode**
- Language strategy remains the same regardless of color theme

**Accessibility**
- Ensure screen readers properly handle language switching
- Use `lang` attributes appropriately: `<span lang="en">`, `<span lang="zh-CN">`

### Compliance Checklist

Before releasing a new page or component:
- [ ] Headlines use English
- [ ] Action buttons use Chinese
- [ ] Descriptions use English
- [ ] Status indicators use Chinese
- [ ] Language ratio feels balanced (roughly 70% English, 30% Chinese by character count)
- [ ] Both languages are clearly legible with current typography settings
- [ ] No awkward language mixing within single UI elements

---

**Last Updated**: 2025-10-15  
**Version**: 1.0.0

This guideline is part of the Ivan_HappyWoods design system and should be followed for all interface development.
