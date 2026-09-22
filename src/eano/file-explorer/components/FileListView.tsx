/**
 * FileListView
 * -----------------------------
 * Windows-11 style list layout with:
 * - Single selection
 * - Ctrl-selection
 * - Shift-range selection
 * - Thumbnail previews
 * - Drag & Drop (move into folder)
 */

"use client";

import { cn } from "@/eano/lib/utils";
import { resolveFileType } from "../utils/fileTypeResolver";

import {
  useSelectedItems,
  useSelectSingle,
  useToggleSelection,
  useSelectRange,
  useClearSelection,
} from "../state/selectors";

import { useTouchMode } from "../hooks/useTouchMode";

import type { FileItem } from "../types/file-item";
import { useEffect, useRef } from "react";

interface FileListViewProps {
  items: FileItem[];
  onOpen: (item: FileItem) => void;
  onClickItem?: (item: FileItem) => void;
  onRightClickItem?: (item: FileItem, event: React.MouseEvent) => void;

  /** Fired when items are dropped onto a folder */
  onFileMove?: (payload: {
    items: FileItem[];
    targetFolder: FileItem;
  }) => void;
}

const DRAG_MIME = "application/x-eano-file-ids";

export function FileListView({
  items,
  onOpen,
  onClickItem,
  onRightClickItem,
  onFileMove,
}: FileListViewProps) {
  const touchMode = useTouchMode();

  const selectedItems = useSelectedItems();
  const selectSingle = useSelectSingle();
  const toggleSelection = useToggleSelection();
  const selectRange = useSelectRange();
  const clearSelection = useClearSelection();

  const suppressNextClickRef = useRef(false);
  const longPressRef = useRef<{
    timerId: number | null;
    pointerId: number | null;
    startX: number;
    startY: number;
    moved: boolean;
    fired: boolean;
  }>(
    {
      timerId: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      moved: false,
      fired: false,
    }
  );

  const orderedIds = items.map((x) => x.id);

  // ------------------------------
  // Click-away (clear selection)
  // ------------------------------
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        clearSelection();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [clearSelection]);

  // ------------------------------
  // Drag helpers
  // ------------------------------
  const getDraggedIds = (draggedId: string) => {
    return selectedItems.includes(draggedId)
      ? selectedItems
      : [draggedId];
  };

  const handleDragStart = (
    e: React.DragEvent,
    draggedId: string
  ) => {
    const ids = getDraggedIds(draggedId);

    e.dataTransfer.setData(DRAG_MIME, JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverFolder = (
    e: React.DragEvent,
    folder: FileItem
  ) => {
    if (folder.type !== "folder") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnFolder = (
    e: React.DragEvent,
    folder: FileItem
  ) => {
    if (folder.type !== "folder") return;

    e.preventDefault();
    e.stopPropagation();

    const raw = e.dataTransfer.getData(DRAG_MIME);
    if (!raw) return;

    let ids: string[] = [];
    try {
      ids = JSON.parse(raw);
    } catch {
      return;
    }

    // Prevent dropping folder onto itself
    if (ids.includes(folder.id)) return;

    const draggedItems = items.filter((it) =>
      ids.includes(it.id)
    );

    if (draggedItems.length === 0) return;

    onFileMove?.({
      items: draggedItems,
      targetFolder: folder,
    });
  };

  const clearLongPress = () => {
    if (longPressRef.current.timerId) {
      window.clearTimeout(longPressRef.current.timerId);
    }
    longPressRef.current.timerId = null;
    longPressRef.current.pointerId = null;
    longPressRef.current.moved = false;
    longPressRef.current.fired = false;
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col border rounded-md overflow-hidden dark:bg-black bg-white"
    >
      <div className="grid grid-cols-12 py-3 px-3 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
        <div className="col-span-6">Name</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-1 text-right">—</div>
      </div>

      <div className="flex flex-col divide-y">
        {items.map((item) => {
          const meta = resolveFileType(item);
          const isSelected = selectedItems.includes(item.id);

          let previewNode: React.ReactNode;

          if (item.type === "image" && item.url) {
            previewNode = (
              <img
                src={item.url}
                alt={item.name}
                className="w-12 h-12 rounded object-cover border"
              />
            );
          } else if (item.type === "video") {
            if (item.thumbnailUrl) {
              previewNode = (
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover border"
                />
              );
            } else if (item.url) {
              previewNode = (
                <video
                  src={item.url}
                  className="w-12 h-12 rounded object-cover border"
                  muted
                  playsInline
                />
              );
            } else {
              previewNode = <div className="w-12 h-12">{meta.icon}</div>;
            }
          } else {
            previewNode = <div className="w-12 h-12">{meta.icon}</div>;
          }

          return (
            <div
              key={item.id}
              draggable={!touchMode}
              className={cn(
                "grid grid-cols-12 py-2 px-3 text-sm cursor-pointer select-none transition-colors",
                "touch-manipulation",
                isSelected
                  ? "dark:bg-white/8 bg-black/8"
                  : "hover:bg-muted/30"
              )}
              onDragStart={
                touchMode
                  ? undefined
                  : (e) => handleDragStart(e, item.id)
              }
              onDragOver={
                touchMode
                  ? undefined
                  : (e) => handleDragOverFolder(e, item)
              }
              onDrop={
                touchMode
                  ? undefined
                  : (e) => handleDropOnFolder(e, item)
              }
              onPointerDown={(e) => {
                if (!touchMode) return;
                if (e.pointerType !== "touch") return;

                e.stopPropagation();

                clearLongPress();

                longPressRef.current.pointerId = e.pointerId;
                longPressRef.current.startX = e.clientX;
                longPressRef.current.startY = e.clientY;
                longPressRef.current.moved = false;
                longPressRef.current.fired = false;

                longPressRef.current.timerId = window.setTimeout(() => {
                  longPressRef.current.fired = true;
                  suppressNextClickRef.current = true;

                  selectSingle(item.id);
                  onClickItem?.(item);

                  const ev = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: true,
                    clientX: longPressRef.current.startX,
                    clientY: longPressRef.current.startY,
                  });

                  onRightClickItem?.(
                    item,
                    ev as unknown as React.MouseEvent
                  );
                }, 550);
              }}
              onPointerMove={(e) => {
                if (!touchMode) return;
                if (e.pointerType !== "touch") return;
                if (longPressRef.current.pointerId !== e.pointerId) return;

                const dx = Math.abs(e.clientX - longPressRef.current.startX);
                const dy = Math.abs(e.clientY - longPressRef.current.startY);
                if (dx > 10 || dy > 10) {
                  longPressRef.current.moved = true;
                  if (longPressRef.current.timerId) {
                    window.clearTimeout(longPressRef.current.timerId);
                    longPressRef.current.timerId = null;
                  }
                }
              }}
              onPointerUp={(e) => {
                if (!touchMode) return;
                if (e.pointerType !== "touch") return;
                if (longPressRef.current.pointerId !== e.pointerId) return;

                e.stopPropagation();

                const fired = longPressRef.current.fired;
                const moved = longPressRef.current.moved;

                if (longPressRef.current.timerId) {
                  window.clearTimeout(longPressRef.current.timerId);
                }

                clearLongPress();

                if (fired || moved) return;

                suppressNextClickRef.current = true;
                selectSingle(item.id);
                onClickItem?.(item);
                onOpen(item);
              }}
              onPointerCancel={(e) => {
                if (!touchMode) return;
                if (e.pointerType !== "touch") return;
                if (longPressRef.current.pointerId !== e.pointerId) return;
                clearLongPress();
              }}
              onClick={(e) => {
                if (touchMode && suppressNextClickRef.current) {
                  suppressNextClickRef.current = false;
                  return;
                }

                e.stopPropagation();

                const shift = e.shiftKey;
                const ctrl = e.ctrlKey || e.metaKey;

                if (shift) {
                  selectRange(orderedIds, item.id);
                  onClickItem?.(item);
                  return;
                }

                if (ctrl) {
                  toggleSelection(item.id);
                  onClickItem?.(item);
                  return;
                }

                selectSingle(item.id);
                onClickItem?.(item);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onOpen(item);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRightClickItem?.(item, e);
              }}
            >
              <div className="col-span-6 flex items-center gap-3">
                {previewNode}
                <span className="truncate">{item.name}</span>
              </div>

              <div className="col-span-3 capitalize opacity-80">
                {item.type}
              </div>

              <div className="col-span-2 text-right opacity-80">
                {item.sizeBytes
                  ? formatBytes(item.sizeBytes)
                  : "—"}
              </div>

              <div className="col-span-1 text-right opacity-30">
                …
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
