# Access Control System

## Overview

RBAC/ABAC authorization system for React applications built on CASL.

**Permission Format**: `"action.subject"` (e.g., `"view.Product"`, `"edit.User"`, `"delete.Order"`)

---

## Architecture

```
Backend API ↓
getPermissions() ↓
normalizePermissions() ↓
buildAbility() ↓
AbilityContext ↓
Can | ProtectedRoute | useAbilityFromContext() ↓
UI Components & Routes
```

---

## Setup

### 1. Initialize Provider

```typescript
// main.tsx
import { AccessControlProvider } from "@/eano/access-control";

ReactDOM.render(
  <AccessControlProvider>
    <App />
  </AccessControlProvider>,
  document.getElementById("root")
);
```

### 2. Configure Backend

```typescript
// src/eano/access-control/config.ts
export const accessControlConfig = {
  getPermissions: async () => {
    const response = await fetch('/api/user/permissions');
    return response.json();
  }
};
```

### 3. Normalize Data (if needed)

```typescript
// src/eano/access-control/normalizer.ts
export function normalizePermissions(raw: any): string[] {
  const perms: string[] = [];
  
  // Handle roles
  if (raw.roles) {
    const roleMap = { 
      admin: ["view.Product", "edit.Product", "delete.Product"],
      editor: ["view.Product", "edit.Product"],
      viewer: ["view.Product"]
    };
    raw.roles.forEach(r => perms.push(...(roleMap[r] || [])));
  }
  
  // Handle direct permissions
  if (Array.isArray(raw.permissions)) perms.push(...raw.permissions);
  
  // Handle flags
  if (raw.canViewProduct) perms.push("view.Product");
  if (raw.canEditProduct) perms.push("edit.Product");
  
  // Handle grants
  if (raw.grants) {
    Object.entries(raw.grants).forEach(([action, subjects]: [string, any]) => {
      if (Array.isArray(subjects)) {
        subjects.forEach(s => perms.push(`${action}.${s}`));
      }
    });
  }
  
  return [...new Set(perms)];
}
```

---

## API Reference

### Can Component

```typescript
interface CanProps {
  I: string;                    // action
  a: string;                    // subject
  children: ReactNode;
  data?: any;                   // ABAC data
  not?: boolean;                // invert logic
  passThrough?: boolean;        // keep in DOM
}

// Render if user has permission
<Can I="edit" a="Product">
  <button>Edit</button>
</Can>

// Render if user does NOT have permission
<Can I="delete" a="Order" not>
  <button>Delete</button>
</Can>

// Keep in DOM, hide with CSS
<Can I="manage" a="System" passThrough>
  <button>Manage</button>
</Can>
```

### ProtectedRoute

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;          // single
  permissionAll?: string[];     // AND logic
  permissionAny?: string[];     // OR logic
  redirectTo?: string;          // default: /403
}

// Single permission
<ProtectedRoute permission="view.Product">
  <ProductPage />
</ProtectedRoute>

// All required (AND)
<ProtectedRoute 
  permissionAll={["edit.Product", "delete.Product"]}
  redirectTo="/unauthorized"
>
  <AdminPage />
</ProtectedRoute>

// Any required (OR)
<ProtectedRoute permissionAny={["admin.Panel", "moderator.Panel"]}>
  <ManagementPage />
</ProtectedRoute>
```

### useAbilityFromContext

```typescript
const ability = useAbilityFromContext();

ability.can("view", "Product")           // boolean
ability.can("edit", "User")              // boolean
ability.can("edit", productInstance)     // ABAC: check with data
```

**Throws error if used outside AccessControlProvider**

### buildAbility

```typescript
export function buildAbility(permissions: string[]): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(Ability as any);
  permissions.forEach(perm => {
    const [action, subject] = perm.split('.');
    builder.can(action, subject);
  });
  builder.cannot('manage', 'all');
  return builder.build();
}

const ability = buildAbility(["view.Product", "edit.Product"]);
ability.can("view", "Product")   // → true
ability.can("delete", "Product") // → false
```

### AccessControlProvider

```typescript
interface AccessControlProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Flow:
// 1. getPermissions() → raw data
// 2. normalizePermissions() → ["action.subject", ...]
// 3. buildAbility() → CASL instance
// 4. AbilityContext.Provider → distribute to tree
// 5. loading state → shows fallback while fetching
```

---

## Usage Patterns

### Pattern 1: Component Protection

```typescript
function ProductCard({ product }) {
  return (
    <div>
      <Can I="view" a="Product"><p>{product.name}</p></Can>
      <Can I="edit" a="Product"><button>Edit</button></Can>
      <Can I="delete" a="Product"><button>Delete</button></Can>
    </div>
  );
}
```

### Pattern 2: Hook-Based Checking

```typescript
function AdminButton() {
  const ability = useAbilityFromContext();
  
  return (
    <button disabled={!ability.can("manage", "System")}>
      Admin Panel
    </button>
  );
}
```

### Pattern 3: Route Protection

```typescript
<Routes>
  <Route path="/products" element={<HomePage />} />
  
  <Route path="/products/edit" element={
    <ProtectedRoute permission="edit.Product">
      <EditProductPage />
    </ProtectedRoute>
  } />
  
  <Route path="/admin" element={
    <ProtectedRoute 
      permissionAny={["manage.System", "manage.User"]}
      redirectTo="/403"
    >
      <AdminPanel />
    </ProtectedRoute>
  } />
