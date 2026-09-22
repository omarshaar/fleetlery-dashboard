import type { FormField } from "@/eano/form-builder/types/form.types";
import type { TFunction } from "i18next";

const containerStyle = "rounded-md p-4 border dark:bg-[#161616] ";

export function createAddPostFormSchema(t: TFunction): FormField[] {
  return [
    {
      type: "container",
      grid: "12",
      className: `${containerStyle}`,
      children: [
        {
          type: "avatar",
          name: "cover_image",
          label: t("cms.addPost.fields.coverImage.label"),
          grid: "12 md:3",
          validation: "required",
          props: {
            shape: "square",
            size: "180",
            // description: t("cms.addPost.fields.coverImage.description"),
            accept: ["image/png", "image/jpeg", "image/webp"],
            uploadMethods: ["file", "url"],
            required: true,
          },
        },
        {
          type: "container",
          grid: "12 md:9",
          className: containerStyle,
          innerGrid: { cols: 3 },
          children: [
            {
              type: "input",
              name: "title",
              label: t("cms.addPost.fields.title.label"),
              placeholder: t("cms.addPost.fields.title.placeholder"),
              grid: "12 md:8",
              validation: "required|min:3",
              props: { required: true },
            },
            {
              type: "input",
              name: "slug",
              label: t("cms.addPost.fields.slug.label"),
              placeholder: t("cms.addPost.fields.slug.placeholder"),
              grid: "12 md:4",
              validation: "required|min:3",
              props: {
                description: t("cms.addPost.fields.slug.description"),
                required: true,
              },
            },
            {
              type: "textarea",
              name: "excerpt",
              label: t("cms.addPost.fields.excerpt.label"),
              placeholder: t("cms.addPost.fields.excerpt.placeholder"),
              grid: "12",
              props: { rows: 3 },
              validation: "required|min:10",
            },
          ],
        },
      ],
    },



    {
      type: "container",
      grid: "12",
      className: containerStyle,
      innerGrid: { cols: 3 },
      children: [
        {
          type: "select",
          name: "category",
          label: t("cms.addPost.fields.category.label"),
          grid: "12 md:4",
          validation: "required",
          props: {
            placeholder: t("cms.addPost.fields.category.placeholder"),
            options: [
              {
                label: t("cms.addPost.fields.category.options.blog"),
                value: "blog",
              },
              {
                label: t("cms.addPost.fields.category.options.news"),
                value: "news",
              },
              {
                label: t("cms.addPost.fields.category.options.docs"),
                value: "docs",
              },
              {
                label: t("cms.addPost.fields.category.options.caseStudy"),
                value: "case",
              },
            ],
            required: true,
          },
        },
        {
          type: "radio",
          name: "status",
          label: t("cms.addPost.fields.status.label"),
          grid: "12 md:4",
          validation: "required",
          defaultValue: "draft",
          props: {
            options: [
              {
                label: t("cms.addPost.fields.status.options.draft"),
                value: "draft",
              },
              {
                label: t("cms.addPost.fields.status.options.published"),
                value: "published",
              },
            ],
            required: true,
          },
        },
        {
          type: "datepicker",
          name: "publish_date",
          label: t("cms.addPost.fields.publishDate.label"),
          grid: "12 md:4",
          validation: "required",
          props: {
            placeholder: t("cms.addPost.fields.publishDate.placeholder"),
            mode: "single",
            autoClose: true,
            required: true,
          },
        },
        {
          type: "input",
          name: "tags",
          label: t("cms.addPost.fields.tags.label"),
          placeholder: t("cms.addPost.fields.tags.placeholder"),
          grid: "12 md:8",
        },
        {
          type: "checkbox",
          name: "featured",
          label: t("cms.addPost.fields.featured.label"),
          grid: "12 md:4",
          defaultValue: false,
        },
      ],
    },

    {
      type: "richtext",
      name: "content",
      label: t("cms.addPost.fields.content.label"),
      grid: "12",
      validation: "required|min:30",
      props: {
        placeholder: t("cms.addPost.fields.content.placeholder"),
        editorOptions: {
          minHeight: "220px",
          buttonList: [["undo", "redo"], ["bold", "italic", "underline"], ["link"], ["list"]],
        },
        required: true,
      },
    },

    {
      type: "container",
      grid: "12",
      className: containerStyle,
      innerGrid: { cols: 3 },
      children: [
        {
          type: "input",
          name: "seo_title",
          label: t("cms.addPost.fields.seoTitle.label"),
          placeholder: t("cms.addPost.fields.seoTitle.placeholder"),
          grid: "12 md:6",
        },
        {
          type: "textarea",
          name: "seo_description",
          label: t("cms.addPost.fields.seoDescription.label"),
          placeholder: t("cms.addPost.fields.seoDescription.placeholder"),
          grid: "12 md:6",
          props: { rows: 3 },
        },
      ],
    },

    {
      type: "button",
      name: "submit",
      grid: "12",
      className: "mt-2",
      props: {
        text: t("cms.addPost.actions.submit"),
        type: "submit",
        variant: "default",
        size: "lg",
      },
    },
  ];
}
