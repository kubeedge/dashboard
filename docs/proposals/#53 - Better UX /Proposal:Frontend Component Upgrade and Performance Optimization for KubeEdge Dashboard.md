# Proposal: Frontend Component Upgrade and Performance Optimization for KubeEdge Dashboard

## 1. Background & Pain Points

KubeEdge Dashboard is a visual management platform tailored for edge computing scenarios. It serves as the primary interface for operations engineers to manage edge nodes, deploy applications, and monitor logs. As the core user-facing component of the KubeEdge project, it plays a crucial role in daily operation and maintenance tasks.

---

## Preliminary Analysis & Research

### Current Status of KubeEdge Dashboard:

* Built with **React**

* Refactored using **MUI**

* The project follows a structure like:

  ```
  /src
    /app
    /component
    /util
    /service
  ```

* Business tables are typically implemented using a **wrapped ProTable-style component**:

  * Column definitions, pagination, and backend requests are hardcoded within business pages
  * Form validation, empty states, and error handling are scattered across the codebase

* Style system needs improvement

* Layout lacks a unified template

* Internationalization (i18n) is not systematically implemented

---

### Summary of Issues:

* **Poor performance of form/table components**

  * `ProTable` and `TableView` experience lag with large datasets
  * Full rendering causes high memory usage and poor pagination experience

* **Inconsistent component design and high redundancy**

  * Tight coupling of form logic and UI makes reuse and maintenance difficult
  * Handling of pagination, queries, loading, empty, and error states is scattered

* **Inconsistent layout system**

  * Sidebar, topbar, and main content are manually composed
  * Lacks responsive breakpoints for different devices

* **Non-standardized styles and themes**

  * No usage of design tokens
  * No light/dark theme support
  * Style inconsistencies across pages

---

## 2. Project Objectives

This project aims to address the above high-priority issues with the following goals:

1️⃣ Systematically refactor `ProTable`, `TableView`, and related components to improve rendering performance and user interaction

2️⃣ Design configurable and reusable form/table APIs to reduce business logic duplication and maintenance cost

3️⃣ Introduce and adapt **MUI Dashboard Layout** to achieve responsive design and unified theme management

4️⃣ Establish a modern, scalable frontend component architecture to support future iterations

---

## 3. Scope & Out-of-Scope

### In-Scope:

* Optimization and refactoring of shared components such as `ProTable` and `TableView`
* Unified parameter interface design and abstraction
* Support for virtual scrolling, pagination cache, and on-demand loading
* Replace legacy layout with **MUI Dashboard Layout**

### Out-of-Scope:

* Backend API modifications
* New business logic features

---

## 4. Technical Plan & Development Roadmap

The following sections present the **analysis and design plan** based on the current codebase of the KubeEdge Dashboard.

---

### 4.1 Analysis of Current Implementation

* **Table/Form Component Issues**

  * `ProTable`/`TableView` are only thin wrappers; logic for columns, pagination, filtering, and API calls is scattered
  * No unified handling of loading, empty, or error states
  * Performance bottlenecks: full rendering, no caching, UI freezing

* **Layout Issues**

  * Sidebar, Topbar, and Content composed using raw `Box/Grid`
  * No responsive design with breakpoints
  * Missing `ThemeProvider` and design tokens for theming

* **Component Directory Issues**

  * Flat `/src/components` structure
  * Mix of atomic and business-level components
  * State logic is mixed with presentation layers

---

### 4.2 Refactoring Plan for ProTable / TableView

**Goal**: Design a **configurable, reusable, and shared** table/form component

**Key Design Points**:

* Separation of view and state logic

  * `useProTable` hook to manage pagination, filtering, sorting, and data fetching
  * Stateless functional components for UI layer
* Support for virtual scrolling

  * Integrate with `react-window`
  * Render only visible rows in the viewport
* Pagination cache

  * Store previously loaded pages to avoid redundant requests
* On-demand loading

  * Cascade selectors and dropdowns to fetch data asynchronously
* Unified status feedback

  * Unified `Loading`, `Empty`, `Error` handling
  * Support for i18n text

**Example Usage**:

```tsx
<ProTable
  columns={columns}
  request={fetchData}
  pagination={{ pageSize: 10 }}
  actionBar={<CustomActions />}
/>
```

---

### 4.3 Dynamic FormView Abstraction

**Goal**: Generate dynamic forms through schema definitions to reduce repetitive logic

**Design Plan**:

* Define fields with schema

  * `label`, `name`, `type`, `rules`, `options`, etc.
* Use `useFormState` hook for form state management
* Dynamically render input components

  * `Input`, `Select`, `DatePicker`, `Switch`
* Internationalization support

  * i18n for labels and validation messages

---

### 4.4 Directory Structure Optimization

**Current Issue**: Flat and tightly coupled component structure

**Proposed Structure**:

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

Benefits: Modular, decoupled, scalable for future growth

---

### 4.5 Introducing MUI Dashboard Layout

**Current Problems**:

* Handwritten `Drawer` and `Box` layout
* Scattered responsive logic
* Inconsistent styling across pages

**Proposed Solution**:

* Integrate **MUI Official Dashboard Layout**

  * Responsive breakpoints (`sm`/`md`/`lg`/`xl`)
* Use `ThemeProvider`

  * Standardize colors, fonts, spacing
  * Support for light/dark mode switching
* Align with Figma design system breakpoints

---

## 5. Development Timeline

| Timeframe       | Key Milestones                                                                    |
| --------------- | --------------------------------------------------------------------------------- |
| Jul 01 – Jul 14 | Codebase analysis and requirement research, backend API debugging                 |
| Jul 15 – Jul 21 | Technical proposal and team review, interface and parameter specification         |
| Jul 22 – Aug 14 | Refactor `ProTable`/`TableView` with state/view separation, unify status handling |
| Aug 15 – Sep 08 | Integrate MUI Dashboard Layout, design and implement `ThemeProvider` system       |
| Sep 09 – Sep 22 | Abstract shared component interfaces, define TypeScript types                     |
| Sep 23 – Sep 30 | Backend integration testing, final regression, and project delivery summary       |

---
