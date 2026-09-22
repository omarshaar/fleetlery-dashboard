# 🔐 Access Control System

## What Is It?

A permission control system that defines **who can do what** in the application.

**Format**: `"action.subject"` like `"view.Product"`, `"edit.User"`, or `"delete.Order"`

---

## Purpose

**Feature Protection**: Show/hide buttons and pages based on user permissions

**Examples**:
- Show "Delete" button only to admins
- Hide settings page for regular users
- Allow product editing only to its owner
- Allow invoice approval only to accountants

---

## How to Use

### 1️⃣ Wrap Your App

```typescript
// main.tsx
<AccessControlProvider>
  <App />
</AccessControlProvider>
```

### 2️⃣ Define Data Source

```typescript
// config.ts
getPermissions: async () => {
  const response = await fetch('/api/user/permissions');
  return response.json();  // ["view.Product", "edit.Product", ...]
}
```

### 3️⃣ Use in UI

**A) Protect Buttons & Elements**:
```typescript
<Can I="edit" a="Product">
  <button>Edit</button>
</Can>

<Can I="delete" a="Product" not>
  <button disabled>Delete</button>
</Can>
```

**B) Protect Pages**:
```typescript
<ProtectedRoute permission="view.Product">
  <ProductPage />
</ProtectedRoute>

<ProtectedRoute permissionAny={["admin.Panel", "moderator.Panel"]}>
  <AdminPage />
</ProtectedRoute>
```

**C) Programmatic Check**:
```typescript
const ability = useAbilityFromContext();

if (ability.can("edit", "Product")) {
  // Allow editing
}
```

---

## Available Formats

**Actions**: view, create, edit, delete, manage, approve, export, archive, publish  
**Resources**: Product, User, Order, Report, Invoice, Expense, System, Analytics

---

## Complete Example

```typescript
// 1. Permissions from server
const permissions = [
  "view.Product",      // View products
  "edit.Product",      // Edit them
  "delete.Product",    // Delete them
  "manage.User"        // Manage users
];

// 2. Use in UI
function ProductActions() {
  return (
    <>
      <Can I="view" a="Product">
        <button>View Details</button>
      </Can>

      <Can I="edit" a="Product">
        <button>Edit</button>
      </Can>

      <Can I="delete" a="Product">
        <button className="text-red">Delete</button>
      </Can>

      <Can I="manage" a="User" not>
        <p>You don't have permission to manage users</p>
      </Can>
    </>
  );
}

// 3. Protect pages
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute permission="manage.User">
        <AdminPanel />
      </ProtectedRoute>
    } 
  />
</Routes>
```

---

## Difference Between Approaches

| Feature | Can Component | ProtectedRoute |
|---------|---|---|
| **Usage** | UI elements (buttons, text) | Entire pages |
| **When Denied** | Hide element | Redirect to /403 |
| **Behavior** | Dynamic, changes with interaction | Static on load |

---

## Key Points

✅ **DO**:
- Wrap app with `<AccessControlProvider>`
- Send permissions from backend
- Use consistent format: `"action.subject"`
- Validate permissions on server (real security)

❌ **DON'T**:
- Rely on UI alone for security (server must validate)
- Use inconsistent names: `"viewProduct"` vs `"view.Product"`
- Forget `<AccessControlProvider>` (permissions won't work)
- Hide sensitive operations only (server must reject them)

---

## Summary

1. **Fetch permissions** from server on app load
2. **Use `<Can>`** to show/hide elements
3. **Use `<ProtectedRoute>`** to protect entire pages
4. **Always validate on server** (not just UI)

