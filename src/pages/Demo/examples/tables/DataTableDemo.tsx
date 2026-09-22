/**
 * @file DataTableDemo.tsx
 * @description Demo page to test the EANO DataTable Builder with RTK Query data.
 */

"use client"

import { DataTable } from "@/eano/data-table-builder"
import type { ColumnConfig } from "@/eano/data-table-builder/types"

// ⬅️ Import RTK Query hook
import { useGetDemoPostsQuery } from "@/services/api/eanoApi"

/** -----------------------------------------------------------
 * 📌 1) Type definition for API response
 * ----------------------------------------------------------- */
type Post = {
  userId: number
  id: number
  title: string
  body: string
}

/** -----------------------------------------------------------
 * 📌 2) DataTable Demo Component
 * ----------------------------------------------------------- */
export default function DataTableDemo() {
  // 🧩 Fetch data from API
  const { data, isLoading, error, refetch } = useGetDemoPostsQuery()

  // Force data to array (in case undefined initially)
  const rows: Post[] = data ?? []

  /** -------------------------------------------------------
   * 📌 3) Table columns (typed)
   * ------------------------------------------------------- */
  const columns: ColumnConfig<Post>[] = [
    { key: "id", label: "ID", sortable: true, minWidth: 70, type: "number" },
    { key: "title", label: "Title", sortable: true, minWidth: 200, type: "text" },
    { key: "body", label: "Body", minWidth: 250, type: "text" },
    { key: "userId", label: "User ID", sortable: true, minWidth: 90, type: "number" },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Posts Table (RTK Query)</h2>

        <button
          onClick={() => refetch()}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition"
        >
          Reload Data
        </button>
      </div>

      {/* 🛑 Error State */}
      {error && (
        <p className="text-red-500 mb-4">
          Failed to load posts. Try again.
        </p>
      )}

      {/* 🧾 DataTable - Using new simplified API */}
      <DataTable
        tableId="demo-posts"
        data={rows}
        columns={columns}
        preset="standard"         // ← بحث + ترتيب + صفحات
        enableSelection           // ← إضافة اختيار الصفوف
        loading={isLoading}
        emptyMessage="No posts found"
        
        features={{
          search: {
            mode: "local",
            placeholder: "ابحث في العنوان أو المحتوى...",
            searchColumns: ["title", "body"], // ✅ البحث في العنوان والمحتوى
            showResultsCount: true,
            showClearButton: true,
            minChars: 2, // ابدأ بعد حرفين
            caseSensitive: false,
            debounceMs: 300
          }
        }}
      />
    </div>
  )
}
