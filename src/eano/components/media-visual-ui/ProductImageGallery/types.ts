// Simple, explicit types for gallery items and component props.

import type React from "react"

export type UploadStatus = "idle" | "uploading" | "done" | "error"

export type UploadMethod = "file" | "url"

export type GalleryViewDirection = "vertical" | "horizontal"

export type ResponsiveGalleryViewDirection = {
  /** Applied below md (Tailwind md = 768px) */
  base?: GalleryViewDirection
  /** Applied at md and above */
  md?: GalleryViewDirection
}

export type TabItem = {
  value: string
  label: string
  content: React.ReactNode
}

export type ImageItem = {
  id: string
  src: string           // objectURL or server URL
  file?: File           // present if newly added and not persisted yet
  alt?: string
  isMain?: boolean
  status?: UploadStatus
  error?: string
}

export type ProductImageGalleryProps = {
  /** Controlled value (images array) */
  value: ImageItem[]
  /** Called on every change (add/remove/selectMain/reorder) */
  onChange: (next: ImageItem[]) => void

  /** Optional behavior */
  maxFiles?: number
  accept?: string[]
  allowRemove?: boolean
  allowSetMain?: boolean
  allowEdit?: boolean
  className?: string
  title?: string

  /** Optional managed upload mode (later step) */
  uploadMode?: "client" | "managed"
  uploadFn?: (file: File) => Promise<{ url: string; meta?: any }>

  /** If true, forces crop on every uploaded image before adding to gallery */
  forceAutoCrop?: boolean

  /** Gallery layout direction: vertical (default) or horizontal */
  viewDirection?: GalleryViewDirection | ResponsiveGalleryViewDirection

  /** Upload methods available: "file" (select from device), "url" (paste URL) */
  /** Default: ["file", "url"] (all available) */
  uploadMethods?: UploadMethod[]
}
