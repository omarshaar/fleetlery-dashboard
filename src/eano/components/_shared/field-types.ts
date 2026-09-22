import type { ReactNode } from "react"

/**
 * Base props shared across all form-like components
 * (Input, Select, DatePicker, etc.)
 */
export type BaseFieldProps = {
  /** Visible label text shown above the field */
  label?: ReactNode
  /** Optional helper text shown below the field */
  description?: ReactNode
  /** Error message (overrides description when present) */
  error?: ReactNode
  /** Marks the field as required (adds asterisk + aria-required) */
  required?: boolean
  /** Disables the field */
  disabled?: boolean
  /** Unique element ID for label association */
  id?: string
  /** Optional extra CSS classes for the wrapper */
  className?: string
}
