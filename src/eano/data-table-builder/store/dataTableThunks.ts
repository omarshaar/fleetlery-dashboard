/**
 * @file dataTableThunks.ts
 * @description Example async thunks for fetching table data from API.
 * You can expand these to connect with Laravel API endpoints later.
 */

import { createAsyncThunk } from "@reduxjs/toolkit"
import { setTableData } from "./dataTableSlice"

/**
 * Example thunk to fetch table data from an API.
 */
export const fetchTableData = createAsyncThunk(
  "dataTables/fetchTableData",
  async (params: { tableId: string; url: string }, { dispatch }) => {
    const { tableId, url } = params
    const response = await fetch(url)
    const data = await response.json()
    dispatch(setTableData({ tableId, data: data.items ?? data, total: data.total ?? data.length }))
  },
)
