/**
 * @file useSorting.ts
 * @description Hook for handling client-side sorting inside the Data Table Builder.
 * Supports toggling ASC/DESC order for a selected column.
 */

import { useState } from "react"
import type { ColumnConfig } from "../types/data-table.types"

export interface UseSortingResult<T extends Record<string, any>> {
  sortedData: T[]
  sorting: { column: string | null; direction: "asc" | "desc" | null }
  onSort: (column: ColumnConfig<T>["key"]) => void
}

/**
 * Handles sorting of table data client-side.
 * @param data - Array of rows
 * @returns sortedData + sorting state + onSort handler
 */
export function useSorting<T extends Record<string, any>>(
  data: T[],
): UseSortingResult<T> {
  const [sorting, setSorting] = useState<{ column: string | null; direction: "asc" | "desc" | null }>({
    column: null,
    direction: null,
  })

  /** Toggle sorting order or set a new column */
  const onSort = (columnKey: ColumnConfig<T>["key"]) => {
    const key = String(columnKey)
    setSorting((prev) => {
      if (prev.column === key) {
        // Toggle between asc and desc only
        return { column: key, direction: prev.direction === "asc" ? "desc" : "asc" }
      }
      // New column: start with asc
      return { column: key, direction: "asc" }
    })
  }

  /** Perform the actual sort (shallow) */
  const sortedData = [...data].sort((a, b) => {
    if (!sorting.column || !sorting.direction) return 0
    const aVal = a[sorting.column]
    const bVal = b[sorting.column]
    if (aVal == null || bVal == null) return 0
    if (aVal < bVal) return sorting.direction === "asc" ? -1 : 1
    if (aVal > bVal) return sorting.direction === "asc" ? 1 : -1
    return 0
  })

  return { sortedData, sorting, onSort }
}
