/**
 * UnsupportedViewer
 * -----------------------------
 * Shown when a file type cannot be previewed.
 *
 * - Displays a friendly message
 * - Shows basic file info
 */

"use client";

import type { FileItem } from "../types/file-item";
import { resolveFileType } from "../utils/fileTypeResolver";

interface UnsupportedViewerProps {
  file: FileItem;
}

export function UnsupportedViewer({ file }: UnsupportedViewerProps) {
  const meta = resolveFileType(file);

  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center text-center p-6">
      <div className="mb-4 opacity-70 w-20 h-20">
        {meta.icon}
      </div>

      <h2 className="text-lg font-semibold mb-2">{file.name}</h2>

      <p className="text-sm text-muted-foreground mb-4">
        This file type cannot be previewed.
      </p>

      {file.sizeBytes && (
        <div className="text-xs text-muted-foreground">
          Size: {formatBytes(file.sizeBytes)}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = (bytes / Math.pow(1024, i)).toFixed(1);
  return `${val} ${sizes[i]}`;
}
