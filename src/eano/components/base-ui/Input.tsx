import React from "react"
import { Label } from "@/components"
import {Input as BaseInput} from "@/eano/design-system/shadcn/input";
import { cn } from "@/eano/lib/utils"

/**
 * Full-featured input component with optional label, description, and error state.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string
  /** Description or helper text shown below the input */
  description?: string
  /** Error message shown below the input (overrides description if present) */
  error?: string
  /** Marks the field as required (adds * symbol) */
  required?: boolean
  /** Custom class for the wrapper */
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      required,
      className,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

    return (
      <div className={cn("flex flex-col gap-1 w-full", className)}>
        {/* 🔹 Label */}
        {label && (
          <Label htmlFor={inputId} className="font-medium text-sm text-foreground">
            {label}{" "}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        {/* 🔹 Input Field */}
        <BaseInput
          id={inputId}
          ref={ref}
          type={type}
          aria-invalid={!!error}
          className={cn(
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring", "h-full min-h-10",
              "bg-white"
          )}
          {...props}
        />

        {/* 🔹 Helper or Error Message */}
        {error ? (
          <p className="text-sm text-destructive mt-1">{error}</p>
        ) : description ? (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = "Input"
