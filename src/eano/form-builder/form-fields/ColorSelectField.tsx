"use client";

import React from "react";
import type { FieldComponentProps } from "../types/form.types";
import { ColorPresetSelect } from "@/components";
import { cn } from "@/eano/lib/utils";

/**
 * ColorSelectField
 *
 * Renders a select input with predefined color options (palette).
 * The schema provides colors via `field.props.colors`.
 */
const ColorSelectField: React.FC<FieldComponentProps> = ({
  name,
  value,
  label,
  disabled,
  className,
  style,
  field,
  error,
  onChange,
  required,
}) => {
  const fieldProps: any = (field as any).props ?? {};

  const {
    description,
    colors = [],
    ...restProps
  } = fieldProps;

  // Normalize colors to ColorPresetOption[]
  const normalizedColors = (colors as any[]).map((c) => {
    if (typeof c === "string") {
      return { value: c, label: c };
    }
    if (c && typeof c === "object") {
      return {
        value: String(c.value ?? ""),
        label: c.label ?? String(c.value ?? ""),
        disabled: c.disabled ?? false,
      };
    }
    return { value: "", label: "" };
  }).filter((c) => c.value);

  const currentValue = typeof value === "string" ? value : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)} style={style}>
      <ColorPresetSelect
        id={name}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        value={currentValue}
        onChange={(next) => onChange(next)}
        colors={normalizedColors}
        {...restProps}
      />
    </div>
  );
};

export default ColorSelectField;
