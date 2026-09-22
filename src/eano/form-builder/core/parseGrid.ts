/**
 * @file parseGrid.ts
 * @description Converts compact grid string formats (e.g. "12 md:6 sm:4")
 * into a valid FieldGrid object fully compatible with the Form Builder system.
 */

import type { FieldGrid, BreakpointKey } from "../types/form.types";

/**
 * Parses a grid configuration:
 *
 * Examples:
 *  - "12"
 *  - "12 md:6 sm:4"
 *  - { colSpan: 12, responsive: { md: { colSpan: 6 } } }
 *  - 6
 */
export function parseGrid(input?: any): FieldGrid {
  // Default: full width
  if (!input) return { colSpan: 12 };

  // Already valid Grid Object
  if (typeof input === "object" && input !== null) {
    return input as FieldGrid;
  }

  // Number → colSpan directly
  if (typeof input === "number") {
    return { colSpan: input };
  }

  // String format: "12 md:6 sm:4"
  if (typeof input === "string") {
    const tokens = input.trim().split(/\s+/);

    // Base colSpan (first token)
    const baseSpan = Number(tokens.shift());
    const result: FieldGrid = {
      colSpan: isNaN(baseSpan) ? 12 : baseSpan,
      responsive: {},
    };

    // Parse breakpoints
    for (const t of tokens) {
      const [bp, val] = t.split(":");
      const span = Number(val);

      if (!bp || isNaN(span)) continue;

      // Example:
      // md: { colSpan: 6 }
      result.responsive![bp as BreakpointKey] = { colSpan: span };
    }

    // Remove empty responsive object
    if (result.responsive && Object.keys(result.responsive).length === 0) {
      delete result.responsive;
    }

    return result;
  }

  // Fallback
  return { colSpan: 12 };
}
