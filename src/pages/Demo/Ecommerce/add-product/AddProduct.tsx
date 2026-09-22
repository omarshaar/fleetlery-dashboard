/**
 * @file ProductFormPage.tsx
 * @description Example page for testing the DynamicForm system with product form schema.
 */

import { DynamicForm } from "@/eano/form-builder/DynamicForm";
import { productFormConfig } from "./schema/addProductConfig";
import { createProductFormSchema } from "./schema/addProductSchema";
import { PageHeader } from "@/components";
import { useLanguage } from "@/i18n/hooks";
import { Page } from "@/eano/components/page/Page";
import { useMemo } from "react";

export default function ProductFormPage() {
  const { t, language } = useLanguage();
  const schema = useMemo(() => createProductFormSchema(t), [t, language]);

  return (
    <Page>
      <PageHeader
        title={t("ecommerce.addProduct.pageTitle", {
          defaultValue: "Add New Product",
        })}
      />
      <div className="w-full md:w-3/4 m-auto">
        <DynamicForm config={productFormConfig} schema={schema} />
      </div>
    </Page>
  );
}
