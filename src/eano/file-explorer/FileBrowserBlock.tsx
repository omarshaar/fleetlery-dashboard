"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/eano/lib/utils";

import type { FileBrowserBlockProps } from "@/eano/file-explorer/types/browser-props";

import {
  useViewMode,
  useSetViewMode,
  useCurrentPath,
  useSetPath,
  useActivePreviewItem,
  useOpenPreview,
  useClosePreview,
  useSelectedItems,
} from "@/eano/file-explorer/state/selectors";

import { FileGridView } from "@/eano/file-explorer/components/FileGridView";
import { FileListView } from "@/eano/file-explorer/components/FileListView";
import { FileViewerModal } from "@/eano/file-explorer/viewer/FileViewerModal";
import { FileToolbar } from "@/eano/file-explorer/components/FileToolbar";

import type { FileItem } from "./types";
import type {
  FileSortField,
  FileSortDirection,
} from "@/eano/file-explorer/types/sort-types";

// ---------------------------------------------
// LocalStorage keys
// ---------------------------------------------
const LS_SORT_KEY = "eano:file-explorer:sort";
const LS_VIEW_KEY = "eano:file-explorer:view";

export default function FileBrowserBlock(props: FileBrowserBlockProps) {
  const {
    items,
    className,

    toolbarTitle,

    viewMode: externalViewMode,
    defaultViewMode = "grid",
    onViewModeChange,
    onListTypeChange,

    currentPath: externalPath,
    defaultPath = "/",
    onPathChange,

    onItemClick,
    onItemOpen,
    onItemRightClick,
    onSelectionChange,

    onFileMove,
    onSortingChange,

    showToolbar = true,

    defaultSort,
    defaultSortDirection,
    defaultViewType,
  } = props;

  // -----------------------------------------------------
  // Zustand State
  // -----------------------------------------------------
  const viewMode = useViewMode();
  const setViewMode = useSetViewMode();

  const currentPath = useCurrentPath();
  const setPath = useSetPath();

  const activePreviewItem = useActivePreviewItem();
  const openPreview = useOpenPreview();
  const closePreview = useClosePreview();

  const selectedIds = useSelectedItems();

  // -----------------------------------------------------
  // Sorting State (local)
  // -----------------------------------------------------
  const [sortField, setSortField] = useState<FileSortField>("name");
  const [sortDirection, setSortDirection] =
    useState<FileSortDirection>("asc");

  // -----------------------------------------------------
  // ⭐ FIX: prevent re-initialization after first load
  // -----------------------------------------------------
  const didInitRef = useRef(false);

  // -----------------------------------------------------
  // ⭐ FIX: Initial load (ONCE)
  // Priority:
  // 1. external props
  // 2. localStorage
  // 3. defaults
  // -----------------------------------------------------
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    // ---- View Mode ----
    if (externalViewMode) {
      setViewMode(externalViewMode);
    } else {
      const storedView = localStorage.getItem(LS_VIEW_KEY);
      if (storedView === "grid" || storedView === "list") {
        setViewMode(storedView);
      } else {
        setViewMode(defaultViewType ?? defaultViewMode);
      }
    }

    // ---- Sorting ----
    const rawSort = localStorage.getItem(LS_SORT_KEY);
    if (rawSort) {
      try {
        const parsed = JSON.parse(rawSort);
        if (parsed.field) setSortField(parsed.field);
        if (parsed.direction) setSortDirection(parsed.direction);
      } catch {
        // ignore invalid storage
      }
    } else {
      if (defaultSort) setSortField(defaultSort);
      if (defaultSortDirection) setSortDirection(defaultSortDirection);
    }
  }, [externalViewMode, defaultViewMode, defaultViewType, defaultSort, defaultSortDirection, setViewMode]);

  // -----------------------------------------------------
  // Persist View + callbacks
  // -----------------------------------------------------
  useEffect(() => {
    if (!didInitRef.current) return;

    localStorage.setItem(LS_VIEW_KEY, viewMode);
    onListTypeChange?.(viewMode);
  }, [viewMode, onListTypeChange]);

  // -----------------------------------------------------
  // Persist Sorting + callback
  // -----------------------------------------------------
  useEffect(() => {
    if (!didInitRef.current) return;

    const payload = { field: sortField, direction: sortDirection };
    localStorage.setItem(LS_SORT_KEY, JSON.stringify(payload));
    onSortingChange?.(payload);
  }, [sortField, sortDirection, onSortingChange]);

  // -----------------------------------------------------
  // Controlled Path Sync
  // -----------------------------------------------------
  useEffect(() => {
    if (externalPath !== undefined) setPath(externalPath);
    else setPath(defaultPath);
  }, [externalPath, defaultPath, setPath]);

  // -----------------------------------------------------
  // Selection Change → return selected items to user
  // -----------------------------------------------------
  useEffect(() => {
    if (!onSelectionChange) return;

    const selectedItems = items.filter((item) =>
      selectedIds.includes(item.id)
    );

    onSelectionChange(selectedItems);
  }, [selectedIds, items, onSelectionChange]);

  // -----------------------------------------------------
  // Sorting Logic
  // -----------------------------------------------------
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let x: any = a[sortField] ?? "";
      let y: any = b[sortField] ?? "";

      if (typeof x === "string") x = x.toLowerCase();
      if (typeof y === "string") y = y.toLowerCase();

      if (x < y) return sortDirection === "asc" ? -1 : 1;
      if (x > y) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortField, sortDirection]);

  // -----------------------------------------------------
  // Event Handlers
  // -----------------------------------------------------
  const normalizePath = (path: string): string => {
    if (!path) return "/";
    const trimmed = path.trim();
    if (!trimmed) return "/";

    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
    if (collapsed === "/") return "/";
    return collapsed.replace(/\/+$/, "");
  };

  const joinPath = (basePath: string, segment: string): string => {
    const base = normalizePath(basePath);
    const safeSegment = (segment ?? "")
      .trim()
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

    if (!safeSegment) return base;
    if (base === "/") return `/${safeSegment}`;
    return `${base}/${safeSegment}`;
  };

  const handleClickItem = (item: FileItem) => {
    onItemClick?.(item);
  };

  const handleRightClickItem = (
    item: FileItem,
    e: React.MouseEvent
  ) => {
    onItemRightClick?.(item, e);
  };

  const handleOpenItem = (item: FileItem) => {
    if (item.type === "folder") {
      const newPath = item.path
        ? normalizePath(item.path)
        : joinPath(currentPath, item.name);
      setPath(newPath);
      onPathChange?.(newPath);
      return;
    }

    openPreview(item);
    onItemOpen?.(item);
  };

  // -----------------------------------------------------
  // Render correct view
  // -----------------------------------------------------
  const renderView = () => {
    if (viewMode === "list") {
      return (
        <FileListView
          items={sortedItems}
          onClickItem={handleClickItem}
          onOpen={handleOpenItem}
          onRightClickItem={handleRightClickItem}
          onFileMove={onFileMove}
        />
      );
    }

    return (
      <FileGridView
        items={sortedItems}
        onClickItem={handleClickItem}
        onOpen={handleOpenItem}
        onRightClickItem={handleRightClickItem}
        onFileMove={onFileMove}
      />
    );
  };

  // -----------------------------------------------------
  // Final Render
  // -----------------------------------------------------
  return (
    <div className={cn("w-full", className)}>
      {showToolbar && (
        <FileToolbar
          title={toolbarTitle}
          currentView={viewMode}
          onChangeView={(mode) => {
            setViewMode(mode);
            onViewModeChange?.(mode);
          }}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
        />
      )}

      {renderView()}

      <FileViewerModal file={activePreviewItem} onClose={closePreview} />
    </div>
  );
}
