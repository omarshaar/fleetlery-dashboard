"use client";

/**
 * FileBrowser Demo Page
 * -----------------------------
 * This page allows testing the full FileBrowserBlock
 * with fake data (folders, images, pdfs, videos, documents).
 */

import FileBrowserBlock from "@/eano/file-explorer/FileBrowserBlock";
import type { FileItem } from "@/eano/file-explorer/types/file-item";
import type { FileViewMode } from "@/eano/file-explorer/types/view-mode";
import type {
  FileSortField,
  FileSortDirection,
} from "@/eano/file-explorer/types/sort-types";

export default function FileBrowserDemoPage() {
  // ---------------------------
  // Fake Data
  // ---------------------------
  const files: FileItem[] = [
    { id: "1", name: "Pictures", type: "folder" },
    { id: "2", name: "Work Documents", type: "folder" },
    {
      id: "3",
      name: "sunset.jpg",
      type: "image",
      url: "https://picsum.photos/400/300",
      sizeBytes: 204800,
    },
    {
      id: "4",
      name: "mountains.png",
      type: "image",
      url: "https://picsum.photos/400/301",
      sizeBytes: 305600,
    },
    {
      id: "5",
      name: "manual.pdf",
      type: "pdf",
      url: "/example/manual.pdf",
      sizeBytes: 502400,
    },
    {
      id: "6",
      name: "promo.mp4",
      type: "video",
      url: "https://vielflatvereint.eyadsattout.de/lv_0_20250906163745.mp4",
      sizeBytes: 10485760,
    },
    {
      id: "7",
      name: "notes.txt",
      type: "text",
      url: "/files/test.txt",
      sizeBytes: 5400,
    },
    {
      id: "8",
      name: "archive.zip",
      type: "archive",
      sizeBytes: 88000,
    },
  ];

  // ---------------------------
  // Existing Event Handlers
  // ---------------------------
  const handleItemOpen = (item: FileItem) => {
    console.log("📂 OPEN:", item);
  };

  const handleItemClick = (item: FileItem) => {
    console.log("🖱️ CLICK:", item);
  };

  const handleItemRightClick = (item: FileItem) => {
    console.log("📌 RIGHT CLICK:", item);
  };

  const handlePathChange = (path: string) => {
    console.log("📁 PATH CHANGED:", path);
  };

  const handleSelectionChange = (selectedItems: FileItem[]) => {
    console.log("✅ SELECTION CHANGED:", selectedItems);
  };

  const handleFileMove = (payload: {
    items: FileItem[];
    targetFolder: FileItem;
  }) => {
    console.group("🚚 FILE MOVE");
    console.log(
      "Items:",
      payload.items.map((i) => ({ id: i.id, name: i.name }))
    );
    console.log("Target folder:", payload.targetFolder.name);
    console.groupEnd();
  };

  // ---------------------------
  // ✅ NEW: Sorting / View Events
  // ---------------------------

  const handleSortingChange = (payload: {
    field: FileSortField;
    direction: FileSortDirection;
  }) => {
    console.log("↕️ SORTING CHANGED:", payload);
  };

  const handleListTypeChange = (view: FileViewMode) => {
    console.log("🧭 VIEW MODE CHANGED:", view);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div>
      <FileBrowserBlock
        items={files}
        showToolbar={true}
        onItemOpen={handleItemOpen}
        onItemClick={handleItemClick}
        onItemRightClick={handleItemRightClick}
        onPathChange={handlePathChange}
        onSelectionChange={handleSelectionChange}
        onFileMove={handleFileMove}
        onSortingChange={handleSortingChange}
        onListTypeChange={handleListTypeChange}
        defaultSort="name"
        defaultSortDirection="asc"
        defaultViewType="list"
      />
    </div>
  );
}
