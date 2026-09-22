/**
 * @file EanoTimePicker.tsx
 * @description Professional full-control Time Picker that allows selecting any hour/minute freely.
 * Supports 12h/24h formats, min/max limits, clearable button, and fully responsive styling.
 * ✅ Fixed overflow issues – elements never exceed container width.
 */

import * as React from "react"
import { Clock, X } from "lucide-react"
import { cn } from "@/eano/lib/utils"
import { Button } from "@/eano/design-system/shadcn/button"
import { Label } from "@/eano/design-system/shadcn/label"
import { Input } from "@/eano/design-system/shadcn/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/eano/design-system/shadcn/popover"

export type EanoTimePickerProps = {
  value?: string
  onChange?: (val: string | undefined) => void
  label?: string
  placeholder?: string
  clearable?: boolean
  format?: 12 | 24
  minTime?: string
  maxTime?: string
  disabled?: boolean
  className?: string
}

const pad = (n: number) => String(n).padStart(2, "0")
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max))

export function EanoTimePicker({
  value,
  onChange,
  label,
  placeholder = "HH:mm",
  clearable = true,
  format = 24,
  minTime,
  maxTime,
  disabled,
  className,
}: EanoTimePickerProps) {
  const [internal, setInternal] = React.useState<string>("")
  const time = value ?? internal
  const setValue = (v?: string) => {
    if (onChange) onChange(v)
    else setInternal(v ?? "")
  }

  const [hour, setHour] = React.useState<number>(12)
  const [minute, setMinute] = React.useState<number>(0)
  const [suffix, setSuffix] = React.useState<"AM" | "PM">("AM")

  React.useEffect(() => {
    if (time) {
      const match = time.match(/(\d{1,2}):(\d{1,2})(?: ?(AM|PM))?/)
      if (match) {
        let h = Number(match[1])
        const m = Number(match[2])
        const sfx = match[3] as "AM" | "PM" | undefined
        if (format === 12 && sfx) setSuffix(sfx)
        setHour(h)
        setMinute(m)
      }
    }
  }, [time, format])

  const formatted = React.useMemo(() => {
    let h = hour
    if (format === 12) {
      if (suffix === "PM" && h < 12) h += 12
      if (suffix === "AM" && h === 12) h = 0
    }
    return `${pad(h)}:${pad(minute)}`
  }, [hour, minute, suffix, format])

  const apply = () => {
    if (minTime && formatted < minTime) return
    if (maxTime && formatted > maxTime) return
    setValue(formatted)
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <Label>{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={disabled}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate">{time || placeholder}</span>
            </div>
            {clearable && !!time && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setValue(undefined)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>

        {/* ✅ Fixed Popover Layout */}
        <PopoverContent className="w-60 max-w-full overflow-hidden">
          <div className="flex flex-col gap-4 p-2 w-full overflow-hidden">
            {/* Hour & Minute Controls */}
            <div className="flex flex-wrap justify-between items-center gap-2 w-full overflow-hidden">
              {/* Hour */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="icon"
                  onClick={() => setHour(clamp(hour - 1, 0, format === 12 ? 12 : 23))}
                >
                  –
                </Button>
                <Input
                  value={pad(hour)}
                  onChange={(e) => {
                    const val = clamp(Number(e.target.value), 0, format === 12 ? 12 : 23)
                    setHour(val)
                  }}
                  className="w-20 text-center min-w-0"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => setHour(clamp(hour + 1, 0, format === 12 ? 12 : 23))}
                >
                  +
                </Button>
              </div>

              <span className="text-lg font-medium shrink-0"></span>

              {/* Minute */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="icon"
                  onClick={() => setMinute(clamp(minute - 1, 0, 59))}
                >
                  –
                </Button>
                <Input
                  value={pad(minute)}
                  onChange={(e) => {
                    const val = clamp(Number(e.target.value), 0, 59)
                    setMinute(val)
                  }}
                  className="w-20 text-center min-w-0"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => setMinute(clamp(minute + 1, 0, 59))}
                >
                  +
                </Button>
              </div>

              {/* AM/PM Toggle */}
              {format === 12 && (
                <Button
                  variant="outline"
                  onClick={() => setSuffix(suffix === "AM" ? "PM" : "AM")}
                  className="shrink-0"
                >
                  {suffix}
                </Button>
              )}
            </div>

            {/* Manual Input */}
            <div className="flex flex-wrap gap-2 w-full">
              <Input
                placeholder="HH:mm"
                value={time}
                onChange={handleManualChange}
                className="flex-1 min-w-0"
              />
              <Button onClick={apply} className="shrink-0">
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ---------------------------------------
 * Example Usage
 * ---------------------------------------
 *
 * import * as React from "react"
 * import { EanoTimePicker } from "@/eano/design-system/shadcn/components/time-picker/EanoTimePicker"
 *
 * export default function Example() {
 *   const [time, setTime] = React.useState<string>()
 *   return (
 *     <div className="max-w-sm space-y-4">
 *       <EanoTimePicker
 *         label="Choose any time"
 *         value={time}
 *         onChange={setTime}
 *         format={12}
 *       />
 *     </div>
 *   )
 * }
 */
