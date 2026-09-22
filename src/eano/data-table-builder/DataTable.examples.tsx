/**
 * @file DataTable.examples.tsx
 * @description Practical examples showing different ways to use DataTable features
 */

import { DataTable } from "./DataTable"
import type { ColumnConfig } from "./types"

// ============================================================================
// Sample Data & Columns
// ============================================================================

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

const users: User[] = [
  { id: 1, name: "أحمد محمد", email: "ahmad@example.com", role: "Admin", status: "active" },
  { id: 2, name: "فاطمة علي", email: "fatima@example.com", role: "User", status: "active" },
  { id: 3, name: "محمود خالد", email: "mahmoud@example.com", role: "User", status: "inactive" },
]

const columns: ColumnConfig<User>[] = [
  { key: "id", label: "ID", type: "text" as const, sortable: true },
  { key: "name", label: "الاسم", type: "text" as const, sortable: true },
  { key: "email", label: "البريد الإلكتروني", type: "text" as const },
  { key: "role", label: "الدور", type: "badge" as const },
  { key: "status", label: "الحالة", type: "badge" as const },
]

// ============================================================================
// Example 1: Simple Table (No Features) 🔹
// ============================================================================

export function SimpleTableExample() {
  return (
    <DataTable
      tableId="simple-users"
      title="جدول بسيط"
      description="جدول بدون أي features إضافية"
      data={users}
      columns={columns}
    />
  )
}

// ============================================================================
// Example 2: Using Preset (Easiest Way) ⭐
// ============================================================================

export function PresetBasicExample() {
  return (
    <DataTable
      tableId="basic-users"
      title="جدول أساسي"
      data={users}
      columns={columns}
      preset="basic"  // ← Search + Sort only
    />
  )
}

export function PresetStandardExample() {
  return (
    <DataTable
      tableId="standard-users"
      title="جدول قياسي"
      data={users}
      columns={columns}
      preset="standard"  // ← Search + Sort + Pagination
    />
  )
}

export function PresetAdvancedExample() {
  return (
    <DataTable
      tableId="advanced-users"
      title="جدول متقدم"
      data={users}
      columns={columns}
      preset="advanced"  // ← All features including selection & column toggle
    />
  )
}

// ============================================================================
// Example 3: Using Boolean Shortcuts 🎯
// ============================================================================

export function BooleanShortcutsExample1() {
  return (
    <DataTable
      tableId="bool-users-1"
      title="بحث وترتيب فقط"
      data={users}
      columns={columns}
      enableSearch
      enableSorting
    />
  )
}

export function BooleanShortcutsExample2() {
  return (
    <DataTable
      tableId="bool-users-2"
      title="جدول مع صفحات واختيار"
      data={users}
      columns={columns}
      enablePagination
      enableSelection
    />
  )
}

export function BooleanShortcutsExample3() {
  return (
    <DataTable
      tableId="bool-users-3"
      title="جدول كامل الميزات"
      data={users}
      columns={columns}
      enableSearch
      enableSorting
      enablePagination
      enableSelection
      enableColumnToggle
    />
  )
}

// ============================================================================
// Example 4: Custom Features Object (Full Control) ⚙️
// ============================================================================

export function CustomFeaturesExample() {
  const handleServerSearch = async (term: string) => {
    console.log("Searching for:", term)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleSearchError = (error: Error) => {
    console.error("Search error:", error)
  }

  return (
    <DataTable
      tableId="custom-users"
      title="بحث احترافي من السيرفر"
      data={users}
      columns={columns}
      features={{
        search: {
          mode: "server",
          placeholder: "ابحث عن مستخدم...",
          debounceMs: 500,
          onServerSearch: handleServerSearch,
          onSearchError: handleSearchError,
          showResultsCount: true,
          showClearButton: true,
          minChars: 2
        },
        sorting: true,
        pagination: {
          type: "client",
          pageSize: 5
        }
      }}
    />
  )
}

// ============================================================================
// Example 5: Server-Side Pagination 🌐
// ============================================================================

export function ServerPaginationExample() {
  const totalRecords = 1000

  return (
    <DataTable
      tableId="server-paginated-users"
      title="جدول مع صفحات من السيرفر"
      data={users}
      columns={columns}
      features={{
        pagination: {
          type: "server",
          pageSize: 20,
          totalCount: totalRecords,
          currentPage: 1
        },
        search: {
          mode: "server",
          onServerSearch: async (term) => {
            console.log("Server search:", term)
            // Fetch from API with abort support
            await fetch(`/api/users?search=${term}`)
          },
          showResultsCount: true,
          showClearButton: true
        }
      }}
    />
  )
}

// ============================================================================
// Example 6: With Selection 📋
// ============================================================================

export function SelectionExample() {
  return (
    <DataTable
      tableId="selectable-users"
      title="جدول مع اختيار"
      description="يمكن اختيار صفوف متعددة"
      data={users}
      columns={columns}
      preset="standard"
      enableSelection  // ← Override preset to add selection
    />
  )
}

// ============================================================================
// Example 7: Responsive with Column Toggle 📱
// ============================================================================

export function ColumnToggleExample() {
  return (
    <DataTable
      tableId="toggle-users"
      title="جدول مع إخفاء الأعمدة"
      data={users}
      columns={columns}
      enableSearch
      enableSorting
      enableColumnToggle  // ← Show column visibility dropdown
    />
  )
}

// ============================================================================
// Comparison: All Three Methods Side by Side 🎨
// ============================================================================

export function ComparisonExample() {
  return (
    <div className="space-y-8">
      {/* Method 1: Preset */}
      <div>
        <h2 className="text-xl font-bold mb-4">1️⃣ Using Preset</h2>
        <DataTable
          tableId="compare-preset"
          data={users}
          columns={columns}
          preset="standard"
        />
      </div>

      {/* Method 2: Boolean Shortcuts */}
      <div>
        <h2 className="text-xl font-bold mb-4">2️⃣ Using Booleans</h2>
        <DataTable
          tableId="compare-bool"
          data={users}
          columns={columns}
          enableSearch
          enableSorting
          enablePagination
        />
      </div>

      {/* Method 3: Features Object */}
      <div>
        <h2 className="text-xl font-bold mb-4">3️⃣ Using Features Object</h2>
        <DataTable
          tableId="compare-features"
          data={users}
          columns={columns}
          features={{
            search: { mode: "local" },
            sorting: true,
            pagination: { type: "client", pageSize: 10 }
          }}
        />
      </div>
    </div>
  )
}
