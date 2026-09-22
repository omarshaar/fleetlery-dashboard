# 🎯 EANO Framework - AI Instructions

> **Project Type**: Admin UI Framework  
> **Stack**: React 18 + TypeScript + Vite + Tailwind + Shadcn UI  
> **Purpose**: Reusable framework for building admin dashboards and management interfaces

---

## 🧠 Core Understanding

You are working with **EANO Admin UI Framework**, not a standalone application. This is a **complete UI framework** that provides:

- 🎨 **80+ Pre-built Components** (Shadcn-based)
- 📝 **Dynamic Form Builder** (schema-driven)
- 📊 **Advanced DataTable Builder** (with sorting, filtering, export)
- 📁 **File Explorer** (Windows-like)
- 🔐 **Access Control System** (CASL-based)
- 🌍 **i18n Support** (AR/EN/DE with RTL)
- 📦 **Reusable Widgets** (Stats, Charts, KPIs)

---

## ⚠️ Critical Rules - ALWAYS FOLLOW

### 0. **🔴 STRICT: COMPONENT REUSE IS MANDATORY**

**BEFORE creating ANY component/widget/button, you MUST:**

1. **Search** `src/eano/components/` for existing alternatives
2. **Check** `src/eano/design-system/shadcn/` for pre-built UI
3. **Review** `src/components/` for existing custom components
4. **DECIDE** - Can existing components solve this? Use them!

**Component Creation is ONLY Allowed When:**
- ✅ No similar component exists in the framework
- ✅ Cannot be solved by composing existing components
- ✅ User explicitly requests it AND it's necessary
- ✅ It's a PAGE component in `src/pages/` (always needed)

**MUST REFUSE Component Creation If:**
- ❌ Similar component already exists
- ❌ Can be built by combining framework components
- ❌ Would duplicate framework functionality
- ❌ Creating UI elements (buttons, cards, modals) - use shadcn!

**Report Format Before Creating:**
```
COMPONENT EVALUATION:
- Searched: [paths searched]
- Found: [existing components]
- Decision: ✅ Reuse existing | ❌ Must create
- Reason: [justification]
```

**Examples of FORBIDDEN Component Creation:**
```typescript
// ❌ NEVER - Button exists
const MyButton = () => <button>...</button>
// ✅ USE - Framework button
import { Button } from '@/eano/design-system/shadcn'

// ❌ NEVER - Card exists
const MyCard = ({children}) => <div className="border">...</div>
// ✅ USE - Framework card
import { Card, CardContent } from '@/eano/design-system/shadcn'

// ❌ NEVER - Dialog exists
const MyModal = () => { ... }
// ✅ USE - Framework dialog
import { Dialog, DialogContent } from '@/eano/design-system/shadcn'

// ❌ NEVER - Badge exists
const Tag = ({label}) => <span>...</span>
// ✅ USE - Framework badge
import { Badge } from '@/eano/design-system/shadcn'
```

### 1. **NEVER Create from Scratch - ALWAYS Reuse**

```typescript
❌ DON'T: Create a new button component
✅ DO: Use import { Button } from "@/eano/design-system/shadcn/button"

❌ DON'T: Create custom form logic
✅ DO: Use DynamicForm with schema

❌ DON'T: Build a table from scratch
✅ DO: Use DataTable component

❌ DON'T: Create custom card/modal/dialog
✅ DO: Use pre-built components from @/eano/design-system/shadcn
```

### 2. **File Structure - Strict Hierarchy**

```
src/
├── eano/                    # ⛔ FRAMEWORK CODE - READ-ONLY
│   ├── components/          # Pre-built UI components (SEARCH HERE FIRST)
│   ├── form-builder/        # Form system (USE FOR ALL FORMS)
│   ├── data-table-builder/  # Table system (USE FOR ALL TABLES)
│   └── design-system/       # Shadcn components (MANDATORY FOR UI)
│
├── pages/                   # ✅ ADD NEW PAGES HERE (always needed)
├── components/              # ✅ ADD ONLY IF NOT IN eano/ (rare)
├── services/                # ✅ ADD API ENDPOINTS HERE
└── router/                  # ✅ REGISTER ROUTES HERE
```

### 3. **Import Patterns - ALWAYS Follow**

