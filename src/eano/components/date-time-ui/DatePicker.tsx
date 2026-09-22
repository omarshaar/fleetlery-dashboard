"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/eano/design-system/shadcn/button"
import { Calendar } from "@/eano/design-system/shadcn/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/eano/design-system/shadcn/popover"
import { cn } from "@/eano/lib/utils"
import type { BaseFieldProps } from "../_shared/field-types"
import { FieldWrapper } from "../_shared/FieldWrapper"

/**
 * Unified DatePicker component.
 * - Single import only.
 * - Controlled & uncontrolled modes supported.
 * - Integrates Label, Description, Error (from FieldWrapper).
 * - Uses Shadcn Calendar + Popover internally.
 */

export type DatePickerProps = BaseFieldProps & {
  /** Selected date (for controlled mode) */
  value?: Date
  /** Initial date (for uncontrolled mode) */
  defaultValue?: Date
  /** Fired when date changes */
  onChange?: (date: Date | undefined) => void
  /** Placeholder when no date selected */
  placeholder?: string
  /** Calendar mode (single or multiple) */
  mode?: "single" | "multiple"
  /** Disable selecting dates before minDate or after maxDate */
  minDate?: Date
  maxDate?: Date
  /** Alignment of popover */
  align?: "start" | "center" | "end"
  /** Popover side */
  side?: "bottom" | "top" | "left" | "right"
  /** Close automatically after selecting */
  autoClose?: boolean
}

export function DatePicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  className,
  value,
  defaultValue,
  onChange,
  placeholder = "Select date",
  mode = "single",
  minDate,
  maxDate,
  align = "start",
  side = "bottom",
  autoClose = true,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [internalDate, setInternalDate] = useState<Date | undefined>(defaultValue)
  const isControlled = value !== undefined
  const selected = isControlled ? value : internalDate

  function handleSelect(date: Date | undefined) {
    if (!isControlled) setInternalDate(date)
    onChange?.(date)
    if (autoClose) setOpen(false)
  }

  return (
    <FieldWrapper
      id={id ?? "date-picker"}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-48 justify-between font-normal",
              !selected && "text-muted-foreground",
              error && "border-destructive! focus-visible:ring-destructive"
            )}
          >
            {selected ? selected.toLocaleDateString() : placeholder}
            <ChevronDownIcon className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align={align}
          side={side}
          className="w-auto overflow-hidden p-0"
        >
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              fromDate={minDate}
              toDate={maxDate}
              captionLayout="dropdown"
            />
          ) : (
            <Calendar
              mode="multiple"
              selected={selected ? [selected] : []}
              onSelect={(dates) => handleSelect(dates?.[0])}
              fromDate={minDate}
              toDate={maxDate}
              captionLayout="dropdown"
              required
            />
          )}
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  )
}
