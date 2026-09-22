/**
 * @file useDataTable.ts
 * @description Main hook for interacting with the Data Table Builder Redux store.
 * It initializes a table by ID and provides access to its state and actions.
 */

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useMemo } from "react"
import type { RootState } from "@/store"
import type { AppDispatch } from "@/store"
import {
  initTable,
  setTableData,
  setSearchTerm,
  setSorting,
  setPagination,
  toggleRowSelection,
  setVisibleColumns,
  resetTable,
} from "../store/dataTableSlice"
import {
  selectTable,
  makeSelectTableData,
  selectPagination,
  makeSelectSelectedRows,
  makeSelectVisibleColumns,
} from "../store/dataTableSelectors"

/**
 * Simple interface describing actions returned by useDataTable hook.
 */
export interface UseDataTableActions {
  setData: (data: any[], total?: number) => void
  setSearch: (value: string) => void
  setSort: (column: string, direction: "asc" | "desc") => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  toggleRow: (rowId: string | number) => void
  setVisible: (columns: string[]) => void
  reset: () => void
}

/**
 * Hook for connecting a DataTable component to Redux.
 * 
 * @param tableId - Unique ID for this table instance (e.g. "products-table").
 */
export const useDataTable = (tableId: string) => {
  const dispatch = useDispatch<AppDispatch>()

  // 🧠 Initialize table once when component mounts
  useEffect(() => {
    dispatch(initTable({ tableId }))
  }, [dispatch, tableId])

  // 🧾 Selectors (memoized with Redux)
  const selectTableDataMemo = useMemo(makeSelectTableData, [])
  const selectSelectedRowsMemo = useMemo(makeSelectSelectedRows, [])
  const selectVisibleColumnsMemo = useMemo(makeSelectVisibleColumns, [])
  
  const table = useSelector((state: RootState) => selectTable(state, tableId))
  const data = useSelector((state: RootState) => selectTableDataMemo(state, tableId))
  const pagination = useSelector((state: RootState) => selectPagination(state, tableId))
  const selectedRows = useSelector((state: RootState) => selectSelectedRowsMemo(state, tableId))
  const visibleColumns = useSelector((state: RootState) => selectVisibleColumnsMemo(state, tableId))

  // ⚙️ Actions (simplified interface)
  const actions: UseDataTableActions = useMemo(
    () => ({
      setData: (data, total) => dispatch(setTableData({ tableId, data, total })),
      setSearch: (value) => dispatch(setSearchTerm({ tableId, value })),
      setSort: (column, direction) => dispatch(setSorting({ tableId, column, direction })),
      setPage: (page) => dispatch(setPagination({ tableId, page })),
      setPageSize: (pageSize) => dispatch(setPagination({ tableId, pageSize })),
      toggleRow: (rowId) => dispatch(toggleRowSelection({ tableId, rowId })),
      setVisible: (columns) => dispatch(setVisibleColumns({ tableId, columns })),
      reset: () => dispatch(resetTable({ tableId })),
    }),
    [dispatch, tableId],
  )

  return {
    table,
    data,
    pagination,
    selectedRows,
    visibleColumns,
    actions,
  }
}
