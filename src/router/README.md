# React Router System - Reference Guide

> **AI-Optimized Documentation** | EANO Admin Template | React Router v6 + Permissions

---

## Meta Information

```yaml
technology: React Router v6
features:
  - Lazy loading (code splitting)
  - Layout management
  - Permission-based protection
  - i18n navigation
  - Auto-suspense handling
components:
  - AppRouter: Router + permission logic
  - LayoutManager: Layout wrapper system
  - RouteItem: Type-safe route definition
```

---

## 📁 File Structure

```
src/router/
├── index.ts                 # Route definitions (307 lines)
├── navigation-data.ts       # Navigation menu data
└── core/
    ├── AppRouter.tsx        # Main router with ProtectedRoute integration
    ├── LayoutManager.tsx    # Layout wrapper component
    └── types.ts             # TypeScript type definitions
```

---

## 🔧 Type System

### Core Types

```typescript
// Route component type (supports lazy loading)
type RouteComponent = 
  | ComponentType<any>
  | LazyExoticComponent<ComponentType<any>>

// Route metadata
type RouteMeta = {
  layout?: "default" | "defaultTabs" | "megaMenu"
  permission?: string              // Single permission
  permissionAll?: string[]         // All required
  permissionAny?: string[]         // Any one required
  redirectTo?: string              // Redirect on denied
  [key: string]: any               // Custom properties
}

// Single route definition
type RouteItem = {
  path: string                     // URL path
  title?: string                   // Page title
  component: RouteComponent        // React component
  meta?: RouteMeta                 // Metadata
}

// Application routes array
type AppRoutes = RouteItem[]
```


---

## 🎯 Route Patterns

### Pattern 1: Public Route (No Authentication)

```typescript
{
  path: "/",
  title: "Home",
  component: lazy(() => import("@/pages/dashboard/HomeDashboard")),
  meta: { layout: "default" }
}
```

### Pattern 2: Single Permission

```typescript
{
  path: "/test-permission",
  title: "Test Single Permission",
  component: lazy(() => import("@/pages/examples/TestPermissionPage")),
  meta: {
    layout: "megaMenu",
    permission: "view.Product",      // Single permission required
    redirectTo: "/"                  // Redirect if denied
  }
}
```

### Pattern 3: Multiple Permissions (ALL Required)

```typescript
{
  path: "/test-permission-all",
  title: "Test Permission ALL",
  component: lazy(() => import("@/pages/examples/TestPermissionAllPage")),
  meta: {
    layout: "megaMenu",
    permissionAll: ["view.Product", "edit.Product"],  // All required
    redirectTo: "/"
  }
}
```

### Pattern 4: Multiple Permissions (ANY Required)

```typescript
{
  path: "/test-permission-any",
  title: "Test Permission ANY",
  component: lazy(() => import("@/pages/examples/TestPermissionAnyPage")),
  meta: {
    layout: "megaMenu",
    permissionAny: ["view.Product", "special.Test", "admin.Test"],  // Any one
    redirectTo: "/"
  }
}
```

---

## 🏗️ Layout System

### Available Layouts

| Layout | Description | Use Case | Features |
|--------|-------------|----------|----------|
| `"default"` | Sidebar + Header | Main app pages | Navigation sidebar, header |
| `"defaultTabs"` | Blue-themed | Documentation | Content-focused, tabbed |
| `"megaMenu"` | Mega menu header | Examples/Tools | Large navigation menu |

### Layout Assignment

```typescript
// Defined in meta.layout property
meta: { layout: "default" }      // Use default layout
meta: { layout: "defaultTabs" }  // Use tabs layout
meta: { layout: "megaMenu" }     // Use mega menu layout
```

### Current Layout Distribution (Project)

```typescript
// Default layout (Dashboards)
{ path: "/", meta: { layout: "default" } }
{ path: "/admin-dashboard", meta: { layout: "default" } }
{ path: "/analytics-dashboard", meta: { layout: "default" } }
{ path: "/crm-dashboard", meta: { layout: "default" } }

// DefaultTabs layout (Documentation)
{ path: "/base-ui", meta: { layout: "defaultTabs" } }
{ path: "/feedback-alerts", meta: { layout: "defaultTabs" } }

// MegaMenu layout (Examples/Tools)
{ path: "/form-builder", meta: { layout: "megaMenu" } }
{ path: "/charts", meta: { layout: "megaMenu" } }
{ path: "/table", meta: { layout: "megaMenu" } }
```

