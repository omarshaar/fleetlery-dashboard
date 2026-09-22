"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { RadioGroup } from "@/components"
import { cn } from "@/eano/lib/utils"

const RadioField: React.FC<FieldComponentProps> = ({
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
  // Extract schema props
  const fieldProps: any = (field as any).props ?? {}

  const {
    description,
    options = [],
    className: radioClassName,
    ...radioProps
  } = fieldProps

  return (
    <div className={cn("w-full", className)} style={style}>
      <RadioGroup
        id={name}
        label={label}
        value={value ?? ""}
        options={options}
        required={required}
        error={error}
        description={description}
        disabled={disabled}
        className={radioClassName}
        onChange={(next) => onChange(next)}
        onBlur={onBlur as any}
        onFocus={onFocus as any}
        {...radioProps}
      />
    </div>
  )
}

export default RadioField
