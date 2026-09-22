"use client"

/**
 * @file GalleryThumbnail.tsx
 * @description Sortable thumbnail component for ProductImageGallery.
 * Supports drag & drop reordering, image preview, upload state, and small control actions.
 */

import { cn } from "@/eano/lib/utils"
import { Spinner, Badge } from "@/components"
import type { ImageItem } from "../types"

// DnD-kit imports
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type GalleryThumbnailProps = {
  item: ImageItem
  selected?: boolean
  onSelect?: () => void
}

export function GalleryThumbnail({
  item,
  selected,
  onSelect,
}: GalleryThumbnailProps) {
  // Enable sortable behavior
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    willChange: "transform",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative aspect-square max-w-[65px] sm:max-w-[75px] md:max-w-[90px] rounded-md border overflow-hidden group transition-all bg-muted/40",
        selected && "ring-2 ring-primary ring-offset-1"
      )}
      onClick={onSelect}
      role="button"
      aria-label="Select image"
    >
      {/* Uploading overlay */}
      {item.status === "uploading" && (
        <div className="absolute inset-0 grid place-items-center bg-background/60">
          <Spinner className="size-4" />
        </div>
      )}

      {/* Image */}
      {item.src ? (
        <img
          src={item.src}
          alt={item.alt ?? ""}
          className="size-full object-cover transition-transform group-hover:scale-110 select-none"
          draggable={false}
        />
      ) : (
        <div className="flex items-center justify-center size-full text-xs text-muted-foreground">
          No Image
        </div>
      )}

      {/* Main badge */}
      {item.isMain && (
        <Badge className="absolute top-1 left-1 text-[10px]" variant="secondary">
          Main
        </Badge>
      )}
    </div>
  )
}
