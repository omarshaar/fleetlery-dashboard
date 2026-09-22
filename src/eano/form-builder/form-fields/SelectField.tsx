"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Select } from "@/components"
import { cn } from "@/eano/lib/utils"

const SelectField: React.FC<FieldComponentProps> = ({
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
  // Clone schema props safely
  const fieldProps: any =
    "props" in field && (field as any).props ? { ...(field as any).props } : {}

  // User-level handlers defined in schema.props
  const userOnChange = fieldProps.onChange as
    | ((value: string) => void)
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
    className: selectClassName,
    options = [],
    placeholder,
    ...selectProps
  } = fieldProps

  // Safe string casting for persistence/hydration
  const safeValue =
    typeof value === "string"
      ? value
      : value === null || value === undefined
        ? ""
        : String(value)

  return (
    <div className={cn("w-full", className)} style={style}>
      <Select
        id={name}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        value={safeValue}
        onChange={(next: string) => {
          if (typeof userOnChange === "function") {
            userOnChange(next)
          }
          onChange(next)
        }}
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
        options={options}
        placeholder={placeholder}
        className={selectClassName}
        {...selectProps}
      />
    </div>
  )
}

export default SelectField