```typescript
// ✅ Correct Imports
import { Button, Input, Card } from "@/eano/design-system/shadcn/button"
import { DynamicForm } from "@/eano/form-builder"
import { DataTable } from "@/eano/data-table-builder"
import { StatMiniWidget } from "@/eano/components/widgets"
import { Can } from "@/eano/access-control"
import { useLanguage } from "@/i18n"

// ❌ Wrong - Never do this
import Button from "./components/Button"  // Don't create custom
```

---

## 📝 Form Builder - Schema-Based Approach

### When user asks to create a form, ALWAYS use DynamicForm:

```typescript
// ✅ CORRECT Pattern
import { DynamicForm } from "@/eano/form-builder"
import type { FormField } from "@/eano/form-builder/types/form.types"

const myFormSchema: FormField[] = [
  {
    type: "container",
    grid: "12",
    className: "rounded-md p-4 border dark:bg-[#161616]",
    children: [
      {
        type: "input",
        name: "title",
        label: "Product Title",
        placeholder: "Enter title",
        grid: "12 md:6",
        validation: "required|min:3",
        props: { required: true }
      },
      {
        type: "select",
        name: "category",
        label: "Category",
        grid: "12 md:6",
        options: [
          { value: "electronics", label: "Electronics" },
          { value: "fashion", label: "Fashion" }
        ]
      },
      {
        type: "textarea",
        name: "description",
        label: "Description",
        grid: "12",
        validation: "required|min:10"
      }
    ]
  }
]

// Usage
<DynamicForm
  formId="product-form"
  schema={myFormSchema}
  onSubmit={handleSubmit}
  enableAutoSave
/>
```

### Available Field Types:
- `input` - Text input
- `textarea` - Multi-line text
- `select` - Dropdown
- `checkbox` - Single checkbox
- `radio` - Radio group
- `switch` - Toggle switch
- `datepicker` - Date selection
- `timepicker` - Time selection
- `file` - File upload
- `gallery` - Multiple images
- `rich-text` - WYSIWYG editor
- `container` - Group fields with grid layout
- `tabs` - Tabbed sections

### Grid System:
```typescript
grid: "12"           // Full width
grid: "6"            // Half width
grid: "12 md:6"      // Full on mobile, half on desktop
grid: "12 md:4"      // Full on mobile, 1/3 on desktop
```

### Validation:
```typescript
validation: "required"
validation: "required|min:3"
validation: "required|email"
validation: "required|min:6|max:20"
validation: "required|numeric|between:1,100"
```

---

## 📊 DataTable Builder - Advanced Tables

### When user asks for a table/list/data grid:

```typescript
// ✅ CORRECT Pattern
import { DataTable } from "@/eano/data-table-builder"
import type { ColumnConfig } from "@/eano/data-table-builder/types"

const columns: ColumnConfig<Product>[] = [
  {
    id: "image",
    header: "Image",
    accessorKey: "image",
    cell: "image",
    enableSorting: false
  },
  {
    id: "name",
    header: "Product Name",
    accessorKey: "name",
    cell: "text",
    enableSorting: true
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: "badge",
    enableSorting: true
  },
  {
    id: "price",
    header: "Price",
    accessorKey: "price",
    cell: "text",
    enableSorting: true
  }
]

// Usage - Preset Mode (Recommended)
<DataTable
  tableId="products-table"
  data={products}
  columns={columns}
  preset="advanced"  // Includes: sorting, filtering, search, export, pagination
/>

// Or - Boolean Shortcuts
<DataTable
  tableId="products-table"
  data={products}
  columns={columns}
  sorting
  filtering
  searching
  exporting
  pagination
/>
```

### Available Presets:
- `preset="basic"` - Just table + pagination
- `preset="standard"` - + sorting + searching
- `preset="advanced"` - + filtering + export + column visibility
- `preset="complete"` - Everything enabled

---

## 🎨 Widgets - Reusable Components

### When user needs stats/KPIs/metrics:

```typescript
// ✅ Available Widgets - NEVER recreate these
import {
  StatMiniWidget,
  ValueSummaryWidget,
  ProgressSummaryWidget,
  RadarWidget,
  PieDistributionWidget,
  WeeklyTasksWidget,
  ContributionMatrixWidget
} from "@/eano/components/widgets"

// Example Usage
<StatMiniWidget
  data={{
    title: "Total Revenue",
    value: "$45,231.89",
    growth: 20.1,
    subtitle: "+20.1% from last month"
  }}
  animated
  navigateTo="/revenue-details"
/>

<ValueSummaryWidget
  data={{
    title: "Monthly Sales",
    items: [
      { label: "Products", value: 1234 },
      { label: "Services", value: 567 }
    ]
  }}
/>
```

