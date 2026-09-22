"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Input } from "@/components"

/**
 * Adapter layer to make Input compatible with the Form Builder engine.
 * Automatically sets required prop if field has validation: "required"
 */
const InputField: React.FC<FieldComponentProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  label,
  className,
  style,
  field,
  error,
  required
}) => {
  const fieldProps: any =
    "props" in field && (field as any).props ? { ...(field as any).props } : {}

  // User-level DOM handlers defined in schema.props
  const userOnChange = fieldProps.onChange as
    | ((e: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined
  const userOnBlur = fieldProps.onBlur as
    | ((e: React.FocusEvent<HTMLInputElement>) => void)
    | undefined
  const userOnFocus = fieldProps.onFocus as
    | ((e: React.FocusEvent<HTMLInputElement>) => void)
    | undefined

  // Do not forward these directly; we compose them manually
  delete fieldProps.onChange
  delete fieldProps.onBlur
  delete fieldProps.onFocus

  return (
    <Input
      id={name}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      value={value ?? ""}
      onChange={(e) => {
        // 1) run user handler from schema.props (if any)
        if (typeof userOnChange === "function") {
          userOnChange(e)
        }
        // 2) run core Form Builder handler (updates Redux, triggers events)
        onChange(e.target.value)
      }}
      onFocus={(e) => {
        if (typeof userOnFocus === "function") {
          userOnFocus(e)
        }
        onFocus?.(e)
      }}
      onBlur={(e) => {
        if (typeof userOnBlur === "function") {
          userOnBlur(e)
        }
        onBlur?.(e)
      }}
      className={className}
      style={style}
      error={error}
      required={required}
      {...fieldProps}
    />
  )
}

export default InputField
