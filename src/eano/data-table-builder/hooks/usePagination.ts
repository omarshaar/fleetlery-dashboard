/**
 * @file usePagination.ts
 * @description Simple client-side pagination hook for the Data Table Builder.
 */

import { useMemo, useState } from "react"

export interface PaginationState {
  page: number
  pageSize: number
}

export interface UsePaginationResult<T> {
  paginatedData: T[]
  pagination: PaginationState
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

/**
 * Handles client-side pagination logic.
 */
export function usePagination<T>(data: T[], initialPageSize = 10): UsePaginationResult<T> {
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: initialPageSize })

  const totalPages = Math.ceil(data.length / pagination.pageSize) || 1

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return data.slice(start, end)
  }, [data, pagination])

  const setPage = (page: number) =>
    setPagination((prev) => ({ ...prev, page: Math.max(1, Math.min(page, totalPages)) }))

  const setPageSize = (size: number) =>
    setPagination((prev) => ({ ...prev, page: 1, pageSize: size }))

  return { paginatedData, pagination, totalPages, setPage, setPageSize }
}
