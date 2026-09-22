/**
 * @file useColumnVisibility.ts
 * @description Hook for managing visible columns in the DataTable.
 */

import { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import type { AppDispatch } from "@/store"
import { makeSelectVisibleColumns } from "../store/dataTableSelectors"
import { setVisibleColumns } from "../store/dataTableSlice"

/**
 * Manage which columns are visible for a given table.
 */
export function useColumnVisibility(tableId: string, allColumns: string[]) {
  const dispatch = useDispatch<AppDispatch>()
  
  const selectVisibleColumns = useMemo(makeSelectVisibleColumns, [])
  const visibleColumns = useSelector((state: RootState) => selectVisibleColumns(state, tableId))

  /** Toggle single column visibility */
  const toggleColumn = (key: string) => {
    let updated: string[] = []
    if (visibleColumns.includes(key)) {
      updated = visibleColumns.filter((c) => c !== key)
    } else {
      updated = [...visibleColumns, key]
    }
    dispatch(setVisibleColumns({ tableId, columns: updated }))
  }

  /** Check if column is visible */
  const isVisible = (key: string) => visibleColumns.includes(key)

  /** Reset visibility to all columns visible */
  const resetVisibility = () => dispatch(setVisibleColumns({ tableId, columns: allColumns }))

  return { visibleColumns, toggleColumn, isVisible, resetVisibility }
}
