"use client"

import React, { useState } from "react"
import type { FieldComponentProps } from "../types/form.types"
import { ImageZoom } from "@/components"
import { X, User } from "lucide-react"
import { GalleryDialog } from "@/eano/components/media-visual-ui/ProductImageGallery/components/GalleryDialog"
import type { ImageItem } from "@/eano/components/media-visual-ui/ProductImageGallery/types"
import { useLanguage } from "@/i18n/hooks"

/**
 * AvatarField - Single image upload field for profile pictures/avatars
 * Uses the same upload mechanism as ProductImageGallery
 */
const AvatarField: React.FC<FieldComponentProps> = ({
  value,
  onChange,
  label,
  className,
  style,
  field,
  required,
}) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { t } = useLanguage()

  const extraProps: Record<string, any> =
    'props' in field && (field as any).props ? (field as any).props : {}

  const { 
    description, 
    error, 
    size: rawSize = 120,      // Avatar size in pixels
    shape = "circle",         // "circle" or "square"
    accept = ["image/png", "image/jpeg", "image/webp"],
    uploadMethods = ["file", "url"],
  } = extraProps

  // Convert to numbers
  const size = typeof rawSize === "string" ? parseInt(rawSize, 10) : rawSize

  // Convert value to string URL
  const imageUrl = typeof value === "string" ? value : ""

  /**
   * Handle adding new image from GalleryDialog
   */
  const handleAdd = (items: ImageItem[]) => {
    if (!items.length) return
    const firstItem = items[0]
    
    // If it has a file, convert to base64
    if (firstItem.file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange(reader.result as string)
      }
      reader.readAsDataURL(firstItem.file)
    } else {
      // It's a URL
      onChange(firstItem.src)
    }
  }

  /**
   * Remove current image
   */
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  /**
   * Handle avatar click
   */
  const handleAvatarClick = () => {
    if (!imageUrl) {
      // If no image, open upload dialog
      setUploadDialogOpen(true)
    }
    // If image exists, ImageZoom handles the click automatically
  }

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg"

  // Normalize accept for GalleryDialog
  const normalizedAccept = Array.isArray(accept) 
    ? accept 
    : ["image/png", "image/jpeg", "image/webp"]

  return (
    <div className={className} style={style}>
      {/* Label */}
      {label && (
        <p className="text-sm font-medium text-foreground mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </p>
      )}

      {/* Avatar Container */}
      <div className="inline-block relative">
        <div
          className={`relative ${shapeClass} overflow-hidden border-2 border-border bg-muted transition-all ${
            !imageUrl ? "cursor-pointer hover:border-primary hover:bg-muted/80" : ""
          }`}
          style={{ width: size, height: size }}
          onClick={!imageUrl ? handleAvatarClick : undefined}
        >
          {imageUrl ? (
            <>
              <ImageZoom className={`block overflow-hidden ${shapeClass}`}>
                <img
                  src={imageUrl}
                  alt={t("formBuilder.avatar.preview")}
                  className={`object-cover ${shapeClass}`}
                  style={{ width: size, height: size }}
                  draggable={false}
                />
              </ImageZoom>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5! bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full transition-colors shadow-lg z-10"
                aria-label={t("formBuilder.avatar.removeImage")}
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-1/2 h-1/2 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Helper Text */}
        {!imageUrl && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t("formBuilder.avatar.clickToUpload")}
          </p>
        )}
      </div>

      {/* Error / Description */}
      {error ? (
        <p className="text-sm text-destructive mt-2">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      ) : null}

      {/* Upload Dialog (same as ProductImageGallery) */}
      <GalleryDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onAdd={handleAdd}
        accept={normalizedAccept}
        maxFiles={1}
        uploadMethods={uploadMethods}
      />
    </div>
  )
}

export default AvatarField