---

## 🛣️ Routing - Navigation System

### When adding new pages:

```typescript
// Step 1: Create page component in src/pages/
// File: src/pages/my-feature/MyFeaturePage.tsx
export default function MyFeaturePage() {
  return <div>My Feature</div>
}

// Step 2: Register route in src/router/index.ts
import { lazy } from "react"
const MyFeaturePage = lazy(() => import("@/pages/my-feature/MyFeaturePage"))

const routes: AppRoutes = [
  // ... existing routes
  {
    path: "/my-feature",
    title: "My Feature",
    component: MyFeaturePage,
    meta: {
      layout: "default", 
      permissions: ["view.MyFeature"]  // Optional: Access control
    }
  }
]

// Step 3: (Optional) Add to navigation in src/router/navigation-data.ts
```

**Layouts Available:**
- `layout: "default"` - Sidebar + header
- `layout: "defaultTabs"` - Blue background variant

---

## 🔐 Access Control - Permission System

### When protecting features:

```typescript
// Protect entire route
{
  path: "/admin",
  component: AdminPage,
  meta: {
    permissions: ["view.Admin", "edit.Settings"]
  }
}

// Protect UI elements
import { Can } from "@/eano/access-control"

<Can I="edit" a="Product">
  <Button onClick={handleEdit}>Edit Product</Button>
</Can>

<Can I="delete" a="User">
  <Button variant="destructive">Delete User</Button>
</Can>

// In code
import { useAbility } from "@/eano/access-control"

const ability = useAbility()
if (ability.can("edit", "Product")) {
  // Allow editing
}
```

**Common Actions:** `view`, `create`, `edit`, `delete`, `manage`

---

## 🌍 i18n - Internationalization

### Always use translation system:

```typescript
import { useLanguage } from "@/i18n"

function MyComponent() {
  const { t, language, changeLanguage, isRTL } = useLanguage()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <Button onClick={() => changeLanguage('ar')}>العربية</Button>
    </div>
  )
}
```

**Supported Languages:** `ar` (Arabic), `en` (English), `de` (German)

---

## 🎨 Styling - Tailwind + Dark Mode

### Follow these patterns:

```typescript
// ✅ Dark mode support
className="bg-white dark:bg-[#161616] text-black dark:text-white"

// ✅ Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// ✅ Use cn() utility
import { cn } from "@/eano/lib/utils"

className={cn(
  "base-classes",
  condition && "conditional-classes",
  customClassName
)}
```

**Standard Container Style:**
```typescript
const containerStyle = "rounded-md p-4 border dark:bg-[#161616]"
```

---

## 🔌 API Integration - RTK Query

### When creating API endpoints:

```typescript
// File: src/services/api/eanoApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const eanoApi = createApi({
  reducerPath: "eanoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
    credentials: "include",
  }),
  tagTypes: ["Products", "Users"],
  endpoints: (builder) => ({
    
    // ✅ GET - Fetch list
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    
    // ✅ GET - Fetch single
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    
    // ✅ POST - Create
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    
    // ✅ PUT - Update
    updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),
    
    // ✅ DELETE
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = eanoApi
```

---

## 🎯 Decision Tree - What to Use When

```
User Request: "Create a form for..."
  → Use: DynamicForm with schema

User Request: "Show list/table of..."
  → Use: DataTable component

User Request: "Add stats/metrics/KPIs"
  → Use: Widgets (StatMiniWidget, ValueSummaryWidget, etc.)

User Request: "Create a new page"
  → 1. Create in src/pages/
  → 2. Register in src/router/index.ts
  → 3. Use existing layouts

User Request: "Add API endpoint"
  → Extend src/services/api/eanoApi.ts

User Request: "Protect feature with permissions"
  → Use <Can> component or route meta.permissions

User Request: "Add translation"
  → Add keys to src/i18n/locales/
```

---

## 📋 Code Quality Standards

### TypeScript - ALWAYS use types:
```typescript
// ✅ DO
interface Product {
  id: string
  name: string
  price: number
}

// ❌ DON'T
const product: any = {...}
```

