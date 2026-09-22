/**
 * @file formApi.ts
 * @description Simple, high-level helpers to programmatically fill DynamicForm values.
 *
 * Goal: provide a very easy and flexible API for developers
 * to set or fill values for any form and any field.
 */

import { store } from "@/store";
import { setFieldValue } from "./formSlice";

/** Shape of generic form values object */
export type FormValues = Record<string, any>;

/**
 * Fill multiple fields of a form at once.
 *
 * - `formId`  → the same id you use in FormConfig.formId
 * - `values`  → object of { fieldName: value }
 *
 * Example:
 *   fillFormValues("productForm", {
 *     title: "Test Product",
 *     price: 199,
 *     is_active: true,
 *   })
 */
export function fillFormValues(formId: string, values: FormValues): void {
  if (!values || typeof values !== "object") return;

  const dispatch = store.dispatch;

  Object.entries(values).forEach(([name, value]) => {
    dispatch(setFieldValue({ formId, name, value }));
  });
}

/**
 * Set a single field value programmatically.
 *
 * Example:
 *   setFormFieldValue("productForm", "title", "New title")
 */
export function setFormFieldValue(
  formId: string,
  name: string,
  value: any
): void {
  const dispatch = store.dispatch;
  dispatch(setFieldValue({ formId, name, value }));
}
