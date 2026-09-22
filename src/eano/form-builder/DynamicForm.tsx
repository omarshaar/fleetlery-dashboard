/**
 * @file DynamicForm.tsx (VALIDATION + SONNER + ERRORS VERSION + GRID NORMALIZATION)
 * @description Main form container with full validation and field-level error UI.
 */

"use client";
import "./styles.css";

import React, { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  loadForm,
  setFieldValue,
  setFormErrors,
  clearAllErrors,
} from "./core/formSlice";

import { saveForm, loadForm as loadStored, clearForm } from "./core/storage";
import { validateField } from "./core/validation";
import {
  DEFAULT_FORM_CONFIG,
  type FormConfig,
  type FormField,
  type FormRuntimeCtx,
} from "./types/form.types";

import { FieldRenderer } from "./FieldRenderer";
import { makeSelectFormValues } from "./core/selectors";

import { toast } from "sonner";

import { Toaster } from "@/components";
import { parseGrid } from "./core/parseGrid";

/* ========================================================================== */
/*                      NEW: normalize entire schema (recursive)              */
/* ========================================================================== */

function normalizeField(field: FormField): FormField {
  const normalizedGrid = parseGrid(field.grid);

  if (field.type === "container" && Array.isArray(field.children)) {
    return {
      ...field,
      grid: normalizedGrid,
      children: field.children.map((c) => normalizeField(c)),
    };
  }

  return { ...field, grid: normalizedGrid };
}

function normalizeSchema(schema: FormField[]): FormField[] {
  return schema.map((f) => normalizeField(f));
}

/* ========================================================================== */
/*                         Helper: Flatten Schema                              */
/* ========================================================================== */

function flattenSchema(schema: FormField[]): FormField[] {
  const result: FormField[] = [];

  const walk = (fields: FormField[]) => {
    for (const field of fields) {
      if (field.type === "container" && Array.isArray(field.children)) {
        walk(field.children);
      } else {
        result.push(field);
      }
    }
  };

  walk(schema);
  return result;
}

/* ========================================================================== */
/*                              Component Definition                           */
/* ========================================================================== */

interface DynamicFormProps {
  config: FormConfig;
  schema: FormField[];
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ config, schema }) => {
  const dispatch = useDispatch();
  const formId = config.formId;

  const persistence = config.persistence || DEFAULT_FORM_CONFIG.persistence;

  const initializedRef = useRef(false);

  /* ---------------------- Memoized Selector ---------------------- */
  const selectValues = React.useMemo(
    () => makeSelectFormValues(formId),
    [formId]
  );
  const values = useSelector(selectValues);

  /* ========================================================================== */
  /*                         NEW: Normalize Schema Here                         */
  /* ========================================================================== */

  const normalizedSchema = React.useMemo(
    () => normalizeSchema(schema),
    [schema]
  );

  /* ========================================================================== */
  /*                              Hydration                                     */
  /* ========================================================================== */

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const flatFields = flattenSchema(normalizedSchema);
    const finalValues: Record<string, any> = {};

    // Build initial values with defaults
    for (const f of flatFields) {
      if (!("name" in f)) continue;
      const name = f.name;

      // Restore from persistence if enabled, otherwise use defaults
      if (persistence.enabled) {
        const storedData = loadStored(formId, persistence.storage);
        finalValues[name] =
          storedData[name] ?? f.defaultValue ?? undefined;
      } else {
        finalValues[name] = f.defaultValue ?? undefined;
      }
    }

    dispatch(
      loadForm({
        formId,
        initialValues: finalValues,
        persistence: config.persistence,
      })
    );
  }, [dispatch, formId, persistence, normalizedSchema, config.persistence]);

  /* ========================================================================== */
  /*                             Runtime Context                                */
  /* ========================================================================== */

  const ctx: FormRuntimeCtx = {
    formId,
    dispatch,
    getState: () => values,
    getValue: (name: string) => values?.[name],
    setValue: (name: string, value: any) => {
      dispatch(setFieldValue({ formId, name, value }));
    },
    submit: () => handleSubmit(),
  };

  /* ========================================================================== */
  /*                             Auto Persistence                               */
  /* ========================================================================== */

  useEffect(() => {
    if (!initializedRef.current) return;

    if (persistence.enabled) {
      saveForm(formId, values, persistence.storage);
    }
  }, [values, formId, persistence]);

  /* ========================================================================== */
  /*                        Validation + Submit (UPDATED)                        */
  /* ========================================================================== */

  const handleSubmit = useCallback(async () => {
    const flatFields = flattenSchema(normalizedSchema);
    const allErrors: Record<string, string[]> = {};

    // 1) Validate all fields
    for (const field of flatFields) {
      if (!("name" in field)) continue;

      const errs = await validateField(field, values[field.name], ctx);
      if (errs.length) allErrors[field.name] = errs;
    }

    // 2) Has errors → Stop submit
    if (Object.keys(allErrors).length > 0) {
      dispatch(setFormErrors({ formId, errors: allErrors }));

      Object.entries(allErrors).forEach(([name, messages]) => {
        messages.forEach((msg) => {
          const field = flatFields.find((f) => "name" in f && f.name === name);
          const fieldLabel =
            field && "label" in field ? field.label : name;

          toast.error(fieldLabel, {
            description: msg,
          });
        });
      });

      return;
    }

    // 3) No errors → submit form
    dispatch(clearAllErrors({ formId }));

    if (typeof config.onSubmit === "function") {
      try {
        const submitted = await config.onSubmit({ values, ctx });
        if (submitted === false) return;
      } catch {
        toast.error("Form submission failed");
        return;
      }
    }

    if (persistence.enabled) {
      clearForm(formId, persistence.storage);
    }

    if (config.showSuccessToast !== false) {
      toast.success("Form submitted", {
        description: "All validations passed successfully.",
      });
    }
  }, [values, normalizedSchema, config, ctx, persistence]);

  /* ========================================================================== */
  /*                                   Render                                   */
  /* ========================================================================== */

  return (
    <>
      <Toaster />
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {normalizedSchema.map((field, index) => {
          const key =
            "name" in field ? field.name : `container-${index}`;
          return (
            <FieldRenderer
              key={key}
              field={field}
              formId={formId}
              ctx={ctx}
            />
          );
        })}
      </form>
    </>
  );
};
