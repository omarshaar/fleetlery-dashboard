import React from "react"
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from "@/eano/design-system/shadcn/radio-group"
import { Label } from "@/eano/design-system/shadcn/label"
import { cn } from "@/eano/lib/utils"
import { useLanguage } from "@/i18n/hooks"

/**
 * RadioGroup component with label, options, description, and error message.
 */
export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface RadioGroupProps {
  /** Optional label shown above the radio list */
  label?: string
  /** Description text shown below the group */
  description?: string
  /** Error message shown below (overrides description) */
  error?: string
  /** Marks as required */
  required?: boolean
  /** Controlled selected value */
  value?: string
  /** Default value for uncontrolled mode */
  defaultValue?: string
  /** Called when value changes */
  onChange?: (value: string) => void
  /** Disable all radios */
  disabled?: boolean
  /** Options list */
  options: RadioOption[]
  /** Wrapper className */
  className?: string
  /** Group name/id */
  id?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  description,
  error,
  required,
  value,
  defaultValue,
  onChange,
  disabled,
  options,
  className,
  id,
}) => {
  const groupId = id || React.useId()
  const { direction } = useLanguage()

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {label && (
        <Label htmlFor={groupId} className="font-medium text-sm text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <ShadcnRadioGroup
        id={groupId}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        className="flex flex-col gap-2 mt-1"
        style={{direction: direction as "ltr" | "rtl"}}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={opt.value}
              id={`${groupId}-${opt.value}`}
              disabled={disabled || opt.disabled}
              className="bg-white"
            />
            <Label
              htmlFor={`${groupId}-${opt.value}`}
              className={cn(
                "text-sm cursor-pointer select-none",
                (disabled || opt.disabled) && "opacity-60 cursor-not-allowed"
              )}
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </ShadcnRadioGroup>

      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}
