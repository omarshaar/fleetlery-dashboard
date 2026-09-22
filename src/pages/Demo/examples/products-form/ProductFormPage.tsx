/**
 * @file ProductFormPage.tsx
 * @description Example page for testing the DynamicForm system with product form schema.
 */

import { DynamicForm } from "@/eano/form-builder/DynamicForm";
import { productFormConfig } from "./schema/productFormConfig";
import { productFormSchema } from "./schema/productFormSchema";

export default function ProductFormPage() {
  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">🧩 Product Form Example</h2>
      <div className="w-full md:w-3/4 m-auto">
        <DynamicForm config={productFormConfig} schema={productFormSchema} />
      </div>
    </div>
  );
}
