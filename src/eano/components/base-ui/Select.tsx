import React from "react"
import {
  Select as ShadcnSelect,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
} from "@/eano/design-system/shadcn/select"
import { Label } from "@/eano/design-system/shadcn/label"
import { cn } from "@/eano/lib/utils"

/**
 * Full-featured Select component with label, description, error and required states.
 */
export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps {
  /** Label text displayed above the field */
  label?: string
  /** Description text below the field */
  description?: string
  /** Error message text (overrides description) */
  error?: string
  /** Marks the field as required (adds *) */
  required?: boolean
  /** Placeholder text shown when no value is selected */
  placeholder?: string
  /** List of selectable options */
  options: SelectOption[]
  /** Controlled value */
  value?: string
  /** Uncontrolled default value */
  defaultValue?: string
  /** Called when a value is selected */
  onChange?: (value: string) => void
  /** Disables the field */
  disabled?: boolean
  /** Custom wrapper class */
  className?: string
  /** Field id for accessibility */
  id?: string
}

export const Select: React.FC<SelectProps> = ({
  label,
  description,
  error,
  required,
  placeholder = "Select an option",
  options,
  value,
  defaultValue,
  onChange,
  disabled,
  className,
  id,
}) => {
  const selectId = id || React.useId()

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <Label htmlFor={selectId} className="font-medium text-sm text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      {/* Main Select Wrapper */}
      <ShadcnSelect
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        {/* Select Trigger */}
        <ShadcnSelectTrigger
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring",
            "bg-white w-full",
            className
          )}
        >
          <ShadcnSelectValue placeholder={placeholder} />
        </ShadcnSelectTrigger>

        {/* Options List */}
        <ShadcnSelectContent>
          {options.map((opt) => (
            <ShadcnSelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </ShadcnSelectItem>
          ))}
        </ShadcnSelectContent>
      </ShadcnSelect>

      {/* Error or Description */}
      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}
