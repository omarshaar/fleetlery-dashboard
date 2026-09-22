import React from "react"
import { Label as SLabel } from "@/eano/design-system/shadcn/label"
import { cn } from "@/eano/lib/utils"
import { FieldMessage } from "./FieldMessage"

/**
 * Shared wrapper that renders:
 * Label → Field → Error/Description
 */
export function FieldWrapper({
  id,
  label,
  required,
  error,
  description,
  className,
  children,
}: {
  id: string
  label?: React.ReactNode
  required?: boolean
  error?: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  const describedById = `${id}-desc`

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {label && (
        <div className="mb-1 flex items-center gap-1">
          <SLabel htmlFor={id} className="text-sm font-medium">
            {label}
          </SLabel>
          {required && <span className="text-destructive">*</span>}
        </div>
      )}

      {children}

      <FieldMessage
        error={error}
        description={description}
        describedById={describedById}
      />
    </div>
  )
}
