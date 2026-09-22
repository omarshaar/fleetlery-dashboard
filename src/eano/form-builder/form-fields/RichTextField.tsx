"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { EanoRichTextEditor } from "@/components"
import { cn } from "@/eano/lib/utils"

/**
 * Adapter to integrate EanoRichTextEditor with the Dynamic Form Builder.
 * Maps FieldComponentProps -> EanoRichTextEditor props.
 */
const RichTextField: React.FC<FieldComponentProps> = ({
  name,
  value,
  label,
  placeholder,
  disabled,
  className,
  style,
  field,
  error,
  onChange
}) => {
  // Safe extraction of schema-level props
  const fieldProps: any = (field as any).props ?? {}

  const {
    description,
    height,
    editorOptions,
    className: editorClassName,
    ...editorProps
  } = fieldProps

  return (
    <div className={cn("w-full", className)} style={style}>
      <EanoRichTextEditor
        name={name}
        label={label}
        description={description}
        value={value ?? ""}
        onChange={(nextValue) => onChange(nextValue)}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        height={height}
        className={editorClassName}

        options={editorOptions}

        {...editorProps}
      />
    </div>
  )
}

export default RichTextField
