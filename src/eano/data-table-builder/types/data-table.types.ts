/**
 * @file data-table.types.ts
 * @description Type definitions for the EANO Data Table Builder.
 * These types define the structure of columns, features, and props for the DataTable component.
 */

import type * as React from "react"

/**
 * Column type variants supported by the table.
 */
export type ColumnType =
  | "text"
  | "number"
  | "image"
  | "badge"
  | "link"
  | "date"
  | "currency"
  | "status"
  | "custom"

/**
 * Text alignment for a column cell.
 */
export type Align = "left" | "center" | "right"

/**
 * Configuration for a single column.
 */
export interface ColumnConfig<T extends Record<string, any>> {
  /** Property key inside the data object */
  key: keyof T | string
  /** Visible label of the column header */
  label: string
  /** Type of column content */
  type?: ColumnType
  /** Optional width between 0–12 representing the fraction of table width. */
  width?: number
  /** Minimum width for this column (in px or CSS string like '120px' or '10rem') */
  minWidth?: number | string
  /** Maximum width for this column (in px or CSS string like '200px' or '20rem') */
  maxWidth?: number | string
  /** Text alignment */
  align?: Align
  /** Whether this column is sortable */
  sortable?: boolean
  /** Whether this column supports search filtering */
  searchable?: boolean
  /** Whether this column can be toggled (shown/hidden) */
  hideable?: boolean
  /** Badge color variants if the type is "badge" */
  badgeVariants?: Record<string, string>
  /** Custom render function for full control */
  render?: (value: any, row: T) => React.ReactNode
}

/**
 * Row-level action definition (e.g. Edit, Delete).
 */
export interface RowAction<T extends Record<string, any>> {
  label: string
  icon?: React.ComponentType<any>
  onClick: (row: T) => void
}

/**
 * Predefined feature presets for common use cases
 */
export type FeaturePreset = 
  | "simple"          // No features
  | "basic"           // Search + Sort
  | "standard"        // Search + Sort + Pagination
  | "advanced"        // Search + Sort + Pagination + Selection + Column Toggle
  | "full"            // All features enabled

/**
 * Feature toggles for DataTable (search, sorting, pagination...).
 */
export interface DataTableFeatures<T extends Record<string, any>> {
  /** Enable search bar */
  /**
   * Search configuration.
   * mode: "local" filters existing data client-side
   * mode: "server" triggers callback after debounce
   */
  search?: {
    mode: "local" | "server"
    placeholder?: string
    searchColumns?: (keyof T | string)[]
    onServerSearch?: (term: string) => void | Promise<void>
    debounceMs?: number
    /** Show results count */
    showResultsCount?: boolean
    /** Enable clear button */
    showClearButton?: boolean
    /** Minimum characters before search triggers */
    minChars?: number
    /** Case sensitive search (local mode only) */
    caseSensitive?: boolean
    /** Error handler for server search */
    onSearchError?: (error: Error) => void
  }

  /** Enable client or server-side sorting */
  sorting?: boolean

  /** Pagination settings */
  pagination?: {
    /** Mode of pagination */
    type: "client" | "server"
    /** Items per page */
    pageSize?: number
    /** Total rows (for server mode) */
    totalCount?: number
    /** Current active page */
    currentPage?: number
  }

  /** Enable row selection */
  selectable?: boolean

  /** Allow toggling visibility of columns */
  hideableColumns?: boolean

  /** Define optional bulk or row actions */
  actions?: RowAction<T>[]

  /** Future: filters for server or client */
  filters?: Record<string, any>
}


/**
 * Main props for DataTable component.
 */
export interface DataTableProps<T extends Record<string, any>> {
  /** Unique table identifier (used in Redux store) */
  tableId: string
  /** Table title (optional) */
  title?: string
  /** Optional description below title */
  description?: string
  /** Data rows to render */
  data: T[]
  /** Column definitions */
  columns: ColumnConfig<T>[]
  
  // ============================================================================
  // Feature Configuration (3 ways to use)
  // ============================================================================
  
  /**
   * Method 1: Use a preset (simplest)
   * @example preset="standard" // enables search + sort + pagination
   */
  preset?: FeaturePreset
  
  /**
   * Method 2: Enable features with booleans (simple)
   * @example enableSearch enablePagination
   */
  enableSearch?: boolean
  enableSorting?: boolean
  enablePagination?: boolean
  enableSelection?: boolean
  enableColumnToggle?: boolean
  
  /**
   * Method 3: Full control with features object (advanced)
   * This overrides preset and boolean shortcuts
   */
  features?: DataTableFeatures<T>
  
  // ============================================================================
  
  /** Row key generator for stable rendering */
  rowKey?: (row: T, index: number) => string | number
  /** Optional class name */
  className?: string
  /** Whether the table is currently loading */
  loading?: boolean
  /** Message to display when no data is available */
  emptyMessage?: string
}
