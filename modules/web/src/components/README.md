# 组件目录结构

本目录包含了所有React组件的模块化组织，按照功能职责进行清晰分类。

## 目录结构

### 📁 Dialog/
所有对话框和弹窗组件，包括详情查看和编辑对话框。

**包含组件：**
- `YAMLViewerDialog` - YAML内容查看器
- `SecretDetailDialog` - Secret详情对话框
- `NodeDetailDialog` - Node详情对话框
- `KeinkDialog` - Keink相关对话框
- `DeviceModelDetailDialog` - 设备模型详情对话框
- `DeviceDetailDialog` - 设备详情对话框
- `DeploymentDetailDialog` - 部署详情对话框
- `ConfigmapDetailDialog` - ConfigMap详情对话框

### 📁 Form/
所有表单和添加/编辑对话框组件。

**包含组件：**
- `AddServiceDialog` - 添加服务对话框
- `AddServiceAccountDialog` - 添加服务账户对话框
- `AddSecretDialog` - 添加密钥对话框
- `AddRuleEndpointDialog` - 添加规则端点对话框
- `AddRuleDialog` - 添加规则对话框
- `AddRoleDialog` - 添加角色对话框
- `AddRoleBindingDialog` - 添加角色绑定对话框
- `AddNodeGroupDialog` - 添加节点组对话框
- `AddNodeDialog` - 添加节点对话框
- `AddEdgeApplicationDialog` - 添加边缘应用对话框
- `AddDeviceModelDialog` - 添加设备模型对话框
- `AddDeviceDialog` - 添加设备对话框
- `AddConfigmapDialog` - 添加配置映射对话框
- `AddClusterRoleDialog` - 添加集群角色对话框
- `AddClusterRoleBindingDialog` - 添加集群角色绑定对话框

### 📁 Table/
所有表格相关组件。

**包含组件：**
- `VirtualTable` - 虚拟表格组件
- `ProTable` - 专业表格组件
- `PodTable` - Pod表格组件

### 📁 Layout/
所有布局相关组件。

**包含组件：**
- `Layout` - 主布局组件
- `AppHeader` - 应用头部组件
- `SideNav` - 侧边导航组件
- `AppContext` - 应用上下文组件

### 📁 Common/
所有通用和可复用组件。

**包含组件：**
- `VersionCard` - 版本信息卡片
- `TableCard` - 表格卡片容器
- `StatusFeedback` - 状态反馈组件
- `StatusCard` - 状态卡片
- `SideNav` - 侧边导航
- `SSEOutputArea` - SSE输出区域
- `ProgressRing` - 进度环
- `ProgressCard` - 进度卡片
- `DeploymentDrawer` - 部署抽屉
- `CascadeSelect` - 级联选择器
- `AppHeader` - 应用头部
- `AppContext` - 应用上下文

### 📁 FormView/
表单视图相关组件。

## 使用方式

### 导入组件
```typescript
// 从特定模块导入
import { YAMLViewerDialog } from '@/components/Dialog';
import { AddServiceDialog } from '@/components/Form';
import { ProTable } from '@/components/Table';

// 从主索引导入
import { YAMLViewerDialog, AddServiceDialog, ProTable } from '@/components';
```

### 模块化优势
1. **清晰的职责分离** - 每个目录都有明确的用途
2. **易于维护** - 相关组件集中管理
3. **更好的可扩展性** - 新增组件可以轻松归类
4. **团队协作友好** - 不同开发者可以专注于不同模块
5. **导入路径清晰** - 从路径就能看出组件类型

## 迁移说明

本结构是从原来的 `component/` 目录迁移而来，所有导入路径已自动更新为新的模块化路径。
