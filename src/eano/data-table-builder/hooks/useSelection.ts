/**
 * @file useSelection.ts
 * @description Hook for managing table row selection (checkboxes + bulk selection).
 */

import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import type { AppDispatch } from "@/store"
import { toggleRowSelection } from "../store/dataTableSlice"
import { makeSelectSelectedRows } from "../store/dataTableSelectors"

/**
 * Provides selection state and actions for a given tableId.
 */
export function useSelection(tableId: string, data: any[]) {
  const dispatch = useDispatch<AppDispatch>()
  
  const selectSelectedRows = useMemo(makeSelectSelectedRows, [])
  const selectedRows = useSelector((state: RootState) => selectSelectedRows(state, tableId))

  /** Toggle one row selection */
  const toggleRow = (rowId: string | number) => {
    dispatch(toggleRowSelection({ tableId, rowId }))
  }

  /** Select or deselect all rows */
  const toggleAll = () => {
    if (selectedRows.length === data.length) {
      data.forEach((row) => dispatch(toggleRowSelection({ tableId, rowId: row.id ?? row.key ?? row })))
    } else {
      data.forEach((row) => {
        if (!selectedRows.includes(row.id ?? row.key ?? row)) {
          dispatch(toggleRowSelection({ tableId, rowId: row.id ?? row.key ?? row }))
        }
      })
    }
  }

  /** Check if a specific row is selected */
  const isSelected = (rowId: string | number) => selectedRows.includes(rowId)

  /** Check if all rows are selected */
  const allSelected = useMemo(() => data.length > 0 && selectedRows.length === data.length, [data, selectedRows])

  return { selectedRows, toggleRow, toggleAll, isSelected, allSelected }
}
