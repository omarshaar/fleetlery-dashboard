"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Switch } from "@/components"
import { cn } from "@/eano/lib/utils"

/**
 * Field wrapper for Switch component to integrate with Form Builder.
 * Maps value <-> checked, supports label/description/error, and forwards props.
 */
const SwitchField: React.FC<FieldComponentProps> = ({
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
  required,
}) => {
  // Extract extra component-level props
  const fieldProps: any = (field as any).props ?? {}

  const {
    description,
    error,
    className: switchClassName,
    ...switchProps
  } = fieldProps

  // Normalize boolean value
  const checked = !!value

  return (
    <div className={cn("w-full", className)} style={style}>
      <Switch
        id={name}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        checked={checked}
        onChange={(next) => onChange(next)}
        onBlur={onBlur as any}
        onFocus={onFocus as any}
        className={switchClassName}
        {...switchProps}
      />
    </div>
  )
}

export default SwitchField
