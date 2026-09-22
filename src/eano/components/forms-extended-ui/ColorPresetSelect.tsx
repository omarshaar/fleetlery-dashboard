"use client";

import React from "react";
import {
  Select as ShadcnSelect,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
} from "@/eano/design-system/shadcn/select";
import { Label } from "@/eano/design-system/shadcn/label";
import { cn } from "@/eano/lib/utils";

export interface ColorPresetOption {
  /** Color value (e.g. #3b82f6, rgba(...)) */
  value: string;
  /** Optional display label, defaults to value */
  label?: string;
  /** Disable selecting this color */
  disabled?: boolean;
}

export interface ColorPresetSelectProps {
  /** Label text shown above the select */
  label?: string;
  /** Helper description text */
  description?: string;
  /** Error message (overrides description) */
  error?: string;
  /** Marks field as required */
  required?: boolean;
  /** Predefined color options */
  colors: ColorPresetOption[];
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Change handler returning selected color value */
  onChange?: (value: string) => void;
  /** Disable the select */
  disabled?: boolean;
  /** Wrapper className */
  className?: string;
  /** Input id */
  id?: string;
}

export const ColorPresetSelect: React.FC<ColorPresetSelectProps> = ({
  label,
  description,
  error,
  required,
  colors,
  value,
  defaultValue,
  onChange,
  disabled,
  className,
  id,
}) => {
  const selectId = id || React.useId();

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {label && (
        <Label
          htmlFor={selectId}
          className={cn(
            "text-sm font-medium leading-none",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <ShadcnSelect
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <ShadcnSelectTrigger
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring",
            "bg-white w-full"
          )}
        >
          <ShadcnSelectValue placeholder={label} />
        </ShadcnSelectTrigger>

        <ShadcnSelectContent>
          {colors.map((opt) => (
            <ShadcnSelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full border"
                  style={{ backgroundColor: opt.value }}
                />
                <span>{opt.label ?? opt.value}</span>
              </div>
            </ShadcnSelectItem>
          ))}
        </ShadcnSelectContent>
      </ShadcnSelect>

      {error ? (
        <p className="text-sm text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  );
};
