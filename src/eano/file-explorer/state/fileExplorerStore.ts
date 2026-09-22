/**
 * File Explorer Zustand Store
 * ---------------------------
 * Central state manager for the File Browser Block.
 *
 * Supports Windows-style selection:
 * - Single click → select only this item
 * - Ctrl + click → toggle item
 * - Shift + click → select range (anchor → clicked)
 */

import { create } from "zustand";
import type { FileViewMode } from "../types/view-mode";
import type { FileSortMode } from "../types/sorting";
import type { FileFilter } from "../types/filters";
import type { FileItem } from "../types/file-item";

export interface FileExplorerState {
  viewMode: FileViewMode;
  currentPath: string;

  /** Selected item IDs */
  selectedItems: string[];

  /** Anchor for Shift-selection */
  anchorItem: string | null;

  /** File currently opened in preview */
  activePreviewItem: FileItem | null;

  sortMode: FileSortMode | null;
  filters: FileFilter[];
  searchQuery: string;

  /** Mutators */
  setViewMode: (mode: FileViewMode) => void;
  setPath: (path: string) => void;

  /** Selection handlers */
  selectSingle: (id: string) => void;
  toggleSelection: (id: string) => void;
  selectRange: (orderedIds: string[], clickedId: string) => void;

  clearSelection: () => void;

  /** Preview */
  openPreview: (item: FileItem) => void;
  closePreview: () => void;

  /** Sorting / Filters */
  setSortMode: (mode: FileSortMode | null) => void;
  setFilters: (filters: FileFilter[]) => void;
  addFilter: (filter: FileFilter) => void;
  removeFilter: (kind: FileFilter["kind"]) => void;

  /** Search */
  setSearchQuery: (query: string) => void;

  /** Reset */
  reset: () => void;
}

export const useFileExplorerStore = create<FileExplorerState>((set, get) => ({
  viewMode: "grid",
  currentPath: "/",

  selectedItems: [],
  anchorItem: null,

  activePreviewItem: null,
  sortMode: null,
  filters: [],
  searchQuery: "",

  // -----------------------
  // Basic state
  // -----------------------

  setViewMode: (mode) => set({ viewMode: mode }),

  setPath: (path) =>
    set({
      currentPath: path,
      selectedItems: [],
      anchorItem: null,
    }),

  // -----------------------
  // Selection logic
  // -----------------------

  /** Select only this item */
  selectSingle: (id) =>
    set({
      selectedItems: [id],
      anchorItem: id,
    }),

  /** Ctrl-click toggle */
  toggleSelection: (id) => {
    const current = get().selectedItems;

    // set anchor if none
    if (!get().anchorItem) {
      set({ anchorItem: id });
    }

    if (current.includes(id)) {
      set({
        selectedItems: current.filter((x) => x !== id),
      });
    } else {
      set({
        selectedItems: [...current, id],
      });
    }
  },

  /** Shift-click range selection */
  selectRange: (orderedIds, clickedId) => {
    const anchor = get().anchorItem;

    if (!anchor) {
      // If no anchor → behave like single click
      return set({
        selectedItems: [clickedId],
        anchorItem: clickedId,
      });
    }

    const start = orderedIds.indexOf(anchor);
    const end = orderedIds.indexOf(clickedId);

    if (start === -1 || end === -1) {
      return set({
        selectedItems: [clickedId],
        anchorItem: clickedId,
      });
    }

    const from = Math.min(start, end);
    const to = Math.max(start, end);

    set({
      selectedItems: orderedIds.slice(from, to + 1),
    });
  },

  clearSelection: () =>
    set({ selectedItems: [], anchorItem: null }),

  // -----------------------
  // Preview
  // -----------------------

  openPreview: (item) => set({ activePreviewItem: item }),
  closePreview: () => set({ activePreviewItem: null }),

  // -----------------------
  // Sorting / Filtering
  // -----------------------

  setSortMode: (mode) => set({ sortMode: mode }),

  setFilters: (filters) => set({ filters }),
  addFilter: (filter) =>
    set({ filters: [...get().filters, filter] }),

  removeFilter: (kind) =>
    set({
      filters: get().filters.filter((f) => f.kind !== kind),
    }),

  // -----------------------
  // Search
  // -----------------------

  setSearchQuery: (query) => set({ searchQuery: query }),

  // -----------------------
  // Reset all
  // -----------------------

  reset: () =>
    set({
      viewMode: "grid",
      currentPath: "/",
      selectedItems: [],
      anchorItem: null,
      activePreviewItem: null,
      sortMode: null,
      filters: [],
      searchQuery: "",
    }),
}));
