"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Checkbox } from "@/components"
import { cn } from "@/eano/lib/utils"

/**
 * Checkbox Adapter (FINAL, FIXED VERSION)
 * ----------------------------------------------------------------
 * ✓ Safe boolean casting for persistence
 * ✓ Unified onChange(next)
 * ✓ Prevents field.props override
 * ✓ Handles label, description, required, error
 * ✓ Stable on refresh + session/local storage
 */
const CheckboxField: React.FC<FieldComponentProps> = ({
  name,
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
  // Extract props from schema safely
  const fieldProps: any =
    "props" in field && (field as any).props ? { ...(field as any).props } : {}

  // User-level handlers defined in schema.props
  const userOnChange = fieldProps.onChange as
    | ((next: boolean) => void)
    | undefined
  const userOnBlur = fieldProps.onBlur as
    | ((e: React.FocusEvent<any>) => void)
    | undefined
  const userOnFocus = fieldProps.onFocus as
    | ((e: React.FocusEvent<any>) => void)
    | undefined

  // Do not forward these directly; we compose them manually
  delete fieldProps.onChange
  delete fieldProps.onBlur
  delete fieldProps.onFocus

  const {
    description,
    className: checkboxClassName,
    ...checkboxProps
  } = fieldProps

  // FINAL Boolean Casting (solves refresh + persistence issues)
  const checked =
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"

  return (
    <div className={cn("w-full", className)} style={style}>
      <Checkbox
        id={name}
        label={label}
        description={description}
        error={error}
        required={required}
        checked={checked}
        disabled={disabled}
        className={checkboxClassName}

        // Always return boolean to Form Builder
        onChange={(next: boolean) => {
          if (typeof userOnChange === "function") {
            userOnChange(next)
          }
          onChange(next)
        }}

        // pass focus events (and compose with user handlers)
        onBlur={(e: React.FocusEvent<any>) => {
          if (typeof userOnBlur === "function") {
            userOnBlur(e)
          }
          ;(onBlur as any)?.(e)
        }}
        onFocus={(e: React.FocusEvent<any>) => {
          if (typeof userOnFocus === "function") {
            userOnFocus(e)
          }
          ;(onFocus as any)?.(e)
        }}

        // safe props only
        {...checkboxProps}
      />
    </div>
  )
}

export default CheckboxField
