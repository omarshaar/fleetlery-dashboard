"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { cn } from "@/eano/lib/utils"

const HeadingField: React.FC<FieldComponentProps> = ({ className, style, field }) => {
  const fieldProps: any =
    field && "props" in field && (field as any).props
      ? { ...((field as any).props as Record<string, any>) }
      : {}

  const text = (fieldProps.text ?? fieldProps.title ?? fieldProps.label ?? "") as string

  if (!text) return null

  return (
    <div
      className={cn("text-xs font-semibold text-muted-foreground", className, fieldProps.className)}
      style={{ ...style, ...(fieldProps.style ?? {}) }}
    >
      {text}
    </div>
  )
}

export default HeadingField
