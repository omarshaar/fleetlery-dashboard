"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Separator } from "@/components"
import { cn } from "@/eano/lib/utils"

const DividerField: React.FC<FieldComponentProps> = ({ className, style, field }) => {
  const fieldProps: any =
    field && "props" in field && (field as any).props
      ? { ...((field as any).props as Record<string, any>) }
      : {}

  return (
    <Separator
      className={cn(className, fieldProps.className)}
      style={{ ...style, ...(fieldProps.style ?? {}) }}
    />
  )
}

export default DividerField
