/**
 * VideoViewer
 * -----------------------------
 * A clean HTML5 video player inside the viewer modal.
 *
 * - Supports mp4, webm, mov…
 * - Native browser controls
 * - Responsive
 * - No external libraries (fast + lightweight)
 */

"use client";

import type { FileItem } from "../types/file-item";

interface VideoViewerProps {
  file: FileItem;
}

export function VideoViewer({ file }: VideoViewerProps) {
  if (!file.url) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        No video URL provided.
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] flex items-center justify-center bg-black rounded-lg overflow-hidden">
      <video
        src={file.url}
        controls
        className="w-full h-full object-contain"
      />
    </div>
  );
}
