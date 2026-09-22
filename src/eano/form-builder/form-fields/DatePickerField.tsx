"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { DatePicker } from "@/components"
import { cn } from "@/eano/lib/utils"

/* -------------------------------------------------------
   Helper: Convert stored string → Date object
------------------------------------------------------- */
function parseDate(value: any): Date | undefined {
  if (!value) return undefined;

  if (value instanceof Date) return value;

  // convert "2025-11-26" → Date
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

/**
 * DatePickerField Adapter (Fixed)
 */
const DatePickerField: React.FC<FieldComponentProps> = ({
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
    className: dateClassName,
    placeholder,
    mode,
    minDate,
    maxDate,
    align,
    side,
    autoClose,
    ...dateProps
  } = fieldProps

  // 🔥 FIX: Convert stored string value back to a real Date object
  const safeValue = parseDate(value)

  return (
    <div className={cn("w-full", className)} style={style}>
      <DatePicker
        id={name}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        value={safeValue}
        
        // 🔥 Save as string "YYYY-MM-DD" using local timezone
        onChange={(next: Date | undefined) => {
          if (!next) {
            onChange("")
            return
          }
          const year = next.getFullYear()
          const month = String(next.getMonth() + 1).padStart(2, "0")
          const day = String(next.getDate()).padStart(2, "0")
          const str = `${year}-${month}-${day}`
          onChange(str)
        }}

        onBlur={onBlur as any}
        onFocus={onFocus as any}
        placeholder={placeholder}
        mode={mode}
        minDate={minDate}
        maxDate={maxDate}
        align={align}
        side={side}
        autoClose={autoClose}
        className={dateClassName}
        {...dateProps}
      />
    </div>
  )
}

export default DatePickerField
