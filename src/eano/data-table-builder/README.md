# DataTable Features Usage Guide

## Overview

The `DataTable` component supports **3 different approaches** to enable features, from simplest to most control.

---

## Three Usage Approaches

### 1. Preset Configuration (Recommended for Quick Start)

Perfect for common use cases - single prop!

```tsx
<DataTable
  tableId="users"
  data={users}
  columns={columns}
  preset="standard"  // ← search + sorting + pagination
/>
```

**Available Presets:**

| Preset | Enabled Features |
|--------|------------------|
| `"simple"` | None (plain table) |
| `"basic"` | Search + Sorting |
| `"standard"` | Search + Sorting + Pagination |
| `"advanced"` | Search + Sorting + Pagination + Selection + Column Toggle |
| `"full"` | All features enabled |

---

### 2. Boolean Shortcuts (Quick Customization)

Enable specific features quickly with simple boolean flags:

```tsx
<DataTable
  tableId="products"
  data={products}
  columns={columns}
  enableSearch           // ← Enable search
  enablePagination       // ← Enable pagination
  enableSelection        // ← Enable row selection
/>
```

**Available Shortcuts:**
- `enableSearch`
- `enableSorting`
- `enablePagination`
- `enableSelection`
- `enableColumnToggle`

---

### 3. Features Object (Advanced Control)

For complete control with custom configuration:

```tsx
<DataTable
  tableId="orders"
  data={orders}
  columns={columns}
  features={{
    search: {
      mode: "server",
      placeholder: "Search orders...",
      debounceMs: 500,
      onServerSearch: (term) => fetchOrders(term)
    },
    pagination: {
      type: "server",
      pageSize: 20,
      totalCount: 1000
    },
    sorting: true,
    selectable: true
  }}
/>
```

---

## Practical Examples

### Example 1: Simple Table (No Features)

```tsx
<DataTable
  tableId="simple-table"
  data={items}
  columns={columns}
/>
```

Output: Plain table with no interactive features.

---

### Example 2: Standard Table (Most Common)

```tsx
<DataTable
  tableId="standard-table"
  data={items}
  columns={columns}
  preset="standard"  // ← search + sorting + pagination
/>
```

Output: Production-ready table with search, sort, and pagination.

---

### Example 3: Selective Feature Enablement

```tsx
<DataTable
  tableId="custom-table"
  data={items}
  columns={columns}
  enableSearch
  enableSorting
  // pagination not enabled
/>
```

Output: Only search and sorting enabled; pagination hidden.

---

### Example 4: Server-Side Search with Pagination

```tsx
<DataTable
  tableId="server-table"
  data={items}
  columns={columns}
  features={{
    search: {
      mode: "server",
      onServerSearch: handleSearch,
      debounceMs: 800
    },
    pagination: {
      type: "server",
      pageSize: 25,
      totalCount: totalRecords
    }
  }}
/>
```

Architecture:
- Search requests go to server (handled by `onServerSearch` callback)
- Server returns paginated results
- Pagination metadata (`totalCount`, `pageSize`) handled by component

---

## Configuration Priority

If multiple approaches are used, priority is:

1. **`features` object** (highest priority)
2. **Boolean shortcuts** (medium priority)
3. **`preset`** (lowest priority)

```tsx
// Example: features object takes precedence
<DataTable
  preset="simple"        // ← Ignored
  enableSearch           // ← Ignored
  features={{            // ← This is used ✓
    sorting: true
  }}
/>
```

---

## Comparison Table

| Approach | Simplicity | Control | Best For |
|----------|-----------|---------|----------|
| Preset | 5/5 | 1/5 | Beginners, common cases |
| Booleans | 4/5 | 3/5 | Quick customization |
| Features Object | 2/5 | 5/5 | Advanced configuration |

---

## Configuration Reference

### Search Configuration

```typescript
search: {
  mode: 'client' | 'server';           // Where filtering happens
  placeholder?: string;                 // Input placeholder
  debounceMs?: number;                 // Debounce delay (ms)
  onServerSearch?: (term: string) => void | Promise<void>; // Server handler
  searchableColumns?: string[];        // Specific columns to search
}
```

### Pagination Configuration

```typescript
pagination: {
  type: 'client' | 'server';           // Pagination type
  pageSize?: number;                   // Items per page (default: 10)
  totalCount?: number;                 // Total items (required for server)
  onPageChange?: (page: number) => void; // Page change handler
}
```

### Sorting Configuration

```typescript
sorting: boolean | {
  mode: 'client' | 'server';           // Sort location
  onSort?: (column: string, order: 'asc' | 'desc') => void; // Server handler
}
```

### Selection Configuration

```typescript
selectable: boolean | {
  mode: 'single' | 'multiple';         // Selection type
  onSelectionChange?: (selectedIds: any[]) => void; // Selection handler
}
```

---

## Best Practices

✅ **DO:**
- Start with `preset="standard"` for typical tables
- Use `enableX` flags for simple customization
- Use `features` object for server-side operations
- Set `debounceMs` higher for expensive server calls (500-1000ms)
- Use `searchableColumns` to limit search scope

❌ **DON'T:**
- Mix presets with features object (features wins, preset ignored)
- Use `"full"` preset unless all features needed
- Set `debounceMs` too low (< 300ms) for server search
- Use server mode without proper `totalCount` in pagination

---

## Common Patterns

### Pattern: Client-Side Everything (Offline-First)
```tsx
preset="advanced"  // Search, sort, paginate locally
// All processing happens in browser
```

### Pattern: Server-Driven Table
```tsx
features={{
  search: { mode: 'server', onServerSearch: handleSearch },
  pagination: { type: 'server', totalCount: 5000 },
  sorting: { mode: 'server', onSort: handleSort }
}}
// All operations delegated to backend
```

### Pattern: Hybrid (Client Search + Server Pagination)
```tsx
preset="standard"  // Client-side search and sort
features={{
  pagination: { type: 'server', totalCount: 10000 }
}}
// Search filters local data; pagination from server
```

---

## Performance Notes

- **Client Search**: Fast for < 5,000 items
- **Server Search**: Required for > 10,000 items
- **Debouncing**: Default 300ms prevents excessive requests
- **Pagination**: Recommended for datasets > 100 items

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Search not working | `searchable: false` on columns | Add `searchable: true` to column config |
| Server search not called | Missing `onServerSearch` handler | Implement handler function |
| Pagination shows wrong total | Mismatch in `totalCount` | Verify server returns correct count |
| Sort not working | `sortable: false` on column | Add `sortable: true` to column config |
| Selection not working | `selectable` not enabled | Set `enableSelection` or enable in features |
