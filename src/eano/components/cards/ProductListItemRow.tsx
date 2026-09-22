"use client";

/**
 * ProductListItemRow
 *
 * A single product row for list view layout.
 * Pure item component – receives only item data + callbacks.
 */

import { Card, Button } from "@/components";
import { Star } from "lucide-react";
import type { ProductListItem } from "../lists/ProductListBlock/types";

export interface ProductListItemRowProps {
  item: ProductListItem;
  onClick?: (item: ProductListItem) => void;
  onAction?: (item: ProductListItem) => void;
  actionLabel?: string;
}

export function ProductListItemRow({
  item,
  onClick,
  onAction,
  actionLabel = "Details",
}: ProductListItemRowProps) {
  return (
    <Card
      className="cursor-pointer flex flex-row rounded-md shadow-sm hover:shadow-md p-0 h-20 pe-6"
      onClick={() => onClick?.(item)}
    >
      {/* Image */}
      <div className="h-full w-28 bg-muted/40 rounded-md flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={item.imageUrl}
          className="object-cover max-w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex justify-between items-center flex-1">
        <div className="flex flex-col justify-center flex-1 min-w-0 py-1 gap-2">
          <div>
            <p className="font-semibold text-sm line-clamp-1 mb-1">
              {item.name}
            </p>

            {item.subtitle && (
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Rating + Sold */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-current" />
              {item.rating?.toFixed(1) ?? "5.0"}

              {item.soldCount !== undefined && (
                <span className="ms-3">
                  {item.soldCount.toLocaleString()} Sold
                </span>
              )}
            </div>

            {/* Action Button */}
          </div>
        </div>

        {/* Price + Colors */}
        <div className="flex items-center jsu">
          <div className="flex flex-col items-end">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              {item.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${item.oldPrice.toLocaleString()}
                </span>
              )}

              <span className="text-sm font-semibold">
                ${item.price.toLocaleString()}
              </span>
            </div>

            {/* Colors */}
            {item.colors && item.colors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                {item.colors.map((col) => (
                  <span
                    key={col.id}
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {onAction && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAction(item);
              }}
              className="ms-3 rounded-sm!"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
