import React from "react"
import { cn } from "@/eano/lib/utils"

/**
 * Renders either error (in red) or description (in gray)
 * according to the field state.
 */
export function FieldMessage({
  error,
  description,
  describedById,
}: {
  error?: React.ReactNode
  description?: React.ReactNode
  describedById: string
}) {
  if (error) {
    return (
      <p id={describedById} className={cn("mt-1 text-sm text-destructive")}>
        {error}
      </p>
    )
  }

  if (description) {
    return (
      <p
        id={describedById}
        className={cn("mt-1 text-sm text-muted-foreground")}
      >
        {description}
      </p>
    )
  }

  return null
}
