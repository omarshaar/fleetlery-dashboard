/**
 * Zustand Selectors for File Explorer
 * -----------------------------------
 * These selectors provide highly optimized access to
 * specific pieces of state inside the File Explorer store.
 */

import { useFileExplorerStore } from "./fileExplorerStore";
import type { FileItem } from "../types/file-item";
import type { FileViewMode } from "../types/view-mode";
import type { FileSortMode } from "../types/sorting";
import type { FileFilter } from "../types/filters";

// ------------------------------
// BASIC VIEW SELECTORS
// ------------------------------

export const useViewMode = (): FileViewMode =>
  useFileExplorerStore((s) => s.viewMode);

export const useCurrentPath = (): string =>
  useFileExplorerStore((s) => s.currentPath);

export const useSelectedItems = (): string[] =>
  useFileExplorerStore((s) => s.selectedItems);

export const useAnchorItem = (): string | null =>
  useFileExplorerStore((s) => s.anchorItem);

export const useActivePreviewItem = (): FileItem | null =>
  useFileExplorerStore((s) => s.activePreviewItem);

export const useSortMode = (): FileSortMode | null =>
  useFileExplorerStore((s) => s.sortMode);

export const useFilters = (): FileFilter[] =>
  useFileExplorerStore((s) => s.filters);

export const useSearchQuery = (): string =>
  useFileExplorerStore((s) => s.searchQuery);

// ------------------------------
// MUTATOR SELECTORS
// ------------------------------

export const useSetViewMode = () =>
  useFileExplorerStore((s) => s.setViewMode);

export const useSetPath = () =>
  useFileExplorerStore((s) => s.setPath);

export const useSelectSingle = () =>
  useFileExplorerStore((s) => s.selectSingle);

export const useToggleSelection = () =>
  useFileExplorerStore((s) => s.toggleSelection);

export const useSelectRange = () =>
  useFileExplorerStore((s) => s.selectRange);

export const useClearSelection = () =>
  useFileExplorerStore((s) => s.clearSelection);

export const useOpenPreview = () =>
  useFileExplorerStore((s) => s.openPreview);

export const useClosePreview = () =>
  useFileExplorerStore((s) => s.closePreview);

export const useSetSortMode = () =>
  useFileExplorerStore((s) => s.setSortMode);

export const useSetFilters = () =>
  useFileExplorerStore((s) => s.setFilters);

export const useAddFilter = () =>
  useFileExplorerStore((s) => s.addFilter);

export const useRemoveFilter = () =>
  useFileExplorerStore((s) => s.removeFilter);

export const useSetSearchQuery = () =>
  useFileExplorerStore((s) => s.setSearchQuery);

export const useResetExplorer = () =>
  useFileExplorerStore((s) => s.reset);
