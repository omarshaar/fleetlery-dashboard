import React from "react"
import { Textarea as ShadcnTextarea } from "@/eano/design-system/shadcn/textarea"
import { cn } from "@/eano/lib/utils"
import { Label } from "@/eano/design-system/shadcn/label"

/**
 * Full-featured textarea component with optional label, description, and error.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Optional label text shown above the field */
  label?: string
  /** Description text shown below the field (hidden when error is set) */
  description?: string
  /** Error message shown below the field */
  error?: string
  /** Marks the field as required (adds * symbol) */
  required?: boolean
  /** Custom wrapper class */
  className?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      required,
      className,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId()

    return (
      <div className={cn("flex flex-col gap-1 w-full", className)}>
        {label && (
          <Label htmlFor={textareaId} className="font-medium text-sm text-foreground">
            {label}{" "}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <ShadcnTextarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring",
              "bg-white"
          )}
          {...props}
        />

        {error ? (
          <p className="text-sm text-destructive mt-1">{error}</p>
        ) : description ? (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
