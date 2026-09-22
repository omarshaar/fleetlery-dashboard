import React from "react"
import {
  ColorPicker as ShadcnColorPicker,
  ColorPickerSelection,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerOutput,
  ColorPickerFormat,
} from "@/eano/design-system/shadcn/color-picker"
import { Label } from "@/eano/design-system/shadcn/label"
import { cn } from "@/eano/lib/utils"

/**
 * Fully featured ColorPicker component with label, description, and error message.
 */
export interface ColorPickerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ShadcnColorPicker>, "onChange" | "disabled"> {
  /** Label text shown above the picker */
  label?: string
  /** Description text shown below */
  description?: string
  /** Error message shown below (takes precedence over description) */
  error?: string
  /** Marks the field as required (adds * symbol) */
  required?: boolean
  /** Controlled color value (string or hex) */
  value?: string
  /** Uncontrolled initial value */
  defaultValue?: string
  /** Change handler returning string (normalized color) */
  onChange?: (color: string) => void
  /** Visual disabled state */
  disabled?: boolean
  /** Wrapper class */
  className?: string
  /** Input id */
  id?: string
  /** Output format for value/onChange (default: "hex") */
  outputFormat?: "hex" | "rgba"
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  description,
  error,
  required,
  value,
  defaultValue,
  onChange,
  disabled,
  className,
  id,
  outputFormat = "hex",
  ...props
}) => {
  const inputId = id || React.useId()

  type RgbaTuple = [number, number, number, number]

  const toRgbaTuple = (raw: any): RgbaTuple => {
    // Prefer array input from shadcn ColorPicker
    if (Array.isArray(raw) && raw.length >= 3) {
      const [r, g, b, a = 1] = raw
      return [Number(r) || 0, Number(g) || 0, Number(b) || 0, Number(a) || 0]
    }

    if (typeof raw === "string" && raw.startsWith("rgba")) {
      const inside = raw.replace("rgba(", "").replace(")", "")
      const [r, g, b, a] = inside.split(",").map((n) => Number(n) || 0)
      return [r, g, b, a || 1]
    }

    if (typeof raw === "string" && raw.startsWith("rgb(")) {
      const inside = raw.replace("rgb(", "").replace(")", "")
      const [r, g, b] = inside.split(",").map((n) => Number(n) || 0)
      return [r, g, b, 1]
    }

    if (typeof raw === "string" && raw.includes(",")) {
      const [r, g, b, a = 1] = raw.split(",").map((n) => Number(n) || 0)
      return [r, g, b, a || 1]
    }

    // Fallback
    return [0, 0, 0, 1]
  }

  const rgbaToHex = ([r, g, b]: RgbaTuple): string => {
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
    const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0")
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const rgbaToRgbaString = ([r, g, b, a]: RgbaTuple): string => {
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
    return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${a})`
  }

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {label && (
        <Label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none mb-1",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div
        className={cn(
          "max-w-sm rounded-md border bg-background p-4 shadow-sm transition-opacity",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <ShadcnColorPicker
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          onChange={(color) => {
            const rgba = toRgbaTuple(color)
            const formatted =
              outputFormat === "rgba"
                ? rgbaToRgbaString(rgba)
                : rgbaToHex(rgba)
            onChange?.(formatted)
          }}
          {...props}
        >
          <ColorPickerSelection />
          <div className="flex items-center gap-4">
            <ColorPickerEyeDropper />
            <div className="grid w-full gap-1">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerOutput />
            <ColorPickerFormat />
          </div>
        </ShadcnColorPicker>
      </div>

      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}
