/**
 * FileBrowserBlockProps
 * -----------------------------
 * Public props API for the FileBrowserBlock component.
 *
 * This defines everything the parent can control:
 * - items
 * - view mode
 * - path navigation
 * - events
 * - UI options
 * - selection change
 * - file move (drag & drop)
 * - sorting change
 * - list / grid view change
 */

import type { FileItem } from "./file-item";
import type { FileViewMode } from "./view-mode";
import type {
  FileSortField,
  FileSortDirection,
} from "./sort-types";

export interface FileBrowserBlockProps {
  /** List of files/folders to render */
  items: FileItem[];

  /** Optional toolbar title (when showToolbar is enabled) */
  toolbarTitle?: string;

  /**
   * Controlled View Mode (grid/list)
   * If provided → component becomes controlled.
   */
  viewMode?: FileViewMode;

  /** Default View Mode (used if viewMode not provided) */
  defaultViewMode?: FileViewMode;

  /** Fired whenever the view mode changes */
  onViewModeChange?: (mode: FileViewMode) => void;

  /**
   * Fired whenever the list/grid view changes.
   * Useful for persisting user preference.
   */
  onListTypeChange?: (view: FileViewMode) => void;

  /**
   * Controlled current path
   * Example: "/products/2024"
   */
  currentPath?: string;

  /** Default path if not controlled */
  defaultPath?: string;

  /** Fired when navigation changes the path */
  onPathChange?: (newPath: string) => void;

  /** Fired on single-click */
  onItemClick?: (item: FileItem) => void;

  /** Fired on double-click or open action */
  onItemOpen?: (item: FileItem) => void;

  /** Fired on right-click (context menu) */
  onItemRightClick?: (item: FileItem, event: React.MouseEvent) => void;

  /**
   * Fired whenever selection changes.
   * Receives the full array of selected FileItem objects.
   */
  onSelectionChange?: (selectedItems: FileItem[]) => void;

  /**
   * Fired when one or multiple files/folders
   * are dropped onto a target folder.
   */
  onFileMove?: (payload: {
    items: FileItem[];
    targetFolder: FileItem;
  }) => void;

  /**
   * Fired whenever sorting changes.
   * Useful for persisting sort preferences.
   */
  onSortingChange?: (payload: {
    field: FileSortField;
    direction: FileSortDirection;
  }) => void;

  /** Show or hide default toolbar */
  showToolbar?: boolean;

  /** Custom CSS class name */
  className?: string;

  /** Default sorting field (used only if no localStorage value exists) */
  defaultSort?: FileSortField;

  /** Default sort direction (used only if no localStorage value exists) */
  defaultSortDirection?: FileSortDirection;

  /** Default view type (used only if no localStorage value exists) */
  defaultViewType?: FileViewMode;
}
