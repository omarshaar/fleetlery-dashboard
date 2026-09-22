/**
 * FileViewerModal
 * -----------------------------
 * Uses the project's unified <Dialog /> component.
 * - Controlled by parent
 * - No trigger (modal opens programmatically)
 * - Title = filename
 * - Children = file viewer component
 */

"use client";

import { Dialog } from "@/components";
import type { FileItem } from "../types/file-item";
import { resolveFileType } from "../utils/fileTypeResolver";

// Viewers
import { ImageViewer } from "./ImageViewer";
import { PdfViewer } from "./PdfViewer";
import { VideoViewer } from "./VideoViewer";
import { AudioViewer } from "./AudioViewer";
import { TextViewer } from "./TextViewer";
import { UnsupportedViewer } from "./UnsupportedViewer";

interface FileViewerModalProps {
  file: FileItem | null;
  onClose: () => void;
}

export function FileViewerModal({ file, onClose }: FileViewerModalProps) {
  if (!file) return null;

  const meta = resolveFileType(file);

  const renderViewer = () => {
    switch (meta.type) {
      case "image":
        return <ImageViewer file={file} />;
      case "pdf":
        return <PdfViewer file={file} />;
      case "video":
        return <VideoViewer file={file} />;
      case "audio":
        return <AudioViewer file={file} />;
      case "text":
      case "code":
        return <TextViewer file={file} />;
      default:
        return <UnsupportedViewer file={file} />;
    }
  };

  return (
    <Dialog
      /** Modal is fully controlled */
      open={!!file}
      onOpenChange={(state) => {
        if (!state) onClose();
      }}
      /** No trigger: modal opens programmatically */
      trigger={null}

      /** Large size for preview */
      size="full"

      /** Optional: add extra spacing inside */
      innerClassName="p-0"
      className="p-0"

      hideXIcon={false}
    >
      {renderViewer()}
    </Dialog>
  );
}
