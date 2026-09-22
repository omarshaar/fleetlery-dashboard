import React from "react"
import { Switch as ShadcnSwitch } from "@/eano/design-system/shadcn/switch"
import { Label } from "@/eano/design-system/shadcn/label"
import { cn } from "@/eano/lib/utils"

/**
 * Full-featured Switch component with label, description, and error state.
 */
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Optional label text displayed next to the switch */
  label?: string
  /** Optional description below the field */
  description?: string
  /** Optional error message (overrides description) */
  error?: string
  /** Marks field as required (adds *) */
  required?: boolean
  /** Controlled state */
  checked?: boolean
  /** Uncontrolled initial state */
  defaultChecked?: boolean
  /** Change handler */
  onChange?: (checked: boolean) => void
  /** Disable the switch */
  disabled?: boolean
  /** Wrapper className */
  className?: string
  /** Optional id for accessibility */
  id?: string
}

export const Switch: React.FC<SwitchProps> = ({
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
  const switchId = id || React.useId()

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={switchId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={(state) => onChange?.(!!state)}
          disabled={disabled}
          aria-invalid={!!error}
          {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== "type"))}
        />
        {label && (
          <Label
            htmlFor={switchId}
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