---

## 🔐 Permission System

### Permission Patterns

```typescript
// Format: "action.Resource"
"view.Product"
"edit.Product"
"delete.User"
"admin.Settings"
```

### Permission Types

| Meta Property | Type | Logic | Example |
|---------------|------|-------|---------|
| `permission` | `string` | Single permission | `"view.Product"` |
| `permissionAll` | `string[]` | AND logic (all required) | `["view.Product", "edit.Product"]` |
| `permissionAny` | `string[]` | OR logic (any one) | `["admin", "moderator"]` |

### Integration with ProtectedRoute

Routes with permissions are automatically wrapped:

```typescript
// In AppRouter.tsx
if (hasPermission) {
  return {
    path: r.path,
    element: (
      <ProtectedRoute
        permission={meta.permission}
        permissionAll={meta.permissionAll}
        permissionAny={meta.permissionAny}
        redirectTo={meta.redirectTo}
      >
        {pageElement}
      </ProtectedRoute>
    )
  }
}
```

---

## 📝 Adding New Route (Step-by-Step)

### Step 1: Create Component

```typescript
// src/pages/examples/MyNewPage.tsx
export default function MyNewPage() {
  return <div>My New Page</div>
}
```

### Step 2: Add Lazy Import

```typescript
// src/router/index.ts (top of file)
const MyNewPage = lazy(() => import("@/pages/examples/MyNewPage"))
```

### Step 3: Add Route Definition

```typescript
// src/router/index.ts (in routes array)
const routes: AppRoutes = [
  // ... existing routes
  {
    path: "/my-new-page",
    title: "My New Page",
    component: MyNewPage,
    meta: { 
      layout: "megaMenu",              // Choose layout
      permission: "view.MyResource",   // Optional: add permission
      redirectTo: "/"                  // Optional: redirect on denied
    }
  }
]
```

### Step 4: Add Navigation Item (Optional)

```typescript
// src/router/navigation-data.ts
export const navMainData = [
  // ... existing items
  {
    get title() { return t("navigation.mySection") },
    url: "#",
    icon: YourIcon,
    items: [
      {
        get title() { return t("navigation.myNewPage") },
        url: "/my-new-page"
      }
    ]
  }
]
```

### Step 5: Add i18n Translation (Optional)

```typescript
// src/i18n/locales/en/translation.json
{
  "navigation": {
    "myNewPage": "My New Page"
  }
}
```

---

## 💡 Complete Examples

### Example 1: Dashboard Page (Current Pattern)

```typescript
// Import
const AdminDashboard = lazy(() => import("@/pages/dashboard/AdminDashboard"))

// Route
{
  path: "/admin-dashboard",
  title: "Admin Dashboard",
  component: AdminDashboard,
  meta: { layout: "default" }
}

// Navigation
{
  get title() { return t("navigation.adminDashboard") },
  url: "/admin-dashboard"
}
```

### Example 2: Protected Form Page

```typescript
// Import
const ProductFormPage = lazy(() => import("@/pages/examples/ProductFormPage"))

// Route
{
  path: "/form-builder",
  title: "Product Form",
  component: ProductFormPage,
  meta: { 
    layout: "megaMenu",
    permission: "create.Product",
    redirectTo: "/403"
  }
}
```

### Example 3: Multi-Permission Page

```typescript
// Import
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"))

// Route
{
  path: "/settings",
  title: "Settings",
  component: SettingsPage,
  meta: {
    layout: "default",
    permissionAll: ["view.Settings", "edit.Settings"],
    redirectTo: "/"
  }
}
```

### Example 4: Documentation Page

```typescript
// Import
const BaseUiPage = lazy(() => import("@/pages/docs/Components/BaseUIDocs"))

// Route
{
  path: "/base-ui",
  title: "Base UI Components",
  component: BaseUiPage,
  meta: { layout: "defaultTabs" }  // Documentation layout
}
```

---

## 🔄 Router Flow

