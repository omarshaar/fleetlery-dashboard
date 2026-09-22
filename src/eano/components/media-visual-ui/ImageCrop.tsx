"use client"

import * as React from "react"
import {
  ImageCrop as ShadcnImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/eano/design-system/shadcn/image-crop"
import { Button } from "@/eano/design-system/shadcn/button"
import { Input } from "@/eano/design-system/shadcn/input"
import { XIcon } from "lucide-react"
import { FieldWrapper } from "@/eano/components/_shared/FieldWrapper"
import type { BaseFieldProps } from "@/eano/components/_shared/field-types"

/**
 * ImageCrop – unified component for uploading and cropping images.
 * ---------------------------------------------------------------
 * - Works in any React environment (no Next.js dependency)
 * - Accepts external `value` as File or string (URL / blob)
 * - Combines upload, crop, preview, and reset logic
 * - Uses FieldWrapper for label, description, error
 */

type ImageCropProps = BaseFieldProps & {
  /** Cropping aspect ratio (e.g. 1 = square) */
  aspect?: number | undefined
  /** Max file size in bytes (default 1MB) */
  maxImageSize?: number
  /** Callback fired when a cropped image is ready */
  onCrop?: (cropped: string | null) => void
  /** Controlled cropped image value (File or URL) */
  value?: string | File | null
  /** Show preview after crop */
  showPreview?: boolean
}

export function ImageCrop({
  label,
  description,
  error,
  required,
  disabled,
  className,
  id: providedId,
  aspect = undefined,
  maxImageSize = 1024 * 1024,
  onCrop,
  value,
  showPreview = true,
}: ImageCropProps) {
  const reactId = React.useId()
  const id = providedId ?? `imagecrop-${reactId}`

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [croppedImage, setCroppedImage] = React.useState<string | null>(null)

  // ---------------------------------------------------------
  // 🔹 Load external value (string URL or File)
  // ---------------------------------------------------------
  React.useEffect(() => {
    if (!value) return

    // If File object passed directly
    if (value instanceof File) {
      setSelectedFile(value)
      setCroppedImage(null)
      return
    }

    // If blob or normal URL string passed
    if (typeof value === "string") {
      fetch(value)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "external-image.jpg", { type: blob.type })
          setSelectedFile(file)
          setCroppedImage(null)
        })
        .catch((err) => console.error("Failed to load external image:", err))
    }
  }, [value])

  // ---------------------------------------------------------
  // 🔹 Handle file selection from input
  // ---------------------------------------------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCroppedImage(null)
    }
  }

  // ---------------------------------------------------------
  // 🔹 Reset
  // ---------------------------------------------------------
  const handleReset = () => {
    setSelectedFile(null)
    setCroppedImage(null)
    onCrop?.(null)
  }

  // ---------------------------------------------------------
  // 🔹 Handle Cropped
  // ---------------------------------------------------------
  const handleCropped = (img: string) => {
    setCroppedImage(img)
    onCrop?.(img)
  }

  // ---------------------------------------------------------
  // 🔹 Render
  // ---------------------------------------------------------
  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      {/* 🧭 Initial state: choose file */}
      {!selectedFile && !croppedImage && (
        <Input
          id={id}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleFileChange}
          className="w-fit"
        />
      )}

      {/* 🖼️ Cropping interface (either from upload or external) */}
      {selectedFile && (
        <div className="space-y-4">
          <ShadcnImageCrop
            aspect={aspect}
            file={selectedFile}
            maxImageSize={maxImageSize}
            onCrop={handleCropped}
          >
            {/* 🔹 Main Crop Area */}
            <div className="w-full flex justify-center items-center">
              <ImageCropContent
                className="
                  w-fit
                  max-w-full
                  max-h-[80vh]
                  rounded-lg 
                  overflow-hidden 
                  border 
                  bg-muted/30
                "
              />
            </div>

            {/* 🔹 Buttons Area */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <ImageCropApply className="flex-1 bg-green-700  hover:bg-green-800 dark:hover:bg-green-800 text-white" />
              <ImageCropReset className="bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-700 text-white" />
              <Button
                onClick={handleReset}
                size="icon"
                type="button"
                variant="ghost"
                aria-label="Cancel cropping"
                className="bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 text-white"
              >
                <XIcon className="size-5" />
              </Button>
            </div>
          </ShadcnImageCrop>

        </div>
      )}

      {/* 🪄 Show cropped preview after applying */}
      {croppedImage && (
        <div className="space-y-4">
          {showPreview && (
            <img
              src={croppedImage}
              alt="Cropped"
              width={120}
              height={120}
              className="rounded-md border object-cover"
            />
          )}
          <Button onClick={handleReset} size="icon" type="button" variant="ghost">
            {/* <XIcon className="size-4" /> */}
          </Button>
        </div>
      )}
    </FieldWrapper>
  )
}