### Component Structure:
```typescript
// ✅ Standard Component Template
"use client"  // If using client-side features

import React from "react"
import { useLanguage } from "@/i18n"
import { Button } from "@/eano/design-system/shadcn/button"

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onAction}>{t('common.action')}</Button>
    </div>
  )
}
```

---

## ✅ Response Checklist

Before responding to ANY request, verify:

- [ ] Am I reusing existing components? (NOT creating new ones)
- [ ] Am I following the file structure? (pages/, components/, services/)
- [ ] Am I using DynamicForm for forms? (NOT custom form logic)
- [ ] Am I using DataTable for tables? (NOT building from scratch)
- [ ] Am I using existing Widgets? (StatMiniWidget, etc.)
- [ ] Am I importing from correct paths? (@/eano/...)
- [ ] Am I using TypeScript types? (NOT any)
- [ ] Am I supporting i18n? (useLanguage, t())
- [ ] Am I supporting dark mode? (dark: classes)
- [ ] Am I following grid system? (grid: "12 md:6")
- [ ] 🔴 **SEARCHED for existing components first?** (MANDATORY)
- [ ] 🔴 **REPORTED component evaluation?** (before creating)
- [ ] 🔴 **Did NOT create duplicate components?** (reused instead)
- [ ] 🔴 **Did NOT create custom buttons/cards/UI?** (used shadcn)

---

## 🔍 MANDATORY: Component Search Checklist

**BEFORE creating ANY component, verify:**

1. ✅ Searched `src/eano/components/` for similar component
2. ✅ Checked `src/eano/design-system/shadcn/` for UI elements
3. ✅ Reviewed `src/components/` for existing custom components
4. ✅ Verified existing components cannot be composed to solve problem
5. ✅ Documented search results and decision in code/PR

**FAIL CONDITION - Do NOT proceed if:**
- Found similar component in framework → Use it instead
- Can compose existing components → Compose instead of create
- Is UI element (button, card, modal, etc.) → Use shadcn version
- User casually mentioned without necessity → Discuss first

---

## 🚨 Common Mistakes to AVOID

```typescript
// ❌ Creating custom components when framework has them
const MyButton = () => <button>...</button>
// ✅ Use framework
import { Button } from "@/eano/design-system/shadcn/button"

// ❌ Manual form state management
const [formData, setFormData] = useState({})
// ✅ Use DynamicForm

// ❌ Hardcoded text
<h1>Welcome</h1>
// ✅ Use i18n
<h1>{t('common.welcome')}</h1>

// ❌ Creating custom table logic
const [sortColumn, setSortColumn] = useState()
// ✅ Use DataTable

// ❌ Creating card/modal/dialog component
const MyCard = ({children}) => <div className="...">...</div>
// ✅ Use shadcn components
import { Card, CardContent, CardHeader } from "@/eano/design-system/shadcn/card"

// ❌ Creating input wrapper
const TextInput = (props) => <input {...props} />
// ✅ Use shadcn input
import { Input } from "@/eano/design-system/shadcn/input"
```

// ❌ Modifying eano/ folder for project features
// ✅ Extend in pages/ or components/
```

---

## 📚 Quick Reference - Most Used Imports

```typescript
// Components
import { Button, Input, Card, Dialog } from "@/eano/design-system/shadcn/..."
import { DynamicForm } from "@/eano/form-builder"
import { DataTable } from "@/eano/data-table-builder"
import { StatMiniWidget, ValueSummaryWidget } from "@/eano/components/widgets"

// Access Control
import { Can } from "@/eano/access-control"

// i18n
import { useLanguage } from "@/i18n"

// API
import { eanoApi, useGetProductsQuery } from "@/services/api/eanoApi"

// Utils
import { cn } from "@/eano/lib/utils"
```

---

## 🎯 Final Reminder

**This is a FRAMEWORK, not an app.**

Your job:
1. ✅ **Reuse** existing framework components
2. ✅ **Extend** only when necessary
3. ✅ **Follow** established patterns
4. ✅ **Maintain** consistency

**NEVER:**
- ❌ Recreate what exists
- ❌ Modify core framework (eano/)
- ❌ Ignore established patterns
- ❌ Use hardcoded values (use i18n)

---

**When in doubt:**
1. Search existing components first
2. Check documentation files (README.md files)
3. Follow the patterns shown above

**You are building WITH the framework, not rebuilding the framework.**
