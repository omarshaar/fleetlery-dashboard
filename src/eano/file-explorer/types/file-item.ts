/**
 * File item types for the EANO File Explorer.
 *
 * This file defines the core TypeScript types that describe
 * files and folders inside the file manager.
 *
 * The goal is to keep this interface stable and reusable
 * across all file related components (browser, viewers, uploads).
 */

export type FileItemType =
  | "folder"
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "text"
  | "code"
  | "document"
  | "archive"
  | "other";

/**
 * FileItem
 *
 * Represents a single file or folder inside the file system.
 * This is the main data shape that the File Explorer works with.
 */
export interface FileItem {
  /** Unique identifier for the item (internal ID or external UUID). */
  id: string;

  /** Display name shown to the user (file or folder name). */
  name: string;

  /**
   * Logical type of the item.
   * Used to decide which icon, preview or viewer should be used.
   */
  type: FileItemType;

  /**
   * Full path inside the logical file system.
   * Example: "/assets/images/2024" or "/".
   * This is optional because some backends only work with IDs.
   */
  path?: string;

  /**
   * Public or internal URL to access the file content.
   * For folders this is usually undefined.
   */
  url?: string;

  /**
   * File extension without the dot.
   * Example: "jpg", "png", "pdf", "mp4".
   */
  extension?: string;

  /**
   * MIME type of the file.
   * Example: "image/jpeg", "application/pdf".
   */
  mimeType?: string;

  /**
   * File size in bytes.
   * For folders this is normally undefined.
   */
  sizeBytes?: number;

  /**
   * Optional dimensions for images or videos.
   * Only set when known.
   */
  width?: number;
  height?: number;

  /**
   * Optional duration in seconds for audio or video files.
   */
  durationSeconds?: number;

  /**
   * Creation and update timestamps as ISO strings.
   * Example: "2025-12-05T10:15:00Z".
   */
  createdAt?: string;
  updatedAt?: string;

  /**
   * Optional flags for UI behavior.
   * These are hints and can be ignored by the UI.
   */
  isHidden?: boolean;
  isFavorite?: boolean;

   /**
   * Optional Thumbnail
   * Used mainly for:
   * - video preview image
   * - custom preview for pdf, audio, or image
   */
  thumbnailUrl?: string;
}