</Routes>
```

### Pattern 4: Feature Flags

```typescript
function Dashboard() {
  const ability = useAbilityFromContext();
  
  return (
    <div>
      {ability.can("view", "Analytics") && <AnalyticsWidget />}
      {ability.can("view", "Reports") && <ReportsWidget />}
      {ability.can("manage", "System") && <SettingsWidget />}
    </div>
  );
}
```

### Pattern 5: ABAC (Attribute-Based)

```typescript
function EditPostButton({ post, currentUserId }) {
  return (
    <Can I="edit" a="Post" data={post}>
      {currentUserId === post.authorId && <button>Edit My Post</button>}
    </Can>
  );
}
```

### Pattern 6: Multiple Permissions (AND)

```typescript
function ApproveButton() {
  const ability = useAbilityFromContext();
  
  const canApprove = 
    ability.can("view", "Expense") && 
    ability.can("approve", "Expense");
  
  return <button disabled={!canApprove}>Approve</button>;
}
```

### Pattern 7: Multiple Permissions (OR)

```typescript
function ManagementAccess() {
  const ability = useAbilityFromContext();
  
  const hasAccess = 
    ability.can("manage", "User") || 
    ability.can("manage", "System") ||
    ability.can("manage", "Reports");
  
  return <div>{hasAccess && <ManagementPanel />}</div>;
}
```

---

## Backend Data Formats

| Format | Input | Handling |
|--------|-------|----------|
| **Strings** | `{"permissions": ["view.Product"]}` | Use as-is |
| **Roles** | `{"roles": ["admin", "editor"]}` | Map via roleMap |
| **Flags** | `{"canViewProduct": true}` | Convert to permission |
| **Grants** | `{"grants": {"view": ["Product"]}}` | Expand to "view.Product" |
| **Nested** | `{"user": {"permissions": [...]}}` | Extract and merge |

---

## Type Definitions

```typescript
// Permission format
type Action = "view" | "create" | "edit" | "delete" | "manage" | "approve" | string;
type Subject = "Product" | "User" | "Order" | "Report" | "System" | string;
type Permission = `${Action}.${Subject}`;

// Ability
type AppAbility = MongoAbility<AppAbilityTuple>;

// Hook return
type useAbilityFromContext = () => AppAbility;

// Props
interface CanProps {
  I: string;
  a: string;
  children: React.ReactNode;
  data?: any;
  not?: boolean;
  passThrough?: boolean;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  permissionAll?: string[];
  permissionAny?: string[];
  redirectTo?: string;
}
```

---

## Integration Checklist

- [ ] Wrap app with `<AccessControlProvider>`
- [ ] Implement `getPermissions()` in config.ts
- [ ] Implement `normalizePermissions()` if needed
- [ ] Use `<Can>` for UI elements
- [ ] Use `<ProtectedRoute>` for pages
- [ ] Test in DevTools: AbilityContext → rules array
- [ ] Add error handling in `getPermissions()`
- [ ] Backend validates all requests (frontend is UX only)

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Loading forever | getPermissions() unresolved | Add timeout, return `[]` on error |
| Wrong redirects | Permissions not loaded | Wait for `ability?.rules?.length > 0` |
| `<Can>` always hidden | Case mismatch or format error | `console.log(ability.rules)` |
| All permissions granted | Empty permission array | Log `normalizePermissions(raw)` |
| TypeScript errors | Dynamic strings without type | Use `string[]` type |

Debug helper:
```typescript
function Debug() {
  const ability = useAbilityFromContext();
  useEffect(() => {
    console.log('Rules:', ability?.rules);
    console.log('Can view Product:', ability?.can("view", "Product"));
  }, [ability]);
  return null;
}
```

---

## Best Practices

✅ **DO**:
- Consistent format: `"view.Product"` (action.subject lowercase)
- Wrap app with provider
- Return `[]` on permission fetch errors
- Validate permissions in backend
- Document required permissions (JSDoc)

❌ **DON'T**:
- Hardcode role checks (use permissions)
- Skip frontend checks (they're UX, not security)
- Mix permission formats
- Cache permissions indefinitely
- Trust CASL as security (backend validates)

---

## Complete Example

```typescript
// 1. Initialize
<AccessControlProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</AccessControlProvider>

// 2. Configure
export const accessControlConfig = {
  getPermissions: async () => {
    const res = await fetch('/api/permissions');
    return res.json();
  }
};

// 3. Use in component
function ProductActions({ product }) {
  const ability = useAbilityFromContext();
  
  return (
    <>
      <Can I="view" a="Product">
        <p>{product.name}</p>
      </Can>
      
      <Can I="edit" a="Product">
        <button>Edit</button>
      </Can>
      
      <Can I="delete" a="Product">
        <button>Delete</button>
      </Can>
    </>
  );
}

// 4. Use in routes
<Routes>
  <Route path="/products" element={
    <ProtectedRoute permission="view.Product">
      <ProductListPage />
    </ProtectedRoute>
  } />
  
  <Route path="/admin" element={
    <ProtectedRoute permissionAny={["manage.System", "manage.User"]}>
      <AdminPage />
    </ProtectedRoute>
  } />
</Routes>
```

---

## Performance

- Permission checking: O(1) via CASL rules
- Context updates: Only when permissions change
- Component re-renders: Memoized, minimal updates
- Rules caching: Cached in ability instance

---

## Browser Support

- Modern browsers (ES2020+)
- React 18+
- TypeScript optional but recommended

---

## Dependencies

- `casl` - Authorization library
- `react` - UI framework
- `react-router` - Routing (optional, for ProtectedRoute)
