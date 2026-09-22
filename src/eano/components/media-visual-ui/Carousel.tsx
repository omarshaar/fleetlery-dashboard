"use client"

import * as React from "react"
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/eano/design-system/shadcn/carousel"
import { FieldWrapper } from "@/eano/components/_shared/FieldWrapper"
import type { BaseFieldProps } from "@/eano/components/_shared/field-types"
import { cn } from "@/eano/lib/utils"

/**
 * Carousel – unified wrapper for Shadcn Carousel
 * ---------------------------------------------------------------
 * - Keeps same design and layout as original
 * - Accepts an array of items and a render function
 * - Supports label, description, error, required, disabled
 */

type CarouselProps<T> = BaseFieldProps & {
  /** List of items to render in carousel */
  items: T[]
  /** Function that renders each item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Optional carousel width class (default: max-w-xs) */
  widthClass?: string
}

export function Carousel<T>({
  label,
  description,
  error,
  required,
  disabled,
  className,
  id: providedId,
  items,
  renderItem,
  widthClass = "max-w-xs",
}: CarouselProps<T>) {
  const reactId = React.useId()
  const id = providedId ?? `carousel-${reactId}`

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <div
        className={cn(
          "w-full p-6 flex justify-center",
          disabled && "opacity-60 pointer-events-none"
        )}
      >
        <ShadcnCarousel className={cn("w-full", widthClass)}>
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-1">{renderItem(item, index)}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </ShadcnCarousel>
      </div>
    </FieldWrapper>
  )
}
