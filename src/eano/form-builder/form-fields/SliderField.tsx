"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Slider } from "@/components"
import { cn } from "@/eano/lib/utils"

/**
 * Field wrapper for Slider component to integrate with Form Builder.
 * Ensures correct value mapping (value <-> number[]),
 * handles label/description/error/required,
 * and forwards all extra props.
 */
const SliderField: React.FC<FieldComponentProps> = ({
  value,
  label,
  disabled,
  className,
  style,
  field,
  onChange,
  onBlur,
  onFocus,
  error,
  required,
}) => {
  // Extract component-level props
  const fieldProps: any = (field as any).props ?? {}

  const {
    description,
    className: sliderClassName,
    ...sliderProps
  } = fieldProps

  // Ensure numeric array format
  const safeValue = Array.isArray(value) ? value : [Number(value) || 0]

  return (
    <div className={cn("w-full", className)} style={style}>
      <Slider
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        value={safeValue}
        onChange={(next) => onChange(next)}
        onBlur={onBlur as any}
        onFocus={onFocus as any}
        className={sliderClassName}
        {...sliderProps}
      />
    </div>
  )
}

export default SliderField
