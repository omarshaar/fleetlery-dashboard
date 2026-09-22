"use client"

import React from "react"
import type { FieldComponentProps } from "../types/form.types"
import { Button, Spinner } from "@/components"
import { cn } from "@/eano/lib/utils"

const ButtonField: React.FC<FieldComponentProps> = ({
  name,
  label,
  className,
  style,
  field,
  required,
}) => {
  const fieldProps =
    field && "props" in field && field.props
      ? { ...(field.props as Record<string, any>) }
      : {}

  const {
    description,
    error,
    variant,
    size,
    type = "button",
    isLoading = false,
    ...buttonProps
  } = fieldProps

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)} style={style}>
      {label && (
        <p className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </p>
      )}

      <Button
        id={name}
        type={type}
        variant={variant}
        size={size}
        disabled={isLoading || buttonProps.disabled}
        {...buttonProps}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
              <Spinner className="size-6!" />
          ) : (
            <span>{fieldProps.text ?? "Button"}</span>
          )}
        </div>
      </Button>

      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}

export default ButtonField
