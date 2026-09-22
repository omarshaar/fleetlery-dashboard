import { useMemo } from "react";
import { DynamicForm } from "@/eano/form-builder/DynamicForm";
import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";
import { useLanguage } from "@/i18n/hooks";

import { addPostFormConfig } from "./schema/addPostConfig";
import { createAddPostFormSchema } from "./schema/addPostSchema";

export default function AddPostPage() {
  const { t, language } = useLanguage();

  const schema = useMemo(() => createAddPostFormSchema(t), [t, language]);

  return (
    <Page>
      <PageHeader
        title={t("cms.addPost.pageTitle")}
        subtitle={t("cms.addPost.pageSubtitle")}
      />

      <div className="w-full lg:w-3/4 2xl:w-2/3 mx-auto mt-4">
        <DynamicForm config={addPostFormConfig} schema={schema} />
      </div>
    </Page>
  );
}
