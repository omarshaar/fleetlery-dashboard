"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Textarea } from "@/components"
import { cn } from "@/eano/lib/utils"

/**
 * Adapter layer to connect the Shadcn Textarea component 
 * with the Dynamic Form Builder engine.
 *
 * This component receives FieldComponentProps from the Form Builder,
 * and maps them to the Textarea props.
 */
const TextareaField: React.FC<FieldComponentProps> = ({
  name,
  value,
  label,
  placeholder,
  disabled,
  className,
  style,
  field,
  onChange,
  onBlur,
  onFocus,
  error,
}) => {
  // Safely extract props from field only when the union member actually has a `props` property.
  const fieldProps: any = field && "props" in field ? (field as any).props : {};

  return (
      <Textarea
        id={name}
        value={value ?? ""}
        style={style}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("flex flex-col gap-1 w-full h-full", className)}
        label={label}
        onChange={(e: any) => {
          const nextValue =
            e?.target?.value ??
            e?.currentTarget?.value ??
            (typeof e === "string" ? e : "")

          onChange(nextValue)
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        error={error}
        {...fieldProps}
      />
  )
}

export default TextareaField
