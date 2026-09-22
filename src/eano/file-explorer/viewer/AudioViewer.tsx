/**
 * AudioViewer
 * -----------------------------
 * Simple native audio player.
 *
 * - Supports mp3, wav, ogg...
 * - Clean UI
 * - Fast loading
 * - No external libraries required
 */

"use client";

import type { FileItem } from "../types/file-item";

interface AudioViewerProps {
  file: FileItem;
}

export function AudioViewer({ file }: AudioViewerProps) {
  if (!file.url) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        No audio file URL provided.
      </div>
    );
  }

  return (
    <div className="w-full h-[120px] flex flex-col items-center justify-center rounded-lg bg-muted px-6">
      <div className="text-sm font-medium mb-3 truncate w-full text-center">
        {file.name}
      </div>

      <audio
        src={file.url}
        controls
        className="w-full max-w-xl"
      />
    </div>
  );
}
