import React from "react"
import { Checkbox as ShadcnCheckbox } from "@/eano/design-system/shadcn/checkbox"
import { Label } from "@/eano/design-system/shadcn/label"
import { cn } from "@/eano/lib/utils"

/**
 * Fully featured Checkbox component with label, description, and error message.
 */
export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ShadcnCheckbox>, 'onChange' | 'onCheckedChange'> {
  /** Label text shown next to the checkbox */
  label?: string
  /** Description text shown below */
  description?: string
  /** Error message shown below (takes precedence over description) */
  error?: string
  /** Marks the checkbox as required (adds * symbol) */
  required?: boolean
  /** Controlled state */
  checked?: boolean
  /** Uncontrolled initial state */
  defaultChecked?: boolean
  /** Change handler */
  onChange?: (checked: boolean) => void
  /** Disable checkbox */
  disabled?: boolean
  /** Wrapper class */
  className?: string
  /** Input id */
  id?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  required,
  checked,
  defaultChecked,
  onChange,
  disabled,
  className,
  id,
  ...props
}) => {
  const inputId = id || React.useId()

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <div className="flex items-center gap-2">
        <ShadcnCheckbox
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(state) => onChange?.(!!state)}
          disabled={disabled}
          aria-invalid={!!error}
          {...props}
          className="bg-white"
        />
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer select-none",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
      </div>

      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}
