/**
 * @file grid.ts
 * @description Grid & layout helpers for the Dynamic Form Builder system.
 * Converts FieldGrid configuration into responsive Tailwind-compatible classes.
 */

import type React from "react"
import type { FieldGrid, BreakpointKey } from "../types/form.types"

/* ========================================================================== */
/*                               Default Settings                              */
/* ========================================================================== */

/** Default grid system settings (12-column layout). */
export const DEFAULT_GRID_COLUMNS = 12

/**
 * Predefined Tailwind classes for col-span (base / xs).
 * Having them as string literals ensures Tailwind can pick them up.
 */
const COL_SPAN_BASE: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
}

/**
 * Predefined Tailwind classes for responsive col-span.
 * Keys are breakpoint keys (xs, sm, md, lg, xl).
 */
const COL_SPAN_RESPONSIVE: Record<BreakpointKey, Record<number, string>> = {
  xs: {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  },
  sm: {
    1: "sm:col-span-1",
    2: "sm:col-span-2",
    3: "sm:col-span-3",
    4: "sm:col-span-4",
    5: "sm:col-span-5",
    6: "sm:col-span-6",
    7: "sm:col-span-7",
    8: "sm:col-span-8",
    9: "sm:col-span-9",
    10: "sm:col-span-10",
    11: "sm:col-span-11",
    12: "sm:col-span-12",
  },
  md: {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  },
  lg: {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
    6: "lg:col-span-6",
    7: "lg:col-span-7",
    8: "lg:col-span-8",
    9: "lg:col-span-9",
    10: "lg:col-span-10",
    11: "lg:col-span-11",
    12: "lg:col-span-12",
  },
  xl: {
    1: "xl:col-span-1",
    2: "xl:col-span-2",
    3: "xl:col-span-3",
    4: "xl:col-span-4",
    5: "xl:col-span-5",
    6: "xl:col-span-6",
    7: "xl:col-span-7",
    8: "xl:col-span-8",
    9: "xl:col-span-9",
    10: "xl:col-span-10",
    11: "xl:col-span-11",
    12: "xl:col-span-12",
  },
}

/**
 * Predefined Tailwind classes for row-span (base).
 * Adjust the max rowSpan range if needed.
 */
const ROW_SPAN_BASE: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
}

/**
 * Predefined Tailwind classes for responsive row-span.
 */
const ROW_SPAN_RESPONSIVE: Record<BreakpointKey, Record<number, string>> = {
  xs: {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
    5: "row-span-5",
    6: "row-span-6",
  },
  sm: {
    1: "sm:row-span-1",
    2: "sm:row-span-2",
    3: "sm:row-span-3",
    4: "sm:row-span-4",
    5: "sm:row-span-5",
    6: "sm:row-span-6",
  },
  md: {
    1: "md:row-span-1",
    2: "md:row-span-2",
    3: "md:row-span-3",
    4: "md:row-span-4",
    5: "md:row-span-5",
    6: "md:row-span-6",
  },
  lg: {
    1: "lg:row-span-1",
    2: "lg:row-span-2",
    3: "lg:row-span-3",
    4: "lg:row-span-4",
    5: "lg:row-span-5",
    6: "lg:row-span-6",
  },
  xl: {
    1: "xl:row-span-1",
    2: "xl:row-span-2",
    3: "xl:row-span-3",
    4: "xl:row-span-4",
    5: "xl:row-span-5",
    6: "xl:row-span-6",
  },
}

/**
 * Predefined Tailwind classes for order.
 * If you need higher orders, extend this map.
 */
const ORDER_CLASSES: Record<number, string> = {
  0: "order-0",
  1: "order-1",
  2: "order-2",
  3: "order-3",
  4: "order-4",
  5: "order-5",
  6: "order-6",
  7: "order-7",
  8: "order-8",
  9: "order-9",
  10: "order-10",
  11: "order-11",
  12: "order-12",
}

/* ========================================================================== */
/*                               Core Function                                 */
/* ========================================================================== */

/**
 * Converts a FieldGrid config into CSS class names or inline style values.
 * @param grid - The grid configuration from FormField.grid
 * @param totalColumns - Total columns in the parent grid container (default 12)
 * @returns Object containing both `className` and `style`
 *
 * @example
 * const { className } = getGridClasses({ colSpan: 6, responsive: { md: { colSpan: 4 } } });
 * // returns: "col-span-6 md:col-span-4"
 */
export function getGridClasses(
  grid?: FieldGrid,
  totalColumns: number = DEFAULT_GRID_COLUMNS
): { className: string; style?: React.CSSProperties } {
  if (!grid) return { className: "" }

  const classes: string[] = []

  // Base colSpan (xs / default)
  if (grid.colSpan) {
    const span = clamp(grid.colSpan, 1, totalColumns)
    const baseClass = COL_SPAN_BASE[span]
    if (baseClass) classes.push(baseClass)
  }

  // Base rowSpan
  if (grid.rowSpan) {
    const span = Math.max(1, grid.rowSpan)
    const baseClass = ROW_SPAN_BASE[span]
    if (baseClass) classes.push(baseClass)
  }

  // Responsive spans
  if (grid.responsive) {
    Object.entries(grid.responsive).forEach(([bpKey, settings]) => {
      const bp = bpKey as BreakpointKey

      if (settings.colSpan) {
        const span = clamp(settings.colSpan, 1, totalColumns)
        const map = COL_SPAN_RESPONSIVE[bp]
        const cls = map?.[span]
        if (cls) classes.push(cls)
      }

      if (settings.rowSpan) {
        const span = Math.max(1, settings.rowSpan)
        const map = ROW_SPAN_RESPONSIVE[bp]
        const cls = map?.[span]
        if (cls) classes.push(cls)
      }
    })
  }

  // Optional order
  if (grid.order !== undefined) {
    const orderCls = ORDER_CLASSES[grid.order]
    if (orderCls) classes.push(orderCls)
  }

  return { className: classes.join(" ") }
}

/* ========================================================================== */
/*                                Utilities                                    */
/* ========================================================================== */

/**
 * Clamp a number between min and max.
 */
function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(num, max))
}
