/**
 * @file TextField.tsx
 * @description Controlled + local-state hybrid input to keep typing responsive
 */

import React, { useEffect, useState } from "react";
import type { FieldComponentProps } from "@/eano/form-builder/types/form.types";

export const TextField: React.FC<FieldComponentProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  onClick,
  disabled,
  placeholder,
  label,
  className,
  style,
  field,
}) => {
  const inputType = field.type === "number" ? "number" : "text";

  // ✅ local mirror of the Redux value
  const [localValue, setLocalValue] = useState<any>("");

  // keep local value synced with Redux when external value changes
  useEffect(() => {
    setLocalValue(
      value === null || value === undefined || Number.isNaN(value) ? "" : value
    );
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal: any = e.target.value;
    if (inputType === "number") {
      newVal = e.target.value === "" ? "" : Number(e.target.value);
    }

    // update local UI immediately
    setLocalValue(newVal);
    // dispatch to Redux
    onChange(newVal);
  };

  return (
    <div className={`flex flex-col ${className || ""}`} style={style}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={inputType}
        disabled={disabled}
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
};
