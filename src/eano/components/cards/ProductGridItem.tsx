"use client"

/**
 * ProductGridItem
 *
 * A single product card for grid view layout.
 * Pure item component – receives only item data + callbacks.
 */

import { Card, CardHeader, CardContent, Button } from "@/components"
import { Star } from "lucide-react"
import type { ProductListItem } from "../lists/ProductListBlock/types"

export interface ProductGridItemProps {
  item: ProductListItem
  onClick?: (item: ProductListItem) => void
  onAction?: (item: ProductListItem) => void
  actionLabel?: string
}

export function ProductGridItem({
  item,
  onClick,
  onAction,
  actionLabel = "Details",
}: ProductGridItemProps) {
  return (
    <Card
      className="cursor-pointer rounded-md shadow-sm hover:shadow-md gap-0! p-0!"
      onClick={() => onClick?.(item)}
    >
      <CardHeader className="bg-muted/40 flex items-center justify-center p-0!">
        <div className="h-30 sm:h-32 w-full overflow-hidden rounded-md flex items-center justify-center">
          <img
            loading="lazy"
            src={item.imageUrl}
            alt={item.name}
            className="object-cover object-center! h-full w-full"
          />
        </div>
      </CardHeader>

      <CardContent className="p-3 py-2 pt-1 flex! flex-col! gap-1">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">${item.price.toLocaleString()}</span>

          {item.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${item.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex-1">
          <p className="text-xs line-clamp-2">{item.name}</p>
          {item.subtitle && (
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          )}
        </div>

        {/* Colors */}
        {item.colors && item.colors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {item.colors.map((col) => (
              <span
                key={col.id}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        )}

        {/* Rating + Sold */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {item.rating?.toFixed(1) ?? "5.0"}
          </span>

          {item.soldCount !== undefined && (
            <span>{item.soldCount.toLocaleString()} Sold</span>
          )}
        </div>

        {/* Action Button */}
        {onAction && (
          <Button
            size="sm"
            className="mt-3 dark:bg-white rounded-sm!"
            onClick={(e) => {
              e.stopPropagation()
              onAction(item)
            }}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