```mermaid
Route Definition (index.ts)
    ↓
AppRouter.tsx processes routes
    ↓
Check if route has permissions
    ↓
├─ Yes → Wrap with ProtectedRoute
│         ↓
│    Check user abilities
│         ↓
│    ├─ Granted → Render page
│    └─ Denied  → Redirect to redirectTo
│
└─ No  → Render page directly
    ↓
Wrap in Suspense (lazy loading)
    ↓
Apply Layout (LayoutManager)
    ↓
Render Component
```

---

## 🎨 Navigation System

### Navigation Data Structure

```typescript
// src/router/navigation-data.ts
export const navMainData = [
  {
    get title() { return t("navigation.dashboard") },  // i18n support
    url: "/",
    icon: SquareTerminal,                              // Lucide icon
    isActive: true,
    items: [
      {
        get title() { return t("navigation.home") },
        url: "/"
      }
    ]
  }
]
```

### Features

- **i18n Integration**: Dynamic translations via `get title()`
- **Icons**: Lucide React icons
- **Nested Structure**: Support for sub-items
- **Active State**: Track active routes

---

## 🚀 Current Routes (Project Map)

### Dashboards (layout: "default")
```typescript
/                        → HomeDashboard
/admin-dashboard         → AdminDashboard
/analytics-dashboard     → AnalyticsDashboard
/crm-dashboard           → CRMDashboard
```

### Forms (layout: "megaMenu")
```typescript
/form-builder            → ProductFormPage
/add-article             → AddArticlePage
```

### Tables (layout: "megaMenu")
```typescript
/table                   → TablesPage
/data-table-demo         → DataTableDemo
```

### Charts (layout: "megaMenu")
```typescript
/charts                  → ChartsExample
```

### API Services (layout: "megaMenu")
```typescript
/api-test                → ApiTestPage
```

### Documentation (layout: "defaultTabs")
```typescript
/base-ui                 → BaseUiPage
/feedback-alerts         → FeedbackAlertsPage
/layout-ui               → LayoutUIPage
/navigation-ui           → NavigationUIPage
/datetime-ui             → DateTimeUIPage
```

### Test Routes (Permission Testing)
```typescript
/test-permission         → Single permission test
/test-permission-all     → All permissions test
/test-permission-any     → Any permission test
```

---

## ⚡ Performance Features

### Lazy Loading

All routes use lazy loading for code splitting:

```typescript
// Import
const Component = lazy(() => import("@/pages/Component"))

// Automatic Suspense wrapper in AppRouter
<Suspense fallback={<div>Loading…</div>}>
  <Component />
</Suspense>
```

### Benefits
- ✅ Smaller initial bundle
- ✅ Faster page loads
- ✅ On-demand loading
- ✅ Better performance

---

## 🔍 React Router Hooks

### Navigation Hooks

```typescript
import { useLocation, useParams, useNavigate } from "react-router-dom"

// Get current location
const location = useLocation()
// → { pathname: "/dashboard", search: "", hash: "", state: null }

// Get URL parameters
const { id } = useParams()
// For route: /product/:id

// Navigate programmatically
const navigate = useNavigate()
navigate("/dashboard")
navigate(-1)  // Go back
navigate("/login", { replace: true })
```

### Permission Check Hook

```typescript
import { useAbilityFromContext } from "@/eano/access-control"

const ability = useAbilityFromContext()

// Check permission
const canEdit = ability.can("edit", "Product")
const canDelete = ability.can("delete", "User")

// Use in component
{canEdit && <button>Edit</button>}
```

---

## ✅ Best Practices

### 1. Always Use Lazy Loading

```typescript
// ✅ Good
const Page = lazy(() => import("@/pages/Page"))

// ❌ Bad - Eager loading
import Page from "@/pages/Page"
```

### 2. Define Routes in index.ts Only

```typescript
// ✅ Good - Centralized
// src/router/index.ts
const routes: AppRoutes = [/* all routes */]

// ❌ Bad - Scattered definitions
```

### 3. Use Specific Permission Strings

```typescript
// ✅ Good
permission: "view.Product"
permission: "edit.User"

// ❌ Bad - Vague
permission: "admin"
permission: "access"
```

### 4. Always Include redirectTo for Protected Routes

```typescript
// ✅ Good
meta: {
  permission: "view.Product",
  redirectTo: "/403"  // or "/"
}

// ❌ Bad - No redirect
meta: {
  permission: "view.Product"
}
```

