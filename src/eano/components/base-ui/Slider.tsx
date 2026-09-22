/**
 * @file Slider.tsx
 * @description Unified Slider component (Radix-based)
 * Supports label, description, error, required, disabled, and consistent onChange signature.
 */

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/eano/lib/utils";

export interface SliderProps {
  /** Label above the slider */
  label?: React.ReactNode;
  /** Helper text below the slider */
  description?: React.ReactNode;
  /** Error message (if any) */
  error?: React.ReactNode;
  /** Mark field as required */
  required?: boolean;

  /** Controlled value */
  value?: number[];
  /** Default (uncontrolled) value */
  defaultValue?: number[];
  /** Fired whenever slider value changes */
  onChange?: (value: number[]) => void;

  /** Range configuration */
  min?: number;
  max?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";

  /** Disabled state */
  disabled?: boolean;

  /** Custom classes */
  className?: string;
}

/**
 * Single, unified Slider component.
 */
export function Slider({
  label,
  description,
  error,
  required,
  disabled,
  className,
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  orientation = "horizontal",
}: SliderProps) {
  // internal state for uncontrolled mode
  const [internalValue, setInternalValue] = React.useState<number[]>(defaultValue ?? [min]);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value! : internalValue;

  // proxy handler to unify behavior
  const handleValueChange = (next: number[]) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Label */}
      {label && (
        <label className="mb-1.5 text-sm font-medium text-foreground/90">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      )}

      {/* Slider */}
      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={currentValue}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        orientation={orientation}
        className={cn(
          "relative flex touch-none select-none items-center w-full data-[orientation=vertical]:flex-col",
          "data-[orientation=horizontal]:h-4 data-[orientation=vertical]:h-full"
        )}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative grow overflow-hidden rounded-full bg-muted",
            "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:h-full"
          )}
        >
          <SliderPrimitive.Range
            className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>

        {currentValue.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              "block size-4 rounded-full border border-primary bg-background shadow-sm transition-shadow",
              "hover:ring-4 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
            )}
          />
        ))}
      </SliderPrimitive.Root>

      {/* Helper or error */}
      {error ? (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      ) : description ? (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
