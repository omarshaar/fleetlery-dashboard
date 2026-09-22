"use client";

import React, { useState } from "react";
import type { FieldComponentProps } from "../types/form.types";
import { ColorPicker, Button, Dialog } from "@/components";
import { cn } from "@/eano/lib/utils";
import { useLanguage } from "@/i18n";

/**
 * Helper: Normalize color value for preview / initial value
 */
function normalizeColor(raw: any): string {
  if (typeof raw === "string" && raw.trim().length > 0) {
    // Accept any valid CSS color string (e.g., #hex, rgb(...), rgba(...))
    return raw;
  }

  // Fallback preview color
  return "#000000";
}

/**
 * ColorPickerField Adapter
 *
 * Opens ColorPicker in a Dialog when clicking the preview button.
 * Returns color value as string in the configured format (hex/rgba).
 */
const ColorPickerField: React.FC<FieldComponentProps> = ({
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
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempColor, setTempColor] = useState<string | null>(null);

  const fieldProps: any = (field as any).props ?? {};

  const {
    description,
    previewSize = 24,
    dialogTitle = "Pick a Color",
    dialogDescription = "Select a color.",
    outputFormat = "hex",
    ...colorProps
  } = fieldProps;

  // Use current value (if any) or fallback for preview + picker initial value
  const storedValue = typeof value === "string" ? value : null;
  const previewColor = normalizeColor(storedValue);

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Save the color when dialog closes
      if (tempColor !== null) {
        onChange?.(tempColor);
        setTempColor(null);
      }
    }
    setDialogOpen(isOpen);
  };

  const handleSelectColor = () => {
    if (tempColor !== null) {
      onChange?.(tempColor);
    }
    setDialogOpen(false);
    setTempColor(null);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)} style={style}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Color Preview Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-max flex items-center gap-2 text-sm! px-2!"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
      >
        <span
          className="rounded-full border shrink-0"
          style={{
            width: previewSize,
            height: previewSize,
            backgroundColor: previewColor,
          }}
        />
        <span className="mt-0.5">{storedValue ?? previewColor}</span>
      </Button>

      {/* Error Message */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Color Picker Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        title={dialogTitle}
        description={dialogDescription}
        size="sm"
        trigger={null}
      >
        <div className="flex flex-col gap-4">
          <ColorPicker
            key={previewColor}
            defaultValue={previewColor}
            outputFormat={outputFormat}
            onChange={(newColor) => setTempColor(newColor)}
            {...colorProps}
          />

          {/* Select Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSelectColor}
              size="lg"
              className="w-full"
            >
              {t("colorPicker.selectColor")}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ColorPickerField;
