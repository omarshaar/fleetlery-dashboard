/**
 * @file dataTableSelectors.ts
 * @description Reusable selectors for accessing table data from Redux state.
 */

import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/store"
import type { TableState } from "./dataTableSlice"

/**
 * Get a specific table's full state.
 */
export const selectTable = (state: RootState, tableId: string): TableState | undefined =>
  state.dataTables[tableId]

/**
 * Base selector for dataTables slice
 */
const selectDataTables = (state: RootState) => state.dataTables

/**
 * Get table data rows (memoized).
 */
export const makeSelectTableData = () =>
  createSelector(
    [selectDataTables, (_state: RootState, tableId: string) => tableId],
    (dataTables, tableId) => dataTables[tableId]?.data ?? []
  )

/**
 * Get pagination info.
 */
export const selectPagination = (state: RootState, tableId: string) =>
  state.dataTables[tableId]?.pagination

/**
 * Get selected rows (memoized).
 */
export const makeSelectSelectedRows = () =>
  createSelector(
    [selectDataTables, (_state: RootState, tableId: string) => tableId],
    (dataTables, tableId) => dataTables[tableId]?.selectedRows ?? []
  )

/**
 * Get visible columns (memoized).
 */
export const makeSelectVisibleColumns = () =>
  createSelector(
    [selectDataTables, (_state: RootState, tableId: string) => tableId],
    (dataTables, tableId) => dataTables[tableId]?.visibleColumns ?? []
  )
