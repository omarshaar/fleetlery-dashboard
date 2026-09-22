/**
 * PdfViewer
 * -----------------------------
 * A lightweight and fast PDF viewer using native browser rendering.
 *
 * - Uses <iframe> for maximum compatibility
 * - No external libraries (fastest loading)
 * - Full scroll + zoom support inside the modal
 */

"use client";

import type { FileItem } from "../types/file-item";

interface PdfViewerProps {
  file: FileItem;
}

export function PdfViewer({ file }: PdfViewerProps) {
  if (!file.url) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        No PDF URL provided.
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] rounded-lg overflow-hidden border bg-background">
      <iframe
        src={file.url}
        title={file.name}
        className="w-full h-full"
        style={{ border: "none" }}
      />
    </div>
  );
}
