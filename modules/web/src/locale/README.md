# KubeEdge Dashboard Internationalization (i18n)

## 🌐 Overview

KubeEdge Dashboard now supports bilingual switching between Chinese and English, implementing complete internationalization (i18n) functionality.

## 📁 File Structure

```
src/
├── locale/
│   ├── index.ts          # i18n configuration file
│   ├── en.json          # English language pack
│   ├── zh.json          # Chinese language pack
│   └── README.md        # Documentation
├── hook/
│   └── useI18n.ts       # Internationalization hook
└── component/
    ├── I18nProvider/    # Internationalization provider component
    └── LanguageSwitcher/ # Language switcher component
```

## 🚀 Usage

### 1. Using Translations in Components

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

### 2. Language Switching

Users can switch between Chinese and English through the language switcher in the top navigation bar:

- 🇺🇸 English
- 🇨🇳 中文

### 3. Adding New Translation Keys

Add corresponding translations in both `en.json` and `zh.json`:

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

## 🎯 Feature Status

### ✅ Completed
- [x] Basic i18n framework setup
- [x] Chinese and English language packs
- [x] Language switcher component
- [x] Top navigation bar internationalization
- [x] Sidebar menu internationalization
- [x] Main page cards internationalization
- [x] Table component internationalization
- [x] Node page internationalization
- [x] Local storage language preference

### 🔄 In Progress
- [ ] All page components internationalization
- [ ] Form validation messages internationalization
- [ ] Error message internationalization
- [ ] Date time format localization

### 📋 Todo
- [ ] Number format localization
- [ ] Currency format localization
- [ ] Responsive design optimization
- [ ] Accessibility feature support

## 🛠️ Technical Implementation

### Dependencies
- `react-i18next`: React internationalization library
- `i18next`: Core internationalization library
- `i18next-browser-languagedetector`: Browser language detection

### Core Features
- **Automatic Language Detection**: Automatically selects based on browser language
- **Local Storage**: User language preference saved in localStorage
- **Dynamic Switching**: Real-time language switching without page refresh
- **Type Safety**: Complete TypeScript support

## 🎨 Design Principles

1. **Consistency**: All UI text centrally managed to ensure translation consistency
2. **Extensibility**: Easy to add new language support
3. **Performance Optimization**: Language packs loaded on demand
4. **User Experience**: Smooth language switching experience

## 📝 Development Guide

### Adding New Languages
1. Create new language file `src/locale/[locale].json`
2. Add language configuration in `src/locale/index.ts`
3. Update `LanguageSwitcher` component to support new language

### Best Practices
- Use semantic key names, e.g., `common.save` instead of `save`
- Keep translation key hierarchy structure clear
- Provide context comments for complex translations
- Regularly check and update translation content

## 🔧 Configuration Options

You can adjust configuration by modifying `src/locale/index.ts`:

```typescript
i18n.init({
  fallbackLng: 'en',        // Default language
  debug: false,             // Debug mode
  interpolation: {
    escapeValue: false,     // React already handles safely
  },
  detection: {
    order: ['localStorage', 'navigator'], // Detection order
    caches: ['localStorage'], // Cache method
  },
});
```

## 🌍 Localization Features

### Date and Time Formatting
- **Chinese Format**: `2024年1月15日 14:30`
- **English Format**: `Jan 15, 2024 2:30 PM`
- **Relative Time**: Supports Chinese/English relative time display

### Number Formatting
- **Chinese**: Uses Chinese thousand separators
- **English**: Uses English thousand separators
- **Percentage**: Localized percentage display

### Resource Formatting
- **Storage Size**: Supports Chinese/English units
- **CPU Resources**: Supports millicores and cores display
- **Memory Resources**: Automatic Kubernetes memory unit conversion

### Status Localization
- **Status Mapping**: Maps English statuses to Chinese equivalents
- **Supported Statuses**: Running/运行中, Pending/等待中, Failed/失败, etc.

## 📊 Table Localization

### Pagination
- **Chinese Labels**: `每页行数：`, `共 X 条`
- **English Labels**: `Rows per page:`, `of X`
- **Page Information**: Localized according to language habits

### Data Display
- **Image Display**: Uses Chip components with truncation support
- **Label Display**: Limits display count with `+N more` for excess
- **Status Display**: Uses colored Chips with Chinese/English support
- **Resource Display**: Localized CPU and memory resource display

## 🎯 User Experience Improvements

1. **Chinese User Friendly**: Dates, numbers, and statuses displayed according to Chinese habits
2. **Visual Optimization**: Uses Chip components, layered display, color coding
3. **Interaction Improvements**: Better button styles and responsive layout
4. **Information Density**: Reasonable text truncation and ellipsis display