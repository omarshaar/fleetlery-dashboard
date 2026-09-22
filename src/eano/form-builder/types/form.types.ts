/**
 * @file form.types.ts
 * @description Core TypeScript types for the Dynamic Form Builder system.
 */

import type * as React from "react"

/* ========================================================================== */
/*                              Top-level Config                               */
/* ========================================================================== */

export interface FormConfig {
  formId: string

  /** Set to false when the caller displays its own localized success message. */
  showSuccessToast?: boolean

  persistence?: {
    enabled: boolean
    storage: "session" | "local"
  }

  onSubmit?: (payload: {
    values: Record<string, any>
    ctx: FormRuntimeCtx
  }) => void | boolean | Promise<void | boolean>
}

/* ========================================================================== */
/*                                 Schema                                      */
/* ========================================================================== */

export type FormField = BuiltInField | CustomComponentField | ContainerField

/**
 * BaseField: shared by all value-based fields
 */
export interface BaseField {
  name: string

  label?: string
  placeholder?: string
  defaultValue?: any

  grid?: FieldGrid | string
  section?: string

  className?: string
  style?: React.CSSProperties

  props?: {
    text?: string
    variant?: string
    size?: string
    className?: string
    onAction?: FieldAction
    options?: RadioOption[]
    description?: string
    required?: boolean
    error?: string
    isLoading?: boolean // ← Button loading state

    // Date APIs
    placeholder?: string
    value?: Date
    defaultValue?: Date
    mode?: "single" | "multiple"
    minDate?: Date
    maxDate?: Date
    align?: "start" | "center" | "end"
    side?: "bottom" | "top" | "left" | "right"
    autoClose?: boolean
    onChange?: (date: Date | undefined) => void

    // Rich text
    height?: string
    editorOptions?: any

    [key: string]: any
  }

  /** ← Added correctly */
  events?: FieldEvents

  validation?: ValidationRule[] | string
  hidden?: boolean
  disabled?: boolean

  expand?: boolean
}

/**
 * ContainerField: layout only (no name, no events)
 */
export interface ContainerField {
  type: "container"
  grid?: FieldGrid | string
  innerGrid?: {
    cols?: number
    gap?: number | string
    rows?: string
    responsive?: Partial<
      Record<
        BreakpointKey,
        {
          cols?: number
          gap?: number | string
          rows?: string
        }
      >
    >
  }
  children: FormField[]
  className?: string
  style?: React.CSSProperties
}

/* ========================================================================== */
/*                         Built-in and Custom Fields                          */
/* ========================================================================== */

export interface BuiltInField extends BaseField {
  type:
    | "input"
    | "textarea"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "switch"
    | "date"
    | "datetime"
    | "time"
    | "file"
    | "image"
    | "password"
    | "email"
    | "url"
    | "gallery"
    | "avatar"
    | "button"
    | "richtext"
    | "slider"
    | "datepicker"
    | "timepicker"
    | "colorpicker"
    | "colorselect"

  options?: Array<{ label: string; value: any; disabled?: boolean }>
  loadOptions?: (
    ctx: LoadOptionsCtx
  ) => Promise<Array<{ label: string; value: any; disabled?: boolean }>>
}

export interface CustomComponentField extends BaseField {
  component: string
  type?: never
}

/* ========================================================================== */
/*                              Grid & Layout                                  */
/* ========================================================================== */

export interface FieldGrid {
  colSpan?: number
  rowSpan?: number
  order?: number
  responsive?: Partial<
    Record<
      BreakpointKey,
      Partial<Pick<FieldGrid, "colSpan" | "rowSpan" | "order">>
    >
  >
}

export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl"

/* ========================================================================== */
/*                               Validation                                    */
/* ========================================================================== */

export type ValidationRule =
  | { kind: "required"; message?: string }
  | { kind: "min"; value: number; message?: string }
  | { kind: "max"; value: number; message?: string }
  | { kind: "pattern"; regex: RegExp; message?: string }
  | { kind: "email"; message?: string }
  | { kind: "url"; message?: string }
  | {
      kind: "custom"
      validate: (
        value: any,
        ctx: FormRuntimeCtx,
        field: FormField
      ) => string | void | Promise<string | void>
    }

/* ========================================================================== */
/*                              Events & Runtime                               */
/* ========================================================================== */

export interface FieldEvents {
  onChange?: (payload: {
    name: string
    value: any
    prevValue: any
    ctx: FormRuntimeCtx
    field: FormField
  }) => void

  onClick?: (payload: {
    name: string
    value: any
    ctx: FormRuntimeCtx
    field: FormField
    event?: React.MouseEvent<any>
  }) => void

  onMount?: (payload: {
    name: string
    ctx: FormRuntimeCtx
    field: FormField
  }) => void

  onFocus?: (payload: {
    name: string
    value: any
    ctx: FormRuntimeCtx
    field: FormField
    event?: React.FocusEvent<any>
  }) => void

  onBlur?: (payload: {
    name: string
    value: any
    ctx: FormRuntimeCtx
    field: FormField
    event?: React.FocusEvent<any>
  }) => void

  [key: string]: any
}

export interface FormRuntimeCtx {
  formId: string
  dispatch: (action: any) => void
  getState: () => any
  getValue: (name: string) => any
  setValue: (name: string, value: any) => void
  submit: () => void
}

export interface LoadOptionsCtx {
  search?: string
  page?: number
  pageSize?: number
  ctx: FormRuntimeCtx
}

/* ========================================================================== */
/*                          Actions (e.g. Button.onAction)                     */
/* ========================================================================== */

export interface FieldActionPayload {
  values: Record<string, any>
  ctx: FormRuntimeCtx
}

export type FieldAction = (
  payload: FieldActionPayload
) => void | Promise<void>

/* ========================================================================== */
/*                          Field Component Props                              */
/* ========================================================================== */

export interface FieldComponentProps {
  name: string
  value: any

  onChange: (next: any) => void
  onBlur?: (e?: React.FocusEvent<any>) => void
  onFocus?: (e?: React.FocusEvent<any>) => void
  onClick?: (e?: React.MouseEvent<any>) => void

  disabled?: boolean
  placeholder?: string
  label?: string
  className?: string
  style?: React.CSSProperties

  error?: string
  required?: boolean
  description?: string

  field: FormField
  ctx: FormRuntimeCtx
}

/* ========================================================================== */
/*                         Defaults & Helpers                                  */
/* ========================================================================== */

export const DEFAULT_FORM_CONFIG: Required<
  Pick<FormConfig, "persistence">
> = {
  persistence: { enabled: false, storage: "session" },
}

export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}
