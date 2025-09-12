# KubeEdge Dashboard 国际化实现指南

## 概述

本文档详细说明了如何将 KubeEdge Dashboard 从纯英文界面改造为支持中英文切换的国际化应用。

## 技术栈

- **React i18next**: 国际化框架
- **i18next-browser-languagedetector**: 浏览器语言检测
- **MUI Localization**: Material-UI 组件本地化
- **Next.js**: 前端框架

## 实现步骤

### 1. 安装依赖包

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

### 2. 创建语言资源文件

#### 2.1 创建英文资源文件 `src/locale/en.json`

```json
{
    "actions": {
        "add": "Add",
        "edit": "Edit", 
        "delete": "Delete",
        "save": "Save",
        "cancel": "Cancel",
        "confirm": "Confirm",
        "create": "Create",
        "update": "Update",
        "view": "View",
        "refresh": "Refresh",
        "submit": "Submit",
        "search": "Search"
    },
    "table": {
        "name": "Name",
        "namespace": "Namespace",
        "status": "Status",
        "age": "Age",
        "creationTime": "Creation Time",
        "actions": "Actions",
        "operation": "Operation",
        "rowsPerPage": "Rows per page:",
        "of": "of",
        "page": "Page"
    },
    "form": {
        "required": "This field is required",
        "invalidFormat": "Invalid format",
        "namePlaceholder": "Enter name",
        "namespacePlaceholder": "Select namespace"
    },
    "navigation": {
        "overview": "Overview",
        "workloads": "Workloads",
        "networking": "Networking",
        "storage": "Storage",
        "configuration": "Configuration",
        "accessControl": "Access Control",
        "edgeManagement": "Edge Management",
        "system": "System"
    },
    "common": {
        "dashboard": "Dashboard",
        "english": "English",
        "chinese": "Chinese",
        "node": "Node",
        "service": "Service",
        "deployment": "Deployment"
    }
}
```

#### 2.2 创建中文资源文件 `src/locale/zh.json`

```json
{
    "actions": {
        "add": "添加",
        "edit": "编辑",
        "delete": "删除", 
        "save": "保存",
        "cancel": "取消",
        "confirm": "确认",
        "create": "创建",
        "update": "更新",
        "view": "查看",
        "refresh": "刷新",
        "submit": "提交",
        "search": "搜索"
    },
    "table": {
        "name": "名称",
        "namespace": "命名空间",
        "status": "状态",
        "age": "创建时间",
        "creationTime": "创建时间",
        "actions": "操作",
        "operation": "操作",
        "rowsPerPage": "每页行数：",
        "of": "共",
        "page": "页"
    },
    "form": {
        "required": "此字段为必填项",
        "invalidFormat": "格式无效",
        "namePlaceholder": "请输入名称",
        "namespacePlaceholder": "请选择命名空间"
    },
    "navigation": {
        "overview": "概览",
        "workloads": "工作负载",
        "networking": "网络",
        "storage": "存储",
        "configuration": "配置",
        "accessControl": "访问控制",
        "edgeManagement": "边缘管理",
        "system": "系统"
    },
    "common": {
        "dashboard": "仪表板",
        "english": "英文",
        "chinese": "中文",
        "node": "节点",
        "service": "服务",
        "deployment": "部署"
    }
}
```

### 3. 配置 i18next

#### 3.1 创建配置文件 `src/locale/index.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import zh from './zh.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    react: {
      useSuspense: false, // 禁用Suspense，避免SSR问题
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
```

### 4. 创建自定义 Hook

#### 4.1 创建 `src/hook/useI18n.ts`

```typescript
import { useTranslation } from 'react-i18next';

