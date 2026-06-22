# Component Directory Structure

This directory contains all React components, organized in a modular way and clearly categorized by functional responsibility.

## Directory Overview

### 📁 Dialog/
All dialog and modal components, including detail viewers and edit dialogs.

**Includes components:**
- `YAMLViewerDialog` - YAML content viewer  
- `SecretDetailDialog` - Secret detail dialog  
- `NodeDetailDialog` - Node detail dialog  
- `KeinkDialog` - Keink-related dialog  
- `DeviceModelDetailDialog` - Device model detail dialog  
- `DeviceDetailDialog` - Device detail dialog  
- `DeploymentDetailDialog` - Deployment detail dialog  
- `ConfigmapDetailDialog` - ConfigMap detail dialog  

---

### 📁 Form/
All form-related components, including add/edit dialogs.

**Includes components:**
- `AddServiceDialog` - Add service dialog  
- `AddServiceAccountDialog` - Add service account dialog  
- `AddSecretDialog` - Add secret dialog  
- `AddRuleEndpointDialog` - Add rule endpoint dialog  
- `AddRuleDialog` - Add rule dialog  
- `AddRoleDialog` - Add role dialog  
- `AddRoleBindingDialog` - Add role binding dialog  
- `AddNodeGroupDialog` - Add node group dialog  
- `AddNodeDialog` - Add node dialog  
- `AddEdgeApplicationDialog` - Add edge application dialog  
- `AddDeviceModelDialog` - Add device model dialog  
- `AddDeviceDialog` - Add device dialog  
- `AddConfigmapDialog` - Add ConfigMap dialog  
- `AddClusterRoleDialog` - Add cluster role dialog  
- `AddClusterRoleBindingDialog` - Add cluster role binding dialog  

---

### 📁 Table/
All table-related components.

**Includes components:**
- `VirtualTable` - Virtualized table component  
- `ProTable` - Advanced table component  
- `PodTable` - Pod table component  

---

### 📁 Layout/
All layout-related components.

**Includes components:**
- `Layout` - Main layout component  
- `AppHeader` - Application header  
- `SideNav` - Sidebar navigation  
- `AppContext` - Application context component  

---

### 📁 Common/
All common and reusable components.

**Includes components:**
- `VersionCard` - Version info card  
- `TableCard` - Table container card  
- `StatusFeedback` - Status feedback component  
- `StatusCard` - Status display card  
- `SideNav` - Sidebar navigation  
- `SSEOutputArea` - SSE output area  
- `ProgressRing` - Progress ring  
- `ProgressCard` - Progress card  
- `DeploymentDrawer` - Deployment drawer  
- `CascadeSelect` - Cascading selector  
- `AppHeader` - Application header  
- `AppContext` - Application context  

---

### 📁 FormView/
Components related to form views.

---

## Usage

### Importing Components
```typescript
// Import from specific modules
import { YAMLViewerDialog } from '@/components/Dialog';
import { AddServiceDialog } from '@/components/Form';
import { ProTable } from '@/components/Table';

// Import from the main index
import { YAMLViewerDialog, AddServiceDialog, ProTable } from '@/components';
