/**
 * @file dataTableSlice.ts
 * @description Redux slice for managing dynamic data tables. 
 * Each table is identified by a unique tableId.
 */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface TableState {
  data: any[]
  searchTerm: string
  filters: Record<string, any>
  sorting: { column: string | null; direction: "asc" | "desc" | null }
  pagination: { page: number; pageSize: number; total: number }
  selectedRows: (string | number)[]
  visibleColumns: string[]
}

export interface DataTablesState {
  [tableId: string]: TableState
}

/**
 * Creates a new default table state.
 */
const createDefaultState = (): TableState => ({
  data: [],
  searchTerm: "",
  filters: {},
  sorting: { column: null, direction: null },
  pagination: { page: 1, pageSize: 10, total: 0 },
  selectedRows: [],
  visibleColumns: [],
})

const initialState: DataTablesState = {}

/**
 * Redux slice for managing all data tables.
 * Each table is stored by its tableId.
 */
export const dataTableSlice = createSlice({
  name: "dataTables",
  initialState,
  reducers: {
    /** Initialize a new table with its default state */
    initTable: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload
      if (!state[tableId]) {
        state[tableId] = createDefaultState()
      }
    },

    /** Set or replace the table data */
    setTableData: (state, action: PayloadAction<{ tableId: string; data: any[]; total?: number }>) => {
      const { tableId, data, total } = action.payload
      if (!state[tableId]) state[tableId] = createDefaultState()
      state[tableId].data = data
      if (typeof total === "number") {
        state[tableId].pagination.total = total
      }
    },

    /** Update the search term for a table */
    setSearchTerm: (state, action: PayloadAction<{ tableId: string; value: string }>) => {
      const { tableId, value } = action.payload
      if (!state[tableId]) return
      state[tableId].searchTerm = value
    },

    /** Update sorting column and direction */
    setSorting: (state, action: PayloadAction<{ tableId: string; column: string; direction: "asc" | "desc" }>) => {
      const { tableId, column, direction } = action.payload
      if (!state[tableId]) return
      state[tableId].sorting = { column, direction }
    },

    /** Update pagination info (page or pageSize) */
    setPagination: (state, action: PayloadAction<{ tableId: string; page?: number; pageSize?: number }>) => {
      const { tableId, page, pageSize } = action.payload
      if (!state[tableId]) return
      if (page !== undefined) state[tableId].pagination.page = page
      if (pageSize !== undefined) state[tableId].pagination.pageSize = pageSize
    },

    /** Toggle row selection */
    toggleRowSelection: (state, action: PayloadAction<{ tableId: string; rowId: string | number }>) => {
      const { tableId, rowId } = action.payload
      if (!state[tableId]) return
      const index = state[tableId].selectedRows.indexOf(rowId)
      if (index === -1) {
        state[tableId].selectedRows.push(rowId)
      } else {
        state[tableId].selectedRows.splice(index, 1)
      }
    },

    /** Set visible columns */
    setVisibleColumns: (state, action: PayloadAction<{ tableId: string; columns: string[] }>) => {
      const { tableId, columns } = action.payload
      if (!state[tableId]) return
      state[tableId].visibleColumns = columns
    },

    /** Reset a specific table to its default state */
    resetTable: (state, action: PayloadAction<{ tableId: string }>) => {
      const { tableId } = action.payload
      state[tableId] = createDefaultState()
    },
  },
})

export const {
  initTable,
  setTableData,
  setSearchTerm,
  setSorting,
  setPagination,
  toggleRowSelection,
  setVisibleColumns,
  resetTable,
} = dataTableSlice.actions

export const dataTableReducer = dataTableSlice.reducer
