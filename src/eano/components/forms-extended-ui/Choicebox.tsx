"use client"

import * as React from "react"
import {
  Choicebox as ShadcnChoicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
} from "@/eano/design-system/shadcn/choicebox"
import { FieldWrapper } from "@/eano/components/_shared/FieldWrapper"
import type { BaseFieldProps } from "@/eano/components/_shared/field-types"
import { cn } from "@/eano/lib/utils"

/**
 * Choicebox – unified wrapper for Shadcn Choicebox
 * -------------------------------------------------------------
 * - Single component to render all selectable options
 * - Supports controlled/uncontrolled modes
 * - Uses FieldWrapper for label, error, description
 * - Keeps original layout and style 100%
 */

export type ChoiceOption = {
  id: string
  label: string
  subtitle?: string
  description?: string
  disabled?: boolean
}

type ChoiceboxProps = BaseFieldProps &
  (
    | {
        /** Controlled mode */
        value: string
        onChange: (value: string) => void
        defaultValue?: never
      }
    | {
        /** Uncontrolled mode */
        defaultValue?: string
        onChange?: (value: string) => void
        value?: never
      }
  ) & {
    /** Array of options to display */
    options: ChoiceOption[]
  }

export function Choicebox({
  label,
  description,
  error,
  required,
  disabled,
  className,
  id: providedId,
  options,
  ...rest
}: ChoiceboxProps) {
  const reactId = React.useId()
  const id = providedId ?? `choicebox-${reactId}`
  const describedById = `${id}-desc`

  const isControlled = "value" in rest
  const [internal, setInternal] = React.useState(rest.defaultValue ?? "")
  const value = isControlled ? (rest as any).value : internal

  const handleChange = (val: string) => {
    if (!isControlled) setInternal(val)
    rest.onChange?.(val)
  }

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <div className={cn("max-w-md", disabled && "opacity-60 pointer-events-none")}>
        <ShadcnChoicebox
          value={value}
          onValueChange={handleChange}
          disabled={disabled}
          aria-describedby={describedById}
          className="w-full"
        >
          {options.map((option) => (
            <ChoiceboxItem key={option.id} value={option.id} disabled={option.disabled}>
              <ChoiceboxItemHeader>
                <ChoiceboxItemTitle>
                  {option.label}
                  {option.subtitle && (
                    <ChoiceboxItemSubtitle>{option.subtitle}</ChoiceboxItemSubtitle>
                  )}
                </ChoiceboxItemTitle>
                {option.description && (
                  <ChoiceboxItemDescription>{option.description}</ChoiceboxItemDescription>
                )}
              </ChoiceboxItemHeader>
              <ChoiceboxItemContent>
                <ChoiceboxItemIndicator />
              </ChoiceboxItemContent>
            </ChoiceboxItem>
          ))}
        </ShadcnChoicebox>
      </div>
    </FieldWrapper>
  )
}
