"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { TimePicker } from "@/components"
import { cn } from "@/eano/lib/utils"

/**
 * Field wrapper for TimePicker to integrate with the Dynamic Form Builder.
 * Handles mapping of value <-> Form Builder state, supports label, description,
 * error, required, disabled, and forwards all props safely.
 */
const TimePickerField: React.FC<FieldComponentProps> = ({
  name,
  value,
  label,
  disabled,
  className,
  style,
  field,
  error,
  onChange,
  onBlur,
  onFocus,
  required,
}) => {
  const fieldProps: any = (field as any).props ?? {}

  const {
    description,
    className: timeClassName,
    placeholder,
    step,
    min,
    max,
    ...timeProps
  } = fieldProps

  // Normalize value (input wants string HH:mm or HH:mm:ss)
  const safeValue = typeof value === "string" ? value : value ?? ""

  return (
    <div className={cn("w-full", className)} style={style}>
      <TimePicker
        id={name}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        value={safeValue}
        onChange={(next) => onChange(next)}
        onBlur={onBlur as any}
        onFocus={onFocus as any}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        className={timeClassName}
        {...timeProps}
      />
    </div>
  )
}

export default TimePickerField