### 5. Choose Appropriate Layout

```typescript
// ✅ Good - Matching purpose
// Dashboard → default
{ path: "/dashboard", meta: { layout: "default" } }

// Documentation → defaultTabs
{ path: "/docs", meta: { layout: "defaultTabs" } }

// Tools/Examples → megaMenu
{ path: "/tools", meta: { layout: "megaMenu" } }
```

### 6. Export Default from Components

```typescript
// ✅ Good
export default function MyPage() { }

// ❌ Bad - Named export won't work with lazy()
export function MyPage() { }
```


---

## ⚠️ Troubleshooting

### Common Issues & Solutions

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| **Route not accessible** | Missing import or wrong path | Verify `lazy()` import and path in `index.ts` |
| **Blank page** | Component not default export | Use `export default function Component()` |
| **404 on refresh** | Server routing issue | Configure server to serve index.html for all routes |
| **Always redirected** | Incorrect permission string | Check permission matches user abilities exactly |
| **Permission not working** | Typo in permission name | Use format: `"action.Resource"` (case-sensitive) |
| **Slow page load** | Not lazy loaded | Use `lazy(() => import(...))` |
| **Navigation item missing** | Not in navigation-data.ts | Add to `navMainData` array |
| **Layout not applied** | Wrong layout name | Use: "default", "defaultTabs", or "megaMenu" |
| **Component render twice** | React StrictMode | Normal in development mode |
| **Suspense error** | Missing default export | Ensure component has `export default` |

### Debug Checklist

```typescript
// 1. Check route is defined
// src/router/index.ts
const Component = lazy(() => import("@/pages/Component"))  // ✓ Import exists
{ path: "/route", component: Component }                   // ✓ Route defined

// 2. Check component export
// src/pages/Component.tsx
export default function Component() { }  // ✓ Default export

// 3. Check permission (if protected)
// src/router/index.ts
meta: { permission: "view.Product" }     // ✓ Matches user ability

// 4. Check navigation (if needed)
// src/router/navigation-data.ts
{ title: "Component", url: "/route" }    // ✓ Navigation item
```

---

## 🧪 Testing Routes

### Test Routes Available

```typescript
// Single permission test
/test-permission         // Requires: "view.Product"

// All permissions test (AND logic)
/test-permission-all     // Requires: "view.Product" AND "edit.Product"

// Any permission test (OR logic)
/test-permission-any     // Requires: "view.Product" OR "special.Test" OR "admin.Test"
```

### Manual Testing

1. **Navigate to route** via URL or menu
2. **Check rendering** - Component displays correctly
3. **Check permissions** - Redirects if denied
4. **Check layout** - Correct layout applied
5. **Check lazy loading** - Network tab shows code split

---

## 📚 Related Documentation

- **Access Control**: [../eano/access-control/README.md](../eano/access-control/README.md)
- **React Router v6**: https://reactrouter.com/
- **React Lazy**: https://react.dev/reference/react/lazy
- **Current Routes**: [index.ts](index.ts)
- **Navigation Data**: [navigation-data.ts](navigation-data.ts)

---

## 🚀 Quick Reference

### Minimal Route

```typescript
{
  path: "/page",
  component: lazy(() => import("@/pages/Page")),
  meta: { layout: "default" }
}
```

### Protected Route

```typescript
{
  path: "/page",
  component: lazy(() => import("@/pages/Page")),
  meta: {
    layout: "default",
    permission: "view.Resource",
    redirectTo: "/"
  }
}
```

### Complete Route + Navigation

```typescript
// Route (index.ts)
const Page = lazy(() => import("@/pages/Page"))
{
  path: "/page",
  title: "Page Title",
  component: Page,
  meta: { layout: "megaMenu" }
}

// Navigation (navigation-data.ts)
{
  get title() { return t("navigation.page") },
  url: "/page",
  icon: IconComponent
}

// i18n (locales/en/translation.json)
{
  "navigation": {
    "page": "Page Title"
  }
}
```

---

**Document Version**: 2.0  
**Last Updated**: January 2026  
**Target Audience**: AI Tools & Developers  
**Optimization**: Structured for AI code generation and understanding
