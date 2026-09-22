"use client"

import React from "react"
import { getGridClasses } from "../core/grid"
import { FieldRenderer } from "../FieldRenderer"
import type { ContainerField, FormRuntimeCtx } from "../types/form.types"

/**
 * Props for the ContainerWrapper component
 * @property {ContainerField} field - The container field configuration
 * @property {string} formId - Unique identifier for the form
 * @property {FormRuntimeCtx} ctx - Form runtime context
 */
interface Props {
  field: ContainerField
  formId: string
  ctx: FormRuntimeCtx
}

/**
 * ContainerWrapper component that renders a container field with inner grid layout.
 * 
 * This component handles:
 * - Outer grid positioning within parent container
 * - Inner grid layout for child fields
 * - Responsive grid configurations
 * - Automatic row sizing with last element expansion
 */
export const ContainerWrapper: React.FC<Props> = ({ field, formId, ctx }) => {
  /* ------------------------------------------------------------
   * 1) Grid classes for the container itself (in parent grid)
   * ------------------------------------------------------------ */
  const { className: outerGridClasses } = getGridClasses(
    typeof field.grid === 'object' ? field.grid : undefined
  )

  /* ------------------------------------------------------------
   * 2) Internal grid settings
   * ------------------------------------------------------------ */
  // Default: 12 columns with gap-4 spacing
  const cols = field.innerGrid?.cols ?? 12
  const gap = field.innerGrid?.gap ?? 4

  /**
   * Calculate grid rows template
   * Default: auto-sized rows except last one which expands (1fr)
   */
  const rows = field.innerGrid?.rows;

  // Build inner grid basic classes
  let innerGridClasses = `grid grid-cols-${cols} gap-${gap}`

  /* ------------------------------------------------------------
   * 3) Responsive inner grid
   * ------------------------------------------------------------ */
  // Apply responsive breakpoint classes if configured
  if (field.innerGrid?.responsive) {
    for (const [bp, cfg] of Object.entries(field.innerGrid.responsive)) {
      if (cfg.cols) innerGridClasses += ` ${bp}:grid-cols-${cfg.cols}`
      if (cfg.gap)  innerGridClasses += ` ${bp}:gap-${cfg.gap}`
    }
  }

  /* ------------------------------------------------------------
    * 4) Render container with inner grid and children
    * ------------------------------------------------------------ */
  return (
    <div
      className={`
        eano-form-builder-container w-full h-full bg-white dark:bg-black
        ${outerGridClasses} 
        ${innerGridClasses} 
        ${field.className || ""} 
      `}
      style={{
        ...field.style,
        gridTemplateRows: rows
      }}
    >
      {field.children.map((child, index) => (
        <FieldRenderer
          key={"name" in child ? child.name : `container-${index}`}
          field={child}
          formId={formId}
          ctx={ctx}
        />
      ))}
    </div>
  )
}

export default ContainerWrapper
