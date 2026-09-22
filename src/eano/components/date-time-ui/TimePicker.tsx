"use client"

import React, { useState } from "react"
import { Input } from "@/eano/design-system/shadcn/input"
import { cn } from "@/eano/lib/utils"
import type { BaseFieldProps } from "../_shared/field-types"
import { FieldWrapper } from "../_shared/FieldWrapper"

/**
 * Unified TimePicker component.
 * - Single import only.
 * - Controlled & uncontrolled supported.
 * - Uses native <input type="time"> internally.
 */

export type TimePickerProps = BaseFieldProps & {
  /** Controlled value (HH:mm:ss format) */
  value?: string
  /** Default value (for uncontrolled mode) */
  defaultValue?: string
  /** Change handler (returns HH:mm:ss string) */
  onChange?: (value: string) => void
  /** Placeholder text (when browser allows) */
  placeholder?: string
  /** Step in seconds (e.g., 60 = 1 minute, 1 = 1 second) */
  step?: number
  /** Minimum allowed time (HH:mm:ss) */
  min?: string
  /** Maximum allowed time (HH:mm:ss) */
  max?: string
}

export function TimePicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  className,
  value,
  defaultValue,
  onChange,
  placeholder,
  step = 1,
  min,
  max,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVal = e.target.value
    if (!isControlled) setInternalValue(newVal)
    onChange?.(newVal)
  }

  return (
    <FieldWrapper
      id={id ?? "time-picker"}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Input
        id={id ?? "time-picker"}
        type="time"
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        className={cn(
          "bg-background appearance-none w-48 font-normal",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
    </FieldWrapper>
  )
}
