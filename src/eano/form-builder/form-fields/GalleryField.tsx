"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { ProductImageGallery } from "@/components"

/**
 * Field wrapper for ProductImageGallery to integrate with Form Builder.
 * Ensures value is always an array and correctly forwards standard props.
 */
const GalleryField: React.FC<FieldComponentProps> = ({
  value,
  onChange,
  label,
  className,
  style,
  field,
  required,
}) => {
  // 🔥 IMPORTANT: Always ensure array
  const safeValue = Array.isArray(value) ? value : []

  const extraProps: Record<string, any> =
    'props' in field && (field as any).props ? (field as any).props : {}

  const { description, error } = extraProps

  return (
    <div className={className} style={style}>
      {/* 🔹 Label */}
      {label && (
        <p className="text-sm font-medium text-foreground mb-1">
          {label} {required && <span className="text-destructive">*</span>}
        </p>
      )}

      {/* 🔹 Image Gallery */}
      <ProductImageGallery
        value={safeValue}
        onChange={(next) => onChange(next)}
        {...extraProps}
      />

      {/* 🔹 Error / Description */}
      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}

export default GalleryField
