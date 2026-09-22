/**
 * @file FieldRenderer.tsx (Validation-Ready Version with Error Support + GRID FIX)
 */

"use client"

import React, { Suspense, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  selectFieldValue,
  selectFieldError,
  setFieldValue,
  clearFieldError,
} from "./core/formSlice"

import { getGridClasses } from "./core/grid"
import { handleOnChange, handleOnMount } from "./core/events"

import type {
  FormField,
  FormRuntimeCtx,
  FieldComponentProps,
  ContainerField,
  FieldGrid,
} from "./types/form.types"

import ContainerWrapper from "./form-fields/ContainerField"

/* ========================================================================== */
/*                        Auto-load components                                 */
/* ========================================================================== */

const modules = import.meta.glob("./form-fields/*.tsx", { eager: true })

const autoComponentMap: Record<string, React.FC<FieldComponentProps>> = {}

for (const path in modules) {
  const mod = modules[path] as any
  const file = path.split("/").pop()!.replace(".tsx", "")
  const type = file.replace("Field", "").toLowerCase()
  autoComponentMap[type] = mod.default || mod[file]
}

/* ========================================================================== */
/*                           Fallback Component                                */
/* ========================================================================== */

const fallbackComponent: React.FC<FieldComponentProps> = ({ name }) => (
  <div className="text-red-500 text-sm p-2 border border-red-300 rounded bg-red-50">
    ⚠ Unknown field type: <strong>{name}</strong>
  </div>
)

/* ========================================================================== */
/*                           Main Component                                    */
/* ========================================================================== */

function FieldRendererBase({
  field,
  formId,
  ctx,
}: {
  field: FormField
  formId: string
  ctx: FormRuntimeCtx
}) {
  const dispatch = useDispatch()

  /* ======================= 1) Container handling ========================== */
  if (field.type === "container") {
    const container = field as ContainerField

    // ⭐ FIX: normalize grid typing
    const gridObj = container.grid as unknown as FieldGrid
    const { className: gridClasses } = getGridClasses(gridObj)

    return (
      <div className={`w-full ${gridClasses}`}>
        <ContainerWrapper field={container} formId={formId} ctx={ctx} />
      </div>
    )
  }

  /* ======================= 2) Normal fields ========================== */

  const value = useSelector((state: any) =>
    selectFieldValue(state, formId, field.name)
  )

  const error = useSelector((state: any) =>
    selectFieldError(state, formId, field.name)
  )

  const Component = resolveComponent(field)

  // ⭐ FIX: normalize grid typing
  const gridObj = field.grid as unknown as FieldGrid
  const { className: gridClasses } = getGridClasses(gridObj)

  useEffect(() => {
    handleOnMount(field, ctx)
  }, [])

  if (field.hidden) return null

  const handleChange = (newValue: any) => {
    const prevValue = value

    if (error) {
      dispatch(clearFieldError({ formId, name: field.name }))
    }

    dispatch(setFieldValue({ formId, name: field.name, value: newValue }))
    handleOnChange(field, ctx, field.name, newValue, prevValue)
  }

  const handleFocus = (e?: React.FocusEvent) => {
    if (!e) return
    field.events?.onFocus?.({
      name: field.name,
      value,
      ctx,
      field,
      event: e,
    })
  }

  const handleBlur = (e?: React.FocusEvent) => {
    if (!e) return
    field.events?.onBlur?.({
      name: field.name,
      value,
      ctx,
      field,
      event: e,
    })
  }

  /* ======================= 3) Build Component Props ====================== */

  const isRequired = (() => {
    if (!field.validation) return false
    
    // If validation is a string (e.g., "required|min:3")
    if (typeof field.validation === "string") {
      return field.validation.includes("required")
    }
    
    // If validation is an array of ValidationRule objects
    if (Array.isArray(field.validation)) {
      return field.validation.some((r) => r.kind === "required")
    }
    
    return false
  })()

  const props: FieldComponentProps = {
    name: field.name,
    value: value,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    disabled: field.disabled,
    placeholder: field.placeholder,
    label: field.label,
    className: field.className || "",
    style: field.style,
    error: error ? error[0] : undefined,
    field,
    ctx,
    required: isRequired,
  }

  /* ======================= 4) Render ========================== */

  return (
    <div className={`w-full ${gridClasses}`}>
      <Suspense fallback={<div>Loading...</div>}>
        {/*
          NOTE:
          We intentionally do NOT spread field.props directly here.
          All schema-level props should be consumed via `field.props`
          inside each concrete Field component (InputField, SelectField, ...),
          so that core handlers like onChange/onBlur/onFocus cannot be
          accidentally overridden at this layer.
        */}
        <Component {...props} />
      </Suspense>
    </div>
  )
}

/* ========================================================================== */
/*                       React.memo — core optimization                        */
/* ========================================================================== */

export const FieldRenderer = React.memo(
  FieldRendererBase,
  (prev, next) => {
    const prevField = prev.field
    const nextField = next.field

    if (prevField.type === "container" || nextField.type === "container") {
      return prevField === nextField
    }

    if (prevField.name !== nextField.name) return false

    // Re-render if the field definition changed (e.g., language switch updates label/placeholder).
    // Without this, translated schema updates won't show until a full page reload.
    if (prevField !== nextField) return false

    const prevValue = prev.ctx.getValue(prevField.name)
    const nextValue = next.ctx.getValue(nextField.name)

    const prevError = prev.ctx.getState()?.meta?.errors?.[prevField.name]
    const nextError = next.ctx.getState()?.meta?.errors?.[nextField.name]

    if (prevError !== nextError) return false
    if (prevValue !== nextValue) return false

    return true
  }
)

/* ========================================================================== */
/*                           Component Resolver                                */
/* ========================================================================== */

function resolveComponent(field: FormField): React.FC<FieldComponentProps> {
  if ("component" in field && field.component) {
    const key = field.component.toLowerCase()
    return autoComponentMap[key] || fallbackComponent
  }

  const type = (field as any).type?.toLowerCase() || ""
  return autoComponentMap[type] || fallbackComponent
}
