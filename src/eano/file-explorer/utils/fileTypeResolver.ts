/**
 * File Type Resolver
 * -------------------
 * Centralized logic for mapping FileItem -> UI metadata.
 *
 * This resolver:
 * - Detects file type from extension or mimeType
 * - Provides icon, viewer support, and preview support
 * - Keeps a single source of truth for all file-display behaviors
 */

import React from "react";
import type { FileItem, FileItemType } from "../types/file-item";
import FolderIcon from "@/assets/icons/FileBrowser/folderIcon.png";
import PDFIcon from "@/assets/icons/FileBrowser/pdfIcon.png";
import TextIcon from "@/assets/icons/FileBrowser/textIcon.png";
import ArchiveIcon from "@/assets/icons/FileBrowser/archiveIcon.png";
import VideoIcon from "@/assets/icons/FileBrowser/videoIcon.png";
import ImageIcon from "@/assets/icons/FileBrowser/imageIcon.png";
import Other from "@/assets/icons/FileBrowser/other.png";
import FileAudioIcon from "@/assets/icons/FileBrowser/audioIcon.png";
import FileCodeIcon from "@/assets/icons/FileBrowser/codeIcon.png";
import FileSpreadsheetIcon from "@/assets/icons/FileBrowser/spreadsheetIcon.png";

/**
 * UI configuration for each file type.
 */
export interface FileTypeConfig {
  icon: React.ReactNode;
  hasPreview: boolean;
  viewerSupported: boolean;
  color?: string;
}

/**
 * Central mapping of logical file types to UI configuration.
 */
export const FILE_TYPE_CONFIG: Record<FileItemType, FileTypeConfig> = {
  folder: {
    icon: React.createElement("img", {
      src: FolderIcon,
      alt: "Folder",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: false,
    color: "text-blue-500",
  },

  image: {
        icon: React.createElement("img", {
      src: ImageIcon,
      alt: "Folder",
      className: "",
    }),
    hasPreview: true,
    viewerSupported: true,
    color: "text-amber-500",
  },

  pdf: {
    icon: React.createElement("img", {
      src: PDFIcon,
      alt: "PDF",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: true,
    color: "text-red-600",
  },

  video: {
      icon: React.createElement("img", {
      src: VideoIcon,
      alt: "Video",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: true,
    color: "text-purple-500",
  },

  audio: {
    icon: React.createElement("img", {
      src: FileAudioIcon,
      alt: "Text File",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: true,
    color: "text-emerald-500",
  },

  text: {
    icon: React.createElement("img", {
      src: TextIcon,
      alt: "Text File",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: true,
    color: "text-gray-500",
  },

  code: {
    icon: React.createElement("img", {
      src: FileCodeIcon,
      alt: "Code File",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: true,
    color: "text-sky-500",
  },

  document: {
    icon: React.createElement("img", {
      src: FileSpreadsheetIcon,
      alt: "Document File",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: true,
    color: "text-indigo-500",
  },

  archive: {
    icon: React.createElement("img", {
      src: ArchiveIcon,
      alt: "Archive File",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: false,
    color: "text-yellow-600",
  },

  other: {
    icon: React.createElement("img", {
      src: Other,
      alt: "Archive File",
      className: "",
    }),
    hasPreview: false,
    viewerSupported: false,
    color: "text-gray-400",
  },
};

/**
 * Detects the file type using extension or MIME type.
 * Used when FileItem.type is missing or "other".
 */
function detectType(
  extension?: string,
  mimeType?: string,
  fallback: FileItemType = "other"
): FileItemType {
  const ext = extension?.toLowerCase();

  // No useful info → fallback
  if (!ext && !mimeType) return fallback;

  // Images
  if (mimeType?.startsWith("image") || ["jpg", "jpeg", "png", "webp", "bmp"].includes(ext!))
    return "image";

  // PDF
  if (ext === "pdf" || mimeType === "application/pdf") return "pdf";

  // Video
  if (mimeType?.startsWith("video") || ["mp4", "mov", "avi", "webm"].includes(ext!))
    return "video";

  // Audio
  if (mimeType?.startsWith("audio") || ["mp3", "wav", "aac", "ogg"].includes(ext!))
    return "audio";

  // Plain text
  if (["txt", "md", "csv", "rtf"].includes(ext!)) return "text";

  // Code files
  if (["js", "ts", "tsx", "jsx", "html", "css", "json", "xml"].includes(ext!)) return "code";

  // Office docs
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext!)) return "document";

  // Archives
  if (["zip", "rar", "7z", "tar"].includes(ext!)) return "archive";

  return fallback;
}

/**
 * Resolve the final file type and UI configuration.
 * Used by the FileBrowserBlock.
 */
export function resolveFileType(item: FileItem) {
  const detected: FileItemType =
    item.type === "folder"
      ? "folder"
      : item.type
      ? item.type
      : detectType(item.extension, item.mimeType);

  const config = FILE_TYPE_CONFIG[detected];

  return {
    ...config,
    type: detected,
    item,
    icon: config.icon,
  };
}
