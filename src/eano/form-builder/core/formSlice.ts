/**
 * @file formSlice.ts (VALIDATION + ERROR SYSTEM VERSION)
 * @description Full persistence-safe implementation + Field-level error handling
 */

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

/* ========================================================================== */
/*                                 Types                                       */
/* ========================================================================== */

export interface SingleFormState {
  values: Record<string, any>
  meta: {
    errors: Record<string, string[]>   // ⬅️ NEW: field errors
    persistence?: {
      enabled: boolean
      storage: "session" | "local"
    }
    [key: string]: any
  }
}

export interface FormBuilderState {
  [formId: string]: SingleFormState
}

interface UpdateFieldPayload {
  formId: string
  name: string
  value: any
}

interface LoadFormPayload {
  formId: string
  initialValues?: Record<string, any>
  /** Optional per-form persistence settings (when omitted, legacy persistence behavior applies). */
  persistence?: {
    enabled: boolean
    storage: "session" | "local"
  }
}

interface SetFormErrorsPayload {
  formId: string
  errors: Record<string, string[]>
}

/* ========================================================================== */
/*                      Persistence Helpers (NEW + FIXED)                      */
/* ========================================================================== */

type StorageType = "session" | "local"

function loadPersistedForm(
  formId: string,
  storage: StorageType
): Record<string, any> {
  try {
    const raw =
      storage === "local"
        ? localStorage.getItem(`form_${formId}`)
        : sessionStorage.getItem(`form_${formId}`)
    if (!raw) return {}
    const parsed = JSON.parse(raw)

    // Backward compat:
    // - older slice used { values: Record<string, any> }
    // - current storage.ts stores raw Record<string, any>
    if (parsed && typeof parsed === "object" && "values" in parsed) {
      return (parsed as any).values ?? {}
    }

    return parsed ?? {}
  } catch {
    return {}
  }
}

function savePersistedForm(
  formId: string,
  values: Record<string, any>,
  storage: StorageType
) {
  try {
    const payload = JSON.stringify(values)
    if (storage === "local") {
      localStorage.setItem(`form_${formId}`, payload)
    } else {
      sessionStorage.setItem(`form_${formId}`, payload)
    }
  } catch {}
}

function clearPersistedForm(formId: string, storage: StorageType) {
  try {
    if (storage === "local") {
      localStorage.removeItem(`form_${formId}`)
    } else {
      sessionStorage.removeItem(`form_${formId}`)
    }
  } catch {}
}

/* ========================================================================== */
/*                                 Initial State                               */
/* ========================================================================== */

const initialState: FormBuilderState = {}

/* ========================================================================== */
/*                                 Slice Logic                                 */
/* ========================================================================== */

export const formSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {

    /**
     * Create or load a form.
     * - Merge persisted values BEFORE applying initialValues
     */
    loadForm: (state, action: PayloadAction<LoadFormPayload>) => {
      const { formId, initialValues = {}, persistence } = action.payload

      // Default behavior (when not provided): NO persistence (opt-in only).
      const effectivePersistence =
        persistence ?? ({ enabled: false, storage: "session" } as const)

      const persistedValues = effectivePersistence.enabled
        ? loadPersistedForm(formId, effectivePersistence.storage)
        : {}

      const merged = {
        ...initialValues,
        ...persistedValues, // persisted wins
      }

      state[formId] = {
        values: merged,
        meta: { errors: {}, persistence: effectivePersistence },
      }
    },

    /**
     * Update a single field value.
     * Automatically saves to sessionStorage.
     * Also clears the field-specific error (if exists).
     */
    setFieldValue: (state, action: PayloadAction<UpdateFieldPayload>) => {
      const { formId, name, value } = action.payload

      if (!state[formId]) {
        state[formId] = {
          values: {},
          meta: { errors: {}, persistence: { enabled: false, storage: "session" } },
        }
      }

      state[formId].values[name] = value

      // clear error for this field after update
      if (state[formId].meta.errors[name]) {
        delete state[formId].meta.errors[name]
      }

      const persistence =
        state[formId].meta.persistence ?? ({ enabled: false, storage: "session" } as const)

      if (persistence.enabled) {
        savePersistedForm(formId, state[formId].values, persistence.storage)
      }
    },

    /**
     * Set all validation errors after submit
     */
    setFormErrors: (state, action: PayloadAction<SetFormErrorsPayload>) => {
      const { formId, errors } = action.payload
      if (!state[formId]) return
      state[formId].meta.errors = errors
    },

    /**
     * Clear error for a single field
     */
    clearFieldError: (
      state,
      action: PayloadAction<{ formId: string; name: string }>
    ) => {
      const { formId, name } = action.payload
      if (!state[formId]) return
      delete state[formId].meta.errors[name]
    },

    /**
     * Clear all field errors
     */
    clearAllErrors: (state, action: PayloadAction<{ formId: string }>) => {
      const { formId } = action.payload
      if (!state[formId]) return
      state[formId].meta.errors = {}
    },

    /**
     * Reset form completely
     */
    resetForm: (state, action: PayloadAction<{ formId: string }>) => {
      const { formId } = action.payload
      if (state[formId]) {
        state[formId].values = {}
        state[formId].meta = {
          errors: {},
          persistence: state[formId].meta.persistence,
        }
      }

      clearPersistedForm(formId, "session")
      clearPersistedForm(formId, "local")
    },

    /**
     * Remove form
     */
    removeForm: (state, action: PayloadAction<{ formId: string }>) => {
      const { formId } = action.payload
      delete state[formId]

      clearPersistedForm(formId, "session")
      clearPersistedForm(formId, "local")
    },
  },
})

/* ========================================================================== */
/*                                    Getters                                  */
/* ========================================================================== */

export const selectFormValues = (state: any, formId: string) =>
  state.formBuilder?.[formId]?.values ?? {}

export const selectFieldValue = (state: any, formId: string, name: string) =>
  state.formBuilder?.[formId]?.values?.[name]

export const selectFieldError = (state: any, formId: string, name: string) =>
  state.formBuilder?.[formId]?.meta?.errors?.[name] ?? null

/* ========================================================================== */
/*                                 Exports                                     */
/* ========================================================================== */

export const {
  loadForm,
  setFieldValue,
  resetForm,
  removeForm,
  setFormErrors,
  clearFieldError,
  clearAllErrors,
} = formSlice.actions

export default formSlice.reducer