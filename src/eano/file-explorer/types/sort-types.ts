/**
 * File sorting field options.
 * These correspond to sortable fields inside FileItem.
 */
export type FileSortField =
  | "name"
  | "type"
  | "sizeBytes"
  | "createdAt"
  | "updatedAt"
  | "extension";

/**
 * Sort direction
 */
export type FileSortDirection = "asc" | "desc";