export function useI18n() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };
  
  const getCurrentLanguage = () => {
    return i18n.language;
  };
  
  const isChineseLanguage = () => {
    return i18n.language.startsWith('zh');
  };
  
  return { 
    t, 
    i18n, 
    changeLanguage, 
    getCurrentLanguage, 
    isChineseLanguage 
  };
}
```

### 5. 创建国际化提供者

#### 5.1 创建 `src/component/I18nProvider/index.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locale';

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // 确保i18next完全初始化
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsReady(true);
      });
    }

    return () => {
      i18n.off('initialized');
    };
  }, []);

  // 在服务器端或未挂载时不渲染
  if (!isMounted || !isReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;
```

### 6. 创建语言切换器

#### 6.1 创建 `src/component/LanguageSwitcher/index.tsx`

```typescript
'use client';

import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { useI18n } from '@/hook/useI18n';

const LanguageSwitcher: React.FC = () => {
  const { getCurrentLanguage, changeLanguage, t } = useI18n();

  const handleLanguageChange = (event: any) => {
    changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 80 }}>
      <Select
        value={getCurrentLanguage()}
        onChange={handleLanguageChange}
        displayEmpty
        sx={{
          color: 'white',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        <MenuItem value="zh">{t('common.chinese')}</MenuItem>
        <MenuItem value="en">{t('common.english')}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
```

### 7. 添加 MUI 本地化支持

#### 7.1 修改 `src/component/Layout/index.tsx`

```typescript
'use client'

import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';
import SideNav from "@/component/SideNav";
import { AppHeader } from "@/component/AppHeader";
import { menu } from "@/config/menu";
import { AppProvider } from '@/component/AppContext';
import I18nProvider from '@/component/I18nProvider';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/hook/useI18n';

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isChineseLanguage } = useI18n();
  
  // 创建主题，根据语言选择MUI本地化
  const theme = React.useMemo(
    () => createTheme({}, isChineseLanguage() ? zhCN : enUS),
    [isChineseLanguage]
  );

  if (pathname === '/login') {
    return (
      <ThemeProvider theme={theme}>
        <AppProvider>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 0, width: '100%', height: '100vh' }}
          >
            {children}
          </Box>
        </AppProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AppProvider>
          <CssBaseline />
          <AppHeader />
          <Box>
            <SideNav items={menu} />
          </Box>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - 240px)` }, marginTop: '50px' }}
          >
            {children}
          </Box>
        </AppProvider>
      </Box>
    </ThemeProvider>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nProvider>
      <LayoutContent>{children}</LayoutContent>
    </I18nProvider>
  );
};

export default Layout;
```

### 8. 在组件中使用翻译

#### 8.1 页面组件示例

```typescript
'use client';

import React from 'react';
import { Box } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { useI18n } from '@/hook/useI18n';

export default function NodePage() {
  const { t } = useI18n();

  const columns: ColumnDefinition<Node>[] = [
    {
      name: t('table.name'),
      render: (node) => node?.metadata?.name,
    },
    {
      name: t('table.status'),
      render: (node) => node?.status?.phase,
    },
    {
      name: t('table.creationTime'),
      render: (node) => node?.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.node')}
          addButtonLabel={t('actions.add') + ' ' + t('common.node')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
        />
      </Box>
    </Box>
  );
}
```

#### 8.2 对话框组件示例

```typescript
'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import { useI18n } from '@/hook/useI18n';

const AddNodeDialog = ({ open, onClose, onSubmit }) => {
  const { t } = useI18n();
  const [name, setName] = useState('');

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('actions.add')} {t('common.node')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('table.name')}
          placeholder={t('form.namePlaceholder')}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          helperText={!name && t('table.missingName')}
          fullWidth
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
          <Button onClick={onClose}>{t('actions.cancel')}</Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {t('actions.submit')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddNodeDialog;
```

### 9. 动态翻译下拉选项

对于需要动态翻译的下拉选项，使用模板字符串：

```typescript
// 在语言文件中定义命名空间
{
  "dataTypes": {
    "int": "Integer",
    "string": "String", 
    "boolean": "Boolean"
  }
}

// 在组件中使用
const dataTypes = ['int', 'string', 'boolean'];

{dataTypes.map((type) => (
  <MenuItem key={type} value={type}>
    {t(`dataTypes.${type}`)}
  </MenuItem>
))}
```

### 10. 处理 SSR 水合问题

为了避免 Next.js 的 SSR 水合不匹配错误：

1. **在 i18next 配置中禁用 Suspense**：
   ```typescript
   react: {
     useSuspense: false,
   }
   ```

2. **在 I18nProvider 中处理挂载状态**：
   ```typescript
   const [isMounted, setIsMounted] = useState(false);
   
   useEffect(() => {
     setIsMounted(true);
   }, []);
   
   if (!isMounted || !isReady) {
     return null;
   }
   ```

## 翻译键组织结构

我们按照功能模块组织翻译键：

```
├── actions/          # 动作按钮（添加、编辑、删除等）
├── table/           # 表格相关（列名、分页等）
├── form/            # 表单相关（标签、占位符、验证等）
├── navigation/      # 导航菜单
├── common/          # 通用术语
├── status/          # 状态相关
├── dataTypes/       # 数据类型
├── serviceTypes/    # 服务类型
└── ruleEndpointTypes/ # 规则端点类型
```

## 已完成的国际化模块

### 页面组件
- ✅ Dashboard（仪表板）
- ✅ Node（节点）
- ✅ Deployment（部署）
- ✅ Service（服务）
- ✅ ConfigMap（配置映射）
- ✅ Secret（密钥）
- ✅ Role（角色）
- ✅ RoleBinding（角色绑定）
- ✅ NodeGroup（节点组）
- ✅ ClusterRole（集群角色）
- ✅ ClusterRoleBinding（集群角色绑定）
- ✅ CRD（自定义资源定义）
- ✅ Device（设备）
- ✅ DeviceModel（设备模型）
- ✅ EdgeApplication（边缘应用）
- ✅ Rule（规则）
- ✅ RuleEndpoint（规则端点）
- ✅ ServiceAccount（服务账户）

### 对话框组件
- ✅ AddNodeDialog（添加节点对话框）
- ✅ AddNodeGroupDialog（添加节点组对话框）
- ✅ AddRoleDialog（添加角色对话框）
- ✅ AddRoleBindingDialog（添加角色绑定对话框）
- ✅ AddClusterRoleDialog（添加集群角色对话框）
- ✅ AddClusterRoleBindingDialog（添加集群角色绑定对话框）
- ✅ AddServiceDialog（添加服务对话框）
- ✅ AddServiceAccountDialog（添加服务账户对话框）
- ✅ AddSecretDialog（添加密钥对话框）
- ✅ AddConfigmapDialog（添加配置映射对话框）
- ✅ AddEdgeApplicationDialog（添加边缘应用对话框）
- ✅ AddDeviceDialog（添加设备对话框）
- ✅ AddDeviceModelDialog（添加设备模型对话框）
- ✅ AddRuleEndpointDialog（添加规则端点对话框）
- ✅ AddRuleDialog（添加规则对话框）

### 特殊组件
- ✅ DeploymentDrawer（部署抽屉，包含4个步骤的表单）
- ✅ LanguageSwitcher（语言切换器）
- ✅ TableCard（表格卡片，包含分页器本地化）

## 最佳实践

### 1. 翻译键命名规范
- 使用小驼峰命名法
- 按功能模块分组
- 保持键名简洁明了
- 避免重复键名

### 2. 翻译文本规范
- 保持翻译准确性
- 考虑上下文语境
- 统一专业术语
- 保持简洁性

### 3. 组件使用规范
- 在组件顶部导入 `useI18n`
- 统一使用 `t()` 函数进行翻译
- 对于动态内容使用模板字符串
- 为表单验证添加翻译

### 4. 性能优化
- 使用 `React.useMemo` 缓存主题配置
- 避免在渲染循环中调用翻译函数
- 合理组织翻译键结构

## 故障排除

### 1. SSR 水合不匹配
**问题**：`Text content did not match. Server: "Dashboard" Client: "仪表板"`

**解决方案**：
- 在 i18next 配置中设置 `useSuspense: false`
- 在 I18nProvider 中处理挂载状态
- 确保服务端和客户端初始渲染一致

### 2. 翻译不生效
**问题**：翻译键显示为原始键名

**解决方案**：
- 检查翻译键是否存在于语言文件中
- 确认组件已正确导入 `useI18n`
- 验证 I18nProvider 是否正确包裹组件

### 3. MUI 组件未本地化
**问题**：TablePagination 等 MUI 组件仍显示英文

**解决方案**：
- 确认已导入 MUI 本地化包
- 检查 ThemeProvider 是否正确配置
- 验证主题创建逻辑

## 总结

通过以上步骤，我们成功将 KubeEdge Dashboard 改造为支持中英文切换的国际化应用。主要特点：

1. **完整的国际化支持**：所有页面、对话框、表单都支持中英文切换
2. **动态语言切换**：用户可以实时切换语言，无需刷新页面
3. **MUI 组件本地化**：包括分页器、日期选择器等 MUI 组件
4. **SSR 兼容**：解决了 Next.js SSR 水合不匹配问题
5. **良好的开发体验**：提供了简洁的 API 和清晰的文件结构
6. **可扩展性**：易于添加新的语言支持

该方案为 KubeEdge Dashboard 提供了专业级的国际化解决方案，提升了用户体验和产品的国际化水平。
