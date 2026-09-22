/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * EanoDatePicker.tsx
 * A professional, ready-to-use Date/DateRange picker built with shadcn/ui (Popover + Calendar).
 * - Supports "single" and "range" modes
 * - Preset ranges (Today, Yesterday, Last 7/30 days, This month)
 * - Min/Max date, custom disabled dates, locale-aware formatting
 * - Clearable, full control via controlled props
 *
 * Usage examples are at the bottom of this file.
 */

import * as React from "react"
import { CalendarIcon, X, ChevronDown } from "lucide-react"
import { addDays, endOfMonth, startOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/eano/lib/utils"
import { Button } from "@/eano/design-system/shadcn/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/eano/design-system/shadcn/popover"
import { Calendar } from "@/eano/design-system/shadcn/calendar"
import { Separator } from "@/eano/design-system/shadcn/separator"
import { Label } from "@/eano/design-system/shadcn/label"
import { Input } from "@/eano/design-system/shadcn/input"

/** Picker mode */
export type PickerMode = "single" | "range"

/** Range type compatible with react-day-picker */
export type RangeValue = DateRange | undefined

/** Custom formatter type */
export type DateFormatter = (date: Date | undefined) => string
export type RangeFormatter = (range: RangeValue) => string

/** Props */
export type EanoDatePickerProps = {
  mode?: PickerMode
  /** Controlled value (Date for single, DateRange for range) */
  value?: Date | RangeValue
  /** onChange callback (Date for single, DateRange for range) */
  onChange?: (val: Date | RangeValue) => void

  /** Labels & UX */
  placeholder?: string
  label?: string
  clearable?: boolean
  disabled?: boolean
  className?: string
  /** Show preset ranges panel (range mode highly benefits) */
  withPresets?: boolean

  /** Date limits & disabling */
  minDate?: Date
  maxDate?: Date
  disabledDates?: (date: Date) => boolean

  /** Formatting */
  locale?: string
  singleFormatter?: DateFormatter
  rangeFormatter?: RangeFormatter

  /** Popover alignment passthroughs (optional) */
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"

  /** Optional inputs to edit from/to manually when in range mode */
  withRangeInputs?: boolean
}

/** Default ISO-like compact formatter using Intl (no dependency on date-fns/format) */
function defaultSingleFormat(date: Date | undefined, locale = "en-US") {
  if (!date) return ""
  const fmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "2-digit" })
  return fmt.format(date)
}

function defaultRangeFormat(range: RangeValue, locale = "en-US") {
  if (!range?.from && !range?.to) return ""
  const fmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "2-digit" })
  const a = range?.from ? fmt.format(range.from) : "…"
  const b = range?.to ? fmt.format(range.to) : "…"
  return `${a} — ${b}`
}

