/**
 * @file productFormConfig.ts
 * @description Example form configuration for testing the DynamicForm system.
 */

import type { FormConfig } from "@/eano/form-builder/types/form.types";

export const productFormConfig: FormConfig = {
  formId: "productFormExample",

  persistence: {
    enabled: true,
    storage: "session",
  },

  onSubmit: async ({ values }) => {
    console.log("✅ Form submitted successfully:", values);
  },
};
