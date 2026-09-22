/**
 * @file selectors.ts
 * @description Memoized selectors for Dynamic Form Builder values and errors.
 */

import { createSelector } from "@reduxjs/toolkit"

/* ========================================================================== */
/*                                Values Selector                              */
/* ========================================================================== */

/**
 * Returns all values of a form (memoized per formId)
 */
export const makeSelectFormValues = (formId: string) =>
  createSelector(
    (state: any) => state.formBuilder?.[formId]?.values,
    (values) => values || {}
  )

/* ========================================================================== */
/*                                Errors Selector                              */
/* ========================================================================== */

/**
 * Returns all errors of a form (memoized per formId)
 */
export const makeSelectFormErrors = (formId: string) =>
  createSelector(
    (state: any) => state.formBuilder?.[formId]?.meta?.errors,
    (errors) => errors || {}
  )

/**
 * Returns the error array of a specific field
 */
export const makeSelectFieldError = (formId: string, fieldName: string) =>
  createSelector(
    (state: any) =>
      state.formBuilder?.[formId]?.meta?.errors?.[fieldName] ?? null,
    (error) => error
  )
