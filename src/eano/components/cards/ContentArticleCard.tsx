"use client"

/**
 * ContentArticleCard
 *
 * A clean, modern article/blog card component.
 * - Fully data-driven (no children)
 * - Works with or without an image
 * - Ideal for articles, blog posts, or news items
 * - Smooth hover effect and elegant layout
 *
 * Simple, reusable, and consistent with the EANO design system.
 */

import React from "react"
import { Card } from "@/components"
import { cn } from "@/eano/lib/utils"
import { ImageIcon, ArrowUpRight } from "lucide-react"

export interface ContentArticleCardData {
    imageUrl?: string
    author?: string
    readingTime?: string
    title: string
    description?: string
    category?: string
    date?: string
}

export interface ContentArticleCardProps
    extends React.HTMLAttributes<HTMLDivElement> {
    data: ContentArticleCardData
    showImagePlaceholder?: boolean
    onClick?: () => void
}

export function ContentArticleCard({
    data,
    showImagePlaceholder,
    onClick,
    className,
    ...rest
}: ContentArticleCardProps) {
    const {
        imageUrl,
        author,
        readingTime,
        title,
        description,
        category,
        date,
    } = data

    return (
        <Card
            className={cn(
                "cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden p-0! gap-0!",
                className
            )}
            onClick={onClick}
            {...rest}
        >
            {/* Image section (with fallback placeholder) */}

            {imageUrl ? (
                <div className="h-44 w-full bg-muted flex items-center justify-center overflow-hidden select-none">
                    <img
                        loading="lazy"
                        src={imageUrl}
                        alt={title}
                        className="object-cover h-full w-full"
                    />
                </div>
            ) : (
                null
            )}

            {
                !imageUrl && showImagePlaceholder &&  (
                    <div className="h-44 w-full bg-muted flex items-center justify-center select-none">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                )
            }


            {/* Content */}
            <div className="p-4 flex flex-col gap-3">

                {/* Author + Reading Time */}
                {(author || readingTime) && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {author && <span>{author}</span>}
                        {author && readingTime && <span className="mx-1">•</span>}
                        {readingTime && <span>{readingTime}</span>}
                    </div>
                )}

                {/* Title */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base leading-tight flex-1 line-clamp-2">
                        {title}
                    </h3>

                    <ArrowUpRight className="h-4 w-4 opacity-70 shrink-0" />
                </div>

                {/* Description */}
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Category + Date */}
                {(category || date) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {category && (
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {category}
                            </span>
                        )}

                        {date && <span>{date}</span>}
                    </div>
                )}
            </div>
        </Card>
    )
}
