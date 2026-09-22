/**
 * @file events.ts
 * @description Centralized event executor for the Form Builder system.
 */

import type { FieldEvents, FormRuntimeCtx, FormField } from "../types/form.types"
import type * as React from "react"

/* ========================================================================== */
/*                               Type Guards                                   */
/* ========================================================================== */

/** Check if a field supports events (i.e., NOT a ContainerField). */
function hasEvents(field: FormField): field is FormField & { events?: FieldEvents } {
  return "name" in field
}

/** Check if a field has a name (i.e., NOT a ContainerField). */
function hasName(field: FormField): field is FormField & { name: string } {
  return "name" in field && typeof field.name === "string"
}

/* ========================================================================== */
/*                                Safe Executor                               */
/* ========================================================================== */

function safeRun<T extends (...args: any[]) => any>(
  fn: T | undefined,
  ...args: Parameters<T>
): void {
  try {
    if (typeof fn === "function") fn(...args)
  } catch {}
}

/* ========================================================================== */
/*                                Event Runner                                */
/* ========================================================================== */

export function triggerFieldEvent<K extends keyof FieldEvents>(
  field: FormField,
  eventName: K,
  payload: Parameters<NonNullable<FieldEvents[K]>>[0]
): void {
  if (!hasEvents(field)) return   // ← يمنع الخطأ 100%

  const handler = field.events?.[eventName]
  if (handler) safeRun(handler as any, payload)
}

/* ========================================================================== */
/*                             Convenience Helpers                             */
/* ========================================================================== */

export function handleOnChange(
  field: FormField,
  ctx: FormRuntimeCtx,
  name: string,
  value: any,
  prevValue: any
): void {
  triggerFieldEvent(field, "onChange", { name, value, prevValue, ctx, field })
}

export function handleOnClick(
  field: FormField,
  ctx: FormRuntimeCtx,
  name: string,
  value: any,
  event?: React.MouseEvent<any>
): void {
  triggerFieldEvent(field, "onClick", {
    name,
    value,
    ctx,
    field,
    event: event as React.MouseEvent<any> | undefined,
  })
}

export function handleOnMount(field: FormField, ctx: FormRuntimeCtx): void {
  if (!hasName(field)) return
  triggerFieldEvent(field, "onMount", { name: field.name, ctx, field })
}
