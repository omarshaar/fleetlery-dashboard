"use client"

/**
 * ContentCard
 *
 * A universal card for displaying summarized content groups.
 * - Works for courses, collections, documents, datasets, etc.
 * - Data-driven only (no children)
 * - Supports optional top image
 * - If no image is provided, a geometric color header is rendered
 *
 * Simple, clean, and aligned with the EANO card architecture.
 */

import React from "react"
import { Card } from "@/components"
import { cn } from "@/eano/lib/utils"
import { FileText, Layers } from "lucide-react"

export interface ContentCardData {
  title: string
  subtitle?: string
  tag?: string
  primaryValue?: number
  secondaryValue?: number
  primaryLabel?: string
  secondaryLabel?: string
  editedAt?: string
  createdAt?: string
  imageUrl?: string
}

export interface ContentCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ContentCardData
  onClick?: () => void
}

export function ContentCard({
  data,
  onClick,
  className,
  ...rest
}: ContentCardProps) {
  const {
    title,
    subtitle,
    tag,
    primaryValue = 0,
    secondaryValue = 0,
    primaryLabel = "Docs",
    secondaryLabel = "Annotations",
    editedAt,
    createdAt,
    imageUrl,
  } = data

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow p-0! gap-0!",
        className
      )}
      {...rest}
    >
      {/* Top Section */}
      {imageUrl ? (
        <div className="h-32 w-full overflow-hidden">
          <img
            loading="lazy"
            src={imageUrl}
            alt={title}
            className="object-cover h-full w-full"
          />
        </div>
      ) : (
        <div className="h-32 w-full relative bg-[#1a1c49]">
          {/* geometric shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-[#f5c15c]" />
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full bg-[#4cc0e9]" />
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex flex-col gap-0">

        {/* Title */}
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Tag */}
        {tag && (
          <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {tag}
          </span>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {primaryValue} {primaryLabel.toLowerCase()}
          </span>

          <span className="inline-flex items-center gap-1">
            <Layers className="h-4 w-4" />
            {secondaryValue} {secondaryLabel.toLowerCase()}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground flex flex-col gap-1">
          {editedAt && <span>Edited: {editedAt}</span>}
          {createdAt && <span>Created: {createdAt}</span>}
        </div>
      </div>
    </Card>
  )
}
