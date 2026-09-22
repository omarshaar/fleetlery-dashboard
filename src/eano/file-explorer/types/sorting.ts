/**
 * FileSortField
 *
 * Which field is used to sort the file list.
 */
export type FileSortField = "name" | "size" | "type" | "createdAt" | "updatedAt";

/**
 * FileSortDirection
 *
 * Sorting direction for the selected field.
 */
export type FileSortDirection = "asc" | "desc";

/**
 * FileSortMode
 *
 * Combined description of how the file list should be sorted.
 */
export interface FileSortMode {
  field: FileSortField;
  direction: FileSortDirection;
}
