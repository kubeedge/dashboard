# Proposal: Frontend Component Upgrade and Performance Optimization for KubeEdge Dashboard

---

## 1. 背景与痛点

KubeEdge Dashboard 是面向边缘计算场景的可视化管理平台，支撑运维工程师进行节点管理、应用部署、日志监控等关键操作，是整个 KubeEdge 项目的核心用户接口。

---

## 前期分析与调研

### KubeEdge Dashboard 的实际现状：

* 基于 React
* 用 MUI 进行重构过
* 目录结构大致是：

  ```
  /src
    /pages
    /components
    /utils
    /services
  ```
* 业务表格组件通常是「ProTable 风格的包装」

  * 列定义 / 分页参数 / 后端请求在业务页面里写死
  * 表单校验、空状态、错误处理分散在各处
* 样式系统需要优化
* 布局没有统一 Layout 模板
* 国际化没有系统的 i18n 实现

---
### 总结如下：

* **表单表格组件性能不足**

  * ProTable / TableView 渲染大数据时卡顿
  * 全量渲染导致内存占用高，用户翻页体验差

* **组件设计不一致、重复度高**

  * 表单逻辑和视图层耦合，难以拆分
  * 分页、查询、Loading、Empty、Error 状态处理分散在各个页面

* **布局系统不统一**

  * 侧边栏、顶栏、主内容区域布局拼装
  * 缺乏响应式断点设计

* **样式和主题缺少标准化**

  * 没有 Design Tokens
  * 无深浅色模式支持
  * 跨页面风格不统一

---

## 2. 项目目标

本项目聚焦解决上述高优先级痛点，目标是：

1️⃣ 对 ProTable、TableView 等表单表格组件进行系统性重构，提升渲染性能和用户交互体验

2️⃣ 设计可配置、公用的表单和表格接口，降低业务接入和维护成本

3️⃣ 引入并适配 MUI v5 的 Dashboard Layout 模板，实现响应式布局和统一的主题管理

4️⃣ 建立现代化、可扩展的前端组件架构，为未来迭代打下基础

---

## 3. 项目范围与不做范围

本项目包含：

* ProTable、TableView 等公用表单表格组件优化和重构
* 统一参数接口设计和抽象
* 支持虚拟滚动、分页缓存、按需加载
* MUI Dashboard Layout 替换旧有布局

❌ 本项目不包括：

* 后端接口改造
* 业务逻辑层需求新增

---

## 4. 技术方案与开发计划

以下部分基于 KubeEdge Dashboard 当前代码架构的**分析和设计方案**。

---

### 4.1 现有代码现状分析

* **表单表格问题**

  * ProTable / TableView 只是简单封装，业务页面里 columns、分页、查询、接口请求逻辑分散
  * 没有 Loading / Empty / Error 状态统一设计
  * 性能瓶颈：全量渲染、无缓存、卡顿严重

* **布局层问题**

  * Sidebar、Topbar、Content 是自己拼装的 Box/Grid
  * 没有响应式断点设计，适配差
  * 缺少统一 ThemeProvider 和 Design Token

* **组件目录问题**

  * /src/components 层级扁平
  * 原子组件、业务表单组件混在一起
  * 状态逻辑与视图层没有分离

---

### 4.2 ProTable / TableView 重构计划

**目标**：设计「可配置、可复用、公用」表单表格组件

**核心设计点：**

* 视图和状态逻辑分离

  * useProTable Hook 管理分页、过滤、排序、接口请求
  * 视图层纯无状态函数组件
* 支持虚拟滚动

  * react-window 集成
  * 仅渲染可视区域行
* 分页缓存

  * 记录已加载的数据页
  * 避免同条件下重复请求
* 按需加载

  * 级联选择器、下拉菜单按需异步加载
* 统一状态反馈

  * Loading、Empty、Error 统一封装
  * 支持国际化文本

**示例业务调用接口：**

```tsx
<ProTable
  columns={columns}
  request={fetchData}
  pagination={{ pageSize: 10 }}
  actionBar={<CustomActions />}
/>
```

---

### 4.3 FormView 动态表单抽象

**目标**：通过配置生成动态表单，减少手写表单逻辑

**设计方案：**

* Schema 定义字段

  * label、name、type、rules、options
* 状态管理 Hook

  * useFormState
* 动态渲染

  * Input、Select、DatePicker、Switch
* 国际化支持

  * 多语言标签和错误提示

---

### 4.4 目录结构优化

**现有问题**：组件目录扁平、耦合
**计划改造：**

```
/src
  /components
    /ProTable
      ProTable.tsx
      useProTable.ts
      types.ts
    /FormView
    /Layout
  /theme
  /locales
```

特点：模块化清晰、逻辑分离、方便扩展

---

### 4.5 MUI Dashboard Layout 引入

**现状问题**

* 自写 Drawer 和 Box
* 响应式逻辑零散
* 风格不统一

**方案**

* 引入 MUI v5 官方 Dashboard Layout 模板

  * Sidebar / Topbar / MainContent
  * 可收起展开
  * 响应式断点（sm/md/lg/xl）
* ThemeProvider

  * 统一色彩、字体、间距
  * 深浅色模式切换
* 与 Figma 设计断点保持一致

---

## 5. 开发阶段计划

| 时间段           | 主要任务                                               |
| ------------- | -------------------------------------------------- |
| 07.01 – 07.14 | 现状分析与需求调研，后端接口调试                            |
| 07.15 – 07.21 | 技术方案设计与团队评审，参数接口定义                                 |
| 07.22 – 08.14 | ProTable/TableView 状态逻辑分离，Loading/Empty/Error 统一处理 |
| 08.15  – 09.08 | 引入并适配 MUI Dashboard Layout，ThemeProvider 主题系统设计    |
| 09.09 – 09.22 | 公用组件接口抽象，TypeScript 类型定义         |
| 09.23 – 09.30 | 与后端联调，回归测试，最终交付总结报告                           |
