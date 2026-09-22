"use client"

/**
 * @file ProductImageGallery.tsx
 * @description A professional product images manager with sortable thumbnails,
 *              main preview, modal Dropzone to add images, and ImageCrop editing support.
 *              Fully controlled via `value` + `onChange`. Uses EANO unified components.
 */

import * as React from "react"
import { cn } from "@/eano/lib/utils"
import { Card, CardHeader, CardContent, ImageZoom, Dialog, ImageCrop, ConfirmDialog } from "@/components"
import { PlusIcon, X, Star, Scissors } from "lucide-react"
import type { ImageItem, ProductImageGalleryProps } from "./types"
import { GalleryDialog } from "./components/GalleryDialog"
import { GalleryThumbnail } from "./components/GalleryThumbnail"
import { revokeIfObjectURL } from "./utils"
import { useIsMobile } from "@/eano/hooks/use-mobile"

// DnD-kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable"

// Convert File → Base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export function ProductImageGallery({
  value,
  onChange,
  className,
  maxFiles = 10,
  accept = ["image/png", "image/jpeg", "image/webp"],
  allowRemove = true,
  allowSetMain = true,
  allowEdit = true,
  uploadMode = "client",
  title = "",
  uploadFn,
  aspect = 4 / 3,
  forceAutoCrop = false,
  viewDirection = "vertical",
  uploadMethods = ["file", "url"],
}: ProductImageGalleryProps & { aspect?: number | "free" }) {
  const isMobile = useIsMobile()

  const resolvedViewDirection = React.useMemo<"vertical" | "horizontal">(() => {
    if (typeof viewDirection === "string") return viewDirection
    const base = viewDirection.base ?? "vertical"
    const md = viewDirection.md ?? base
    return isMobile ? base : md
  }, [isMobile, viewDirection])

  const [selectedId, setSelectedId] = React.useState<string | null>(value[0]?.id ?? null)
  const [open, setOpen] = React.useState(false)
  const [isCropOpen, setIsCropOpen] = React.useState(false)
  const [editingImage, setEditingImage] = React.useState<ImageItem | null>(null)
  
  // Queue for auto-crop: holds images waiting to be cropped (NOT yet added to value)
  const [cropQueue, setCropQueue] = React.useState<ImageItem[]>([])
  const [isAutoCropping, setIsAutoCropping] = React.useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  React.useEffect(() => {
    if (!selectedId && value.length) {
      setSelectedId(value[0].id)
      return
    }
    if (selectedId && !value.find((i) => i.id === selectedId)) {
      setSelectedId(value[0]?.id ?? null)
    }
  }, [value, selectedId])

  const selectedImage = value.find((i) => i.id === selectedId) || null

  const update = (next: ImageItem[]) => onChange(next)

  /* --------------------------- ADD HANDLER --------------------------- */

  const handleAdd = async (newItems: ImageItem[]) => {
    const spaceLeft = Math.max(0, maxFiles - value.length)
    const toAdd = newItems.slice(0, spaceLeft)
    if (!toAdd.length) return

    // ============ AUTO-CROP MODE: MANDATORY CROP BEFORE ADDING ============
    if (forceAutoCrop) {
      // Convert files to base64 first
      for (const item of toAdd) {
        if (item.file) {
          try {
            item.src = await fileToBase64(item.file)
            delete item.file
          } catch (e) {
            console.error("Base64 conversion failed:", e)
          }
        }
      }

      // DO NOT add to value yet - only start crop queue
      setIsAutoCropping(true)
      setCropQueue(toAdd)
      processCropQueue(toAdd)
      return
    }

    // ============ NORMAL MODE (NO AUTO-CROP) ============

    const isFirstInsert = value.length === 0

    // 1) client mode (base64)
    if (uploadMode === "client") {
      for (const item of toAdd) {
        if (item.file) {
          try {
            item.src = await fileToBase64(item.file)
            delete item.file
          } catch (e) {
            console.error("Base64 conversion failed:", e)
          }
        }
      }

      if (isFirstInsert && toAdd.length > 0) {
        toAdd[0].isMain = true
      }

      update([...value, ...toAdd])
      setSelectedId(toAdd[0].id)
      return
    }

    // 2) managed upload mode
    if (uploadMode === "managed" && uploadFn) {
      const uploading: ImageItem[] = toAdd.map((i) => ({
        ...i,
        status: "uploading",
      }))

      if (isFirstInsert && uploading.length > 0) {
        uploading[0].isMain = true
      }

      update([...value, ...uploading])

      await Promise.all(
        uploading.map(async (item) => {
          if (!item.file) return
          try {
            const res = await uploadFn(item.file)
            revokeIfObjectURL(item.src)
            item.src = res.url
            item.status = "done"
            delete item.file
          } catch (e: any) {
            item.status = "error"
            item.error = e?.message ?? "Upload failed"
          }
        })
      )

      update([...value, ...uploading])
      setSelectedId(uploading[0].id)
    }
  }


  /* --------------------------- REMOVE HANDLER --------------------------- */

  const handleRemove = (id: string) => {
    const target = value.find((i) => i.id === id)
    revokeIfObjectURL(target?.src)

    let next = value.filter((i) => i.id !== id)

    if (target?.isMain && next.length > 0) {
      next = next.map((img, index) => ({
        ...img,
        isMain: index === 0,
      }))
    }

    update(next)

    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null)
    }
  }

  /* --------------------------- SET MAIN --------------------------- */

  const handleSetMain = (id: string) => {
    const next = value.map((i) => ({ ...i, isMain: i.id === id }))
    update(next)
  }

  /* --------------------------- EDIT / CROP --------------------------- */

  const handleEdit = (item: ImageItem) => {
    setEditingImage(item)
    setIsCropOpen(true)
  }

  const handleCropped = (croppedBase64: string | null) => {
    if (!editingImage) {
      setIsCropOpen(false)
      setEditingImage(null)
      return
    }

    // If cancelled (no cropped result) and in auto-crop mode
    if (!croppedBase64) {
      if (isAutoCropping) {
        // Remove this image from queue and move to next (image is discarded, NOT added to gallery)
        const remaining = cropQueue.filter((i) => i.id !== editingImage.id)
        if (remaining.length > 0) {
          processCropQueue(remaining)
        } else {
          // Queue finished - finalize
          setIsAutoCropping(false)
          setCropQueue([])
          setIsCropOpen(false)
          setEditingImage(null)
        }
      } else {
        // Regular edit mode - just close
        setIsCropOpen(false)
        setEditingImage(null)
      }
      return
    }

    // Crop successful
    if (isAutoCropping) {
      // Add THIS cropped image to gallery
      const croppedImage = { ...editingImage, src: croppedBase64 }
      
      // Mark as main only if it's the first image being added
      if (value.length === 0) {
        croppedImage.isMain = true
      }
      
      const updatedValue = [...value, croppedImage]
      update(updatedValue)
      
      // If this was the first image, select it
      if (value.length === 0) {
        setSelectedId(croppedImage.id)
      }

      // Move to next image in queue
      const remaining = cropQueue.filter((i) => i.id !== editingImage.id)
      if (remaining.length > 0) {
        processCropQueue(remaining)
      } else {
        // Queue finished
        setIsAutoCropping(false)
        setCropQueue([])
        setIsCropOpen(false)
        setEditingImage(null)
      }
    } else {
      // Regular edit mode - update existing image
      const next = value.map((img) =>
        img.id === editingImage.id ? { ...img, src: croppedBase64 } : img
      )
      update(next)
      setIsCropOpen(false)
      setEditingImage(null)
    }
  }

  /**
   * Process crop queue: opens crop dialog for next image in queue
   * Only images that successfully pass cropping are added to the gallery
   */
  const processCropQueue = (queue: ImageItem[]) => {
    if (!queue.length) {
      // Queue finished - all images cropped and added
      return
    }

    // Start cropping next image
    const nextImage = queue[0]
    setEditingImage(nextImage)
    setCropQueue(queue)
    setIsCropOpen(true)
  }

  /* --------------------------- DRAG END --------------------------- */

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = value.findIndex((i) => i.id === active.id)
    const newIndex = value.findIndex((i) => i.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(value, oldIndex, newIndex)
    update(reordered)
  }

  React.useEffect(() => {
    return () => {
      value.forEach((i) => revokeIfObjectURL(i.src))
    }
  }, [])

  /* --------------------------- RENDER --------------------------- */

  return (
    <Card className={cn("w-full rounded-md py-4.5! pt-0! overflow-hidden border-0 gap-1!", resolvedViewDirection == "horizontal" ? "p-0!" : "" , className)}>
      {title && <CardHeader className="font-medium p-0!">{title}</CardHeader>}

      <CardContent className={cn(
        "w-full h-max p-0",
        resolvedViewDirection === "horizontal" && "flex gap-1 items-start"
      )}>

        {/* Main preview area */}
        <div
          className={cn(
            "relative flex items-center justify-center bg-muted mx-auto overflow-hidden border rounded-md",
            resolvedViewDirection === "horizontal" && "flex-1 min-w-0"
          )}
          style={{ aspectRatio: aspect === "free" ? undefined : String(aspect) }}
        >
          {selectedImage ? (
            <ImageZoom className="flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt ?? ""}
                className="max-h-[520px] w-auto object-contain mx-auto select-none"
                draggable={false}
              />
            </ImageZoom>
          ) : (
            <p className="text-sm text-muted-foreground">No image selected</p>
          )}

          {/* Fixed Control Buttons (top-right) */}
          {selectedImage && (
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1 pointer-events-auto">
              {/* ✂️ Edit / Crop */}
              {allowEdit && (
                <button
                  type="button"
                  className="bg-background/90 hover:bg-background rounded-full p-2! shadow-md transition-colors"
                  onClick={() => handleEdit(selectedImage)}
                  aria-label="Crop image"
                  title="Crop image"
                >
                  <Scissors className="size-4" strokeWidth={2} />
                </button>
              )}

              {/* ⭐ Set main */}
              {allowSetMain && !selectedImage.isMain && (
                <button
                  type="button"
                  className="bg-background/90 hover:bg-background rounded-full p-2! shadow-md transition-colors"
                  onClick={() => handleSetMain(selectedImage.id)}
                  aria-label="Set as main image"
                  title="Set as main image"
                >
                  <Star className="size-4" strokeWidth={2} />
                </button>
              )}

              {/* ❌ Remove */}
              {allowRemove && (
                <ConfirmDialog
                  trigger={
                    <button
                      type="button"
                      className="bg-background/90 hover:bg-red-500/20 hover:text-red-500 rounded-full p-2! shadow-md transition-colors"
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      <X className="size-4" strokeWidth={2} />
                    </button>
                  }
                  title="Remove image?"
                  description="This action cannot be undone."
                  actionLabel="Remove"
                  destructive
                  onConfirm={() => handleRemove(selectedImage.id)}
                />
              )}
            </div>
          )}
        </div>

        {/* Thumbnails area */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className={cn(
              "flex flex-wrap gap-2 mt-4 p-1 overflow-hidden px-3",
              resolvedViewDirection === "horizontal" && "flex mt-0 flex-[0.6] py-4"
            )}>
              {value.map((item) => (
                <GalleryThumbnail
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => setSelectedId(item.id)}
                />
              ))}

              {value.length < maxFiles && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex items-center justify-center aspect-square  border border-dashed hover:border-primary transition-colors bg-muted/30 min-w-[65px] sm:min-w-[75px] md:min-w-[90px] "
                  aria-label="Add images"
                >
                  <PlusIcon className="size-5 text-muted-foreground " />
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>

      <GalleryDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={handleAdd}
        accept={accept}
        maxFiles={maxFiles}
        uploadMethods={uploadMethods}
      />

      <Dialog
        open={isCropOpen}
        onOpenChange={setIsCropOpen}
        title="Crop Image"
        size="lg"
        trigger={undefined}
        innerClassName="space-y-4"
      >
        {editingImage && (
          <ImageCrop
            aspect={aspect === "free" ? undefined : aspect}
            value={editingImage.src}
            showPreview={false}
            onCrop={handleCropped}
          />
        )}
      </Dialog>
    </Card>
  )
}