/** Helpers */
const clampDate = (date: Date, min?: Date, max?: Date) => {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

const isDateDisabled = (d: Date, min?: Date, max?: Date, custom?: (date: Date) => boolean) => {
  if (min && d < min) return true
  if (max && d > max) return true
  if (custom && custom(d)) return true
  return false
}

/** Preset builder (returns label + range) */
function buildPresets(now = new Date()): Array<{ key: string; label: string; range: DateRange }> {
  const today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return [
    { key: "today", label: "Today", range: { from: today, to: today } },
    { key: "yesterday", label: "Yesterday", range: { from: addDays(today, -1), to: addDays(today, -1) } },
    { key: "last7", label: "Last 7 days", range: { from: addDays(today, -6), to: today } },
    { key: "last30", label: "Last 30 days", range: { from: addDays(today, -29), to: today } },
    { key: "thisMonth", label: "This month", range: { from: startOfMonth(today), to: endOfMonth(today) } },
  ]
}

/**
 * EanoDatePicker
 * Controlled or uncontrolled (if no value/onChange provided).
 */
export function EanoDatePicker({
  mode = "single",
  value,
  onChange,
  placeholder,
  label,
  clearable = true,
  disabled = false,
  className,
  withPresets = true,
  minDate,
  maxDate,
  disabledDates,
  locale = "en-US",
  singleFormatter,
  rangeFormatter,
  align = "start",
  side = "bottom",
  withRangeInputs = false,
}: EanoDatePickerProps) {
  // Internal state if uncontrolled
  const [internalSingle, setInternalSingle] = React.useState<Date | undefined>(undefined)
  const [internalRange, setInternalRange] = React.useState<RangeValue>(undefined)

  const isRange = mode === "range"

  const currentValue = ((): Date | RangeValue | undefined => {
    if (value !== undefined) return value
    return isRange ? internalRange : internalSingle
  })()

  const setValue = (v: Date | RangeValue | undefined) => {
    if (onChange) onChange(v ?? (isRange ? undefined : undefined))
    if (!onChange) {
      if (isRange) setInternalRange(v as RangeValue)
      else setInternalSingle(v as Date | undefined)
    }
  }

  /** Display text */
  const renderText = React.useMemo(() => {
    if (isRange) {
      const fmt = rangeFormatter ?? ((r: RangeValue) => defaultRangeFormat(r, locale))
      return fmt(currentValue as RangeValue)
    } else {
      const fmt = singleFormatter ?? ((d?: Date) => defaultSingleFormat(d, locale))
      return fmt(currentValue as Date | undefined)
    }
  }, [currentValue, isRange, locale, singleFormatter, rangeFormatter])

  /** Clear action */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue(isRange ? undefined : undefined)
  }

  /** Disabled handler proxy for Calendar */
  const disabledProxy = React.useCallback(
    (d: Date) => isDateDisabled(d, minDate, maxDate, disabledDates),
    [minDate, maxDate, disabledDates]
  )

  /** Range text inputs (optional) */
  const [fromInput, setFromInput] = React.useState("")
  const [toInput, setToInput] = React.useState("")

  React.useEffect(() => {
    if (!withRangeInputs || !isRange) return
    const fmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" })
    const r = currentValue as RangeValue
    setFromInput(r?.from ? fmt.format(r.from) : "")
    setToInput(r?.to ? fmt.format(r.to) : "")
  }, [currentValue, withRangeInputs, isRange, locale])

  const parseDateInput = (v: string) => {
    const parts = v.trim().split(/[./-]/).map((p) => p.trim())
    if (parts.length < 3) return undefined
    // Accept dd.mm.yyyy / mm-dd-yyyy / yyyy-mm-dd (heuristic)
    let day: number, month: number, year: number
    if (parts[0].length === 4) {
      year = Number(parts[0]); month = Number(parts[1]); day = Number(parts[2])
    } else if (Number(parts[2]) > 31) {
      day = Number(parts[1]); month = Number(parts[0]); year = Number(parts[2]) // mm-dd-yyyy
    } else {
      day = Number(parts[0]); month = Number(parts[1]); year = Number(parts[2]) // dd-mm-yyyy
    }
    if (!year || !month || !day) return undefined
    const dt = new Date(year, month - 1, day)
    if (isNaN(dt.getTime())) return undefined
    return clampDate(dt, minDate, maxDate)
  }

  const applyFromInput = () => {
    const d = parseDateInput(fromInput)
    const cur = (currentValue as RangeValue)
    const next: RangeValue = { from: d, to: cur?.to }
    setValue(next)
  }
  const applyToInput = () => {
    const d = parseDateInput(toInput)
    const cur = (currentValue as RangeValue)
    const next: RangeValue = { from: cur?.from, to: d }
    setValue(next)
  }

  const presets = React.useMemo(() => buildPresets(), [])

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <Label className="text-sm">{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between text-left font-normal",
              !renderText && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{renderText || (placeholder ?? (isRange ? "Pick a date range" : "Pick a date"))}</span>
            </div>
            <div className="flex items-center gap-1">
              {clearable && !!renderText && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-1"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 opacity-60" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn("w-auto p-0")}
          align={align}
          side={side}
        >
          <div className={cn(isRange ? "md:flex" : "block")}>
            {withPresets && (
              <div className="p-3 md:w-44">
                <div className="px-1 pb-2 text-xs font-medium text-muted-foreground uppercase">Presets</div>
                <div className="flex flex-col gap-1">
                  {presets.map((p) => (
                    <Button
                      key={p.key}
                      type="button"
                      variant="ghost"
                      className="justify-start"
                      onClick={() => setValue(p.range)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {withPresets && <Separator orientation="vertical" className="hidden md:block" />}

            <div className={cn("p-3", isRange && "md:min-w-[500px]")}>
              <Calendar
                mode={isRange ? "range" : "single"}
                selected={currentValue as any}
                onSelect={(val: any) => {
                  if (isRange) {
                    const r = val as RangeValue
                    // Optional clamp via min/max
                    const clamped: RangeValue = {
                      from: r?.from ? clampDate(r.from, minDate, maxDate) : undefined,
                      to: r?.to ? clampDate(r.to, minDate, maxDate) : undefined,
                    }
                    setValue(clamped)
                  } else {
                    const d = val as Date | undefined
                    setValue(d ? clampDate(d, minDate, maxDate) : undefined)
                  }
                }}
                disabled={disabledProxy}
                numberOfMonths={isRange ? 2 : 1}
                initialFocus
                {...(isRange ? { required: true } : {})}
              />

              {isRange && withRangeInputs && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="from">From</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="from"
                        placeholder="dd.mm.yyyy"
                        value={fromInput}
                        onChange={(e) => setFromInput(e.target.value)}
                        onBlur={applyFromInput}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="to">To</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="to"
                        placeholder="dd.mm.yyyy"
                        value={toInput}
                        onChange={(e) => setToInput(e.target.value)}
                        onBlur={applyToInput}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ---------------------------------------
 * Examples (copy/paste into your page)
 * ---------------------------------------
 *
 * 1) Single date (uncontrolled):
 *
 *   <EanoDatePicker
 *     mode="single"
 *     label="Date of birth"
 *     placeholder="Pick a date"
 *     minDate={new Date(1900,0,1)}
 *     maxDate={new Date()}
 *   />
 *
 * 2) Single date (controlled):
 *
 *   const [dob, setDob] = React.useState<Date | undefined>()
 *   <EanoDatePicker mode="single" value={dob} onChange={(d) => setDob(d as Date)} />
 *
 * 3) Range (controlled) with presets & inputs:
 *
 *   const [range, setRange] = React.useState<DateRange | undefined>()
 *   <EanoDatePicker
 *     mode="range"
 *     value={range}
 *     onChange={(r) => setRange(r as DateRange | undefined)}
 *     withPresets
 *     withRangeInputs
 *   />
 *
 * 4) Custom formatting (German):
 *
 *   const germanSingle: DateFormatter = (d) =>
 *     d ? new Intl.DateTimeFormat("de-DE", { day:"2-digit", month:"long", year:"numeric" }).format(d) : ""
 *   const germanRange: RangeFormatter = (r) => {
 *     const fmt = (x?: Date) => x ? new Intl.DateTimeFormat("de-DE",{ day:"2-digit", month:"2-digit", year:"numeric" }).format(x) : "…"
 *     return `${fmt(r?.from)} bis ${fmt(r?.to)}`
 *   }
 *   <EanoDatePicker mode="range" singleFormatter={germanSingle} rangeFormatter={germanRange} />
 *
 */
