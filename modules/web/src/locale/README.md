# KubeEdge Dashboard 国际化功能

## 🌐 概述

KubeEdge Dashboard 现已支持中英文双语切换，实现了完整的国际化(i18n)功能。

## 📁 文件结构

```
src/
├── locale/
│   ├── index.ts          # i18n 配置文件
│   ├── en.json          # 英文语言包
│   ├── zh.json          # 中文语言包
│   └── README.md        # 说明文档
├── hook/
│   └── useI18n.ts       # 国际化 Hook
└── component/
    ├── I18nProvider/    # 国际化提供者组件
    └── LanguageSwitcher/ # 语言切换器组件
```

## 🚀 使用方法

### 1. 在组件中使用翻译

```tsx
import { useI18n } from '@/hook/useI18n';

function MyComponent() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('common.dashboard')}</h1>
      <button>{t('actions.add')}</button>
    </div>
  );
}
```

### 2. 语言切换

用户可以通过顶部导航栏的语言切换器在中英文之间切换：

- 🇺🇸 English
- 🇨🇳 中文

### 3. 添加新的翻译键

在 `en.json` 和 `zh.json` 中添加相应的翻译：

**en.json:**
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

**zh.json:**
```json
{
  "newSection": {
    "title": "新标题",
    "description": "新描述"
  }
}
```

## 🎯 已支持的功能

### ✅ 已完成
- [x] 基础国际化框架搭建
- [x] 中英文语言包
- [x] 语言切换组件
- [x] 顶部导航栏国际化
- [x] 侧边栏菜单国际化
- [x] 主页面卡片国际化
- [x] 表格组件国际化
- [x] 节点页面国际化
- [x] 本地存储语言偏好

### 🔄 进行中
- [ ] 所有页面组件国际化
- [ ] 表单验证消息国际化
- [ ] 错误提示消息国际化
- [ ] 日期时间格式本地化

### 📋 待实现
- [ ] 数字格式本地化
- [ ] 货币格式本地化
- [ ] 响应式设计优化
- [ ] 无障碍功能支持

## 🛠️ 技术实现

### 依赖包
- `react-i18next`: React 国际化库
- `i18next`: 核心国际化库
- `i18next-browser-languagedetector`: 浏览器语言检测

### 核心特性
- **自动语言检测**: 根据浏览器语言自动选择
- **本地存储**: 用户语言偏好保存在 localStorage
- **动态切换**: 实时切换语言无需刷新页面
- **类型安全**: 完整的 TypeScript 支持

## 🎨 设计原则

1. **一致性**: 所有UI文本统一管理，确保翻译一致性
2. **可扩展性**: 易于添加新语言支持
3. **性能优化**: 按需加载语言包
4. **用户体验**: 平滑的语言切换体验

## 📝 开发指南

### 添加新语言
1. 创建新的语言文件 `src/locale/[locale].json`
2. 在 `src/locale/index.ts` 中添加语言配置
3. 更新 `LanguageSwitcher` 组件支持新语言

### 最佳实践
- 使用语义化的键名，如 `common.save` 而不是 `save`
- 保持翻译键的层级结构清晰
- 为复杂的翻译提供上下文注释
- 定期检查和更新翻译内容

## 🔧 配置选项

可以通过修改 `src/locale/index.ts` 来调整配置：

```typescript
i18n.init({
  fallbackLng: 'en',        // 默认语言
  debug: false,             // 调试模式
  interpolation: {
    escapeValue: false,     // React 已安全处理
  },
  detection: {
    order: ['localStorage', 'navigator'], // 检测顺序
    caches: ['localStorage'], // 缓存方式
  },
});
```
