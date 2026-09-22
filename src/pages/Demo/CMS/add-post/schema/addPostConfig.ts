import type { FormConfig } from "@/eano/form-builder/types/form.types";

export const addPostFormConfig: FormConfig = {
  formId: "add-post-form",

  persistence: {
    enabled: true,
    storage: "session",
  },

  onSubmit: async ({ values }) => {
    console.log("✅ Post form submitted:", values);
  },
};
