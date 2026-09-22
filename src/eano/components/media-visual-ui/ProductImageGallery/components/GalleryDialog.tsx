"use client"

/**
 * @file GalleryDialog.tsx
 * @description Modal for uploading product images with two methods:
 * 1. File upload (Dropzone)
 * 2. URL input (paste image URL)
 * Uses the same design tokens and UX standards as all EANO modal components.
 */

import * as React from "react"
import { Dialog, Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components"
import { Custemtabs } from "@/eano/design-system/custem/tabs/CustemTabs"
import { AlertCircle } from "lucide-react"
import type { ImageItem, UploadMethod } from "../types"
import { uid } from "../utils"

type GalleryDialogProps = {
  /** Controls whether the dialog is visible */
  open: boolean
  /** Called when dialog opens or closes */
  onOpenChange: (open: boolean) => void
  /** Called when new images are selected or added */
  onAdd: (files: ImageItem[]) => void
  /** File types allowed for upload */
  accept?: string[] | Record<string, string[]>
  /** Maximum number of files allowed */
  maxFiles?: number
  /** Available upload methods: "file" and/or "url" */
  uploadMethods?: UploadMethod[]
}

/**
 * GalleryDialog — handles uploading images through multiple methods
 */
export function GalleryDialog({
  open,
  onOpenChange,
  onAdd,
  accept = ["image/png", "image/jpeg", "image/webp"],
  maxFiles = 10,
  uploadMethods = ["file", "url"],
}: GalleryDialogProps) {
  const [urlInput, setUrlInput] = React.useState("")
  const [urlError, setUrlError] = React.useState("")
  const [isLoadingUrl, setIsLoadingUrl] = React.useState(false)

  // Available methods to display
  const availableMethods = uploadMethods.filter((m) => ["file", "url"].includes(m))
  const hasFile = availableMethods.includes("file")
  const hasUrl = availableMethods.includes("url")
  const showTabs = hasFile && hasUrl

  /** Handle file drop from Dropzone */
  const handleDrop = React.useCallback(
    (files: File[]) => {
      if (!files?.length) return
      const safe = files.slice(0, maxFiles)
      const items: ImageItem[] = safe.map((file) => ({
        id: uid(),
        src: URL.createObjectURL(file),
        file,
        status: "idle",
      }))

      onAdd(items)
      onOpenChange(false)
    },
    [onAdd, onOpenChange, maxFiles]
  )

  /** Handle URL input validation and loading */
  const handleUrlAdd = React.useCallback(async () => {
    setUrlError("")
    const trimmedUrl = urlInput.trim()

    if (!trimmedUrl) {
      setUrlError("Please enter a valid URL")
      return
    }

    // Basic URL validation
    try {
      new URL(trimmedUrl)
    } catch {
      setUrlError("Please enter a valid URL (e.g., https://example.com/image.jpg)")
      return
    }

    setIsLoadingUrl(true)

    // Test if image is accessible by loading it
    const img = new Image()
    img.onload = () => {
      const item: ImageItem = {
        id: uid(),
        src: trimmedUrl,
        status: "idle",
      }
      onAdd([item])
      setUrlInput("")
      onOpenChange(false)
      setIsLoadingUrl(false)
    }
    img.onerror = () => {
      setUrlError("Could not load image from this URL. Please check the URL and try again.")
      setIsLoadingUrl(false)
    }
    img.src = trimmedUrl
  }, [urlInput, onAdd, onOpenChange])

  /** Convert string[] accept → { "image/png": [] } shape expected by react-dropzone */
  const normalizedAccept = React.useMemo(() => {
    if (Array.isArray(accept)) {
      return Object.fromEntries(accept.map((t) => [t, []]))
    }
    return accept
  }, [accept])

  // File upload content
  const fileUploadContent = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Drag & drop or select one or more images to add them to your product gallery.
      </p>
      <Dropzone
        accept={normalizedAccept}
        multiple
        onDrop={handleDrop}
        maxFiles={maxFiles}
      >
        <DropzoneEmptyState className="py-9" />
        <DropzoneContent />
      </Dropzone>
    </div>
  )

  // URL input content
  const urlInputContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="imageUrl"
          type="text"
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value)
            setUrlError("")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoadingUrl) {
              handleUrlAdd()
            }
          }}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoadingUrl}
        />
      </div>

      {urlError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="size-4 shrink-0" />
          <p className="text-sm">{urlError}</p>
        </div>
      )}

      <button
        onClick={handleUrlAdd}
        disabled={isLoadingUrl || !urlInput.trim()}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
      >
        {isLoadingUrl ? "Loading..." : "Add Image"}
      </button>
    </div>
  )

  // Prepare tabs for the CustomTabs component
  const tabsData = []
  if (hasFile) {
    tabsData.push({
      id: "file",
      label: "Upload File",
      content: fileUploadContent,
    })
  }
  if (hasUrl) {
    tabsData.push({
      id: "url",
      label: "Add URL",
      content: urlInputContent,
    })
  }

  const defaultTab = hasFile ? "file" : "url"

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Upload product images"
      description={showTabs ? "Choose how to add images to your gallery" : undefined}
      size="lg"
      trigger={null}
      innerClassName="space-y-4"
    >
      {showTabs ? (
        <Custemtabs 
          items={tabsData} 
          defaultValue={defaultTab}
          variant="underline"
          size="md"
        />
      ) : hasFile ? (
        fileUploadContent
      ) : (
        urlInputContent
      )}
    </Dialog>
  )
}
