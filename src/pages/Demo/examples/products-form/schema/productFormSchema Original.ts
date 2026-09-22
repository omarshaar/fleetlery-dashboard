import type { FormField } from "@/eano/form-builder/types/form.types";


export const productFormSchema: FormField[] = [
  /* -----------------------------------------------------------
     LEFT SIDE → Gallery
  ----------------------------------------------------------- */
  {
    type: "gallery",
    name: "images",
    label: "Product Images",
    grid: "12 md:5",
  },

  /* -----------------------------------------------------------
     RIGHT SIDE → Container with 3 fields
  ----------------------------------------------------------- */
  {
    type: "container",
    grid: "12 md:7",
    innerGrid: {
      rows: "auto auto 1fr",
    },
    children: [
      {
        type: "input",
        name: "title",
        label: "Product Title",
        placeholder: "Enter product title",
        grid: "12",
        validation: "required|min:3",
        props: {
          description: "Enter the product title",
          required: true,
        },
      },

      {
        type: "input",
        name: "price",
        label: "Price ($)",
        placeholder: "Enter price",
        defaultValue: 0,
        grid: "12",
        validation: "required|min:1",
        props: {
          type: "number",
          required: true,
          description: "Set the product price in USD",
        },
      },

      {
        type: "textarea",
        name: "short_description",
        label: "Short Description",
        placeholder: "Enter short description",
        grid: "12",
        className: "h-full",
      },
    ],
  },

  /* -----------------------------------------------------------
     Full-width long description (outside container)
  ----------------------------------------------------------- */
  {
    type: "textarea",
    name: "description",
    label: "Full Description",
    placeholder: "Enter detailed description",
    grid: "12",
    props: {
      description: "Detailed product description for customers",
      required: true,
    },
    validation: "required",
  },

  {
    type: "checkbox",
    name: "is_active",
    label: "Active Product",
    grid: "12",
    props: {
      description: "Enable product visibility in the shop",
      required: true,
    },
    validation: "required",
  },

  {
    type: "radio",
    name: "product_status",
    label: "Product Status",
    grid: "12",
    props: {
      required: true,
      description: "Choose the visibility of this product",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Archived", value: "archived", disabled: true },
      ],
    },
    validation: "required",
  },

  {
    type: "switch",
    name: "is_featured",
    label: "Featured Product",
    grid: "12",
    props: {
      description: "Mark this product as featured",
      required: false,
    },
  },

  /* -----------------------------------------------------------
     Button (Action)
  ----------------------------------------------------------- */
  {
    type: "button",
    name: "save_button",
    label: "",
    grid: "12",

    props: {
      text: "Save Product",
      variant: "default",
      size: "lg",
      className: "mt-4",

      onAction: ({ values }) => {
        console.log("Saving...", values);
        alert("Saved!");
      },
    },
  },

  {
    type: "slider",
    name: "product_rating",
    label: "Rating",
    grid: "12 md:6",
    props: {
      description: "Choose a value between 0 and 100",
      required: false,
      min: 0,
      max: 1000,
      step: 1,
      orientation: "horizontal",
    },
  },

  {
    type: "select",
    name: "category",
    label: "Product Category",
    grid: "12",
    props: {
      placeholder: "Choose a category",
      required: true,
      description: "Select the category this product belongs to",
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Home & Kitchen", value: "home" },
        { label: "Books", value: "books" },
        { label: "Disabled Option", value: "xx", disabled: true },
      ],
    },
    validation: "required",
  },

  {
    type: "datepicker",
    name: "publish_date",
    label: "Publish Date",
    grid: "12 md:6",
    props: {
      required: true,
      description: "Choose a date to publish the product",
      placeholder: "Select a date",
      mode: "single",
      minDate: new Date("2020-01-01"),
      maxDate: new Date("2030-01-01"),
      align: "start",
      side: "bottom",
      autoClose: true,
    },
    validation: "required",
  },

  {
    type: "timepicker",
    name: "opening_time",
    label: "Opening Time",
    grid: "12 md:6",
    props: {
      placeholder: "Select time",
      description: "Choose when the store opens",
      required: true,
      step: 60,
      min: "08:00",
      max: "20:00",
    },
    validation: "required",
  },

  {
    type: "richtext",
    label: "Product Description",
    name: "product_description",
    grid: "12",
    props: {
      required: true,
      description: "Detailed product content",
      placeholder: "Write the full product description...",
      editorOptions: {
        minHeight: "100px",
        buttonList: [
          ["undo", "redo"],
          ["bold", "underline", "italic"],
          ["fontColor"],
          ["align", "list"],
          ["link"],
          ["codeView", "fullScreen"],
        ],
        clean: {
          removeEmptyTags: true,
        },
      },
    },
    validation: "required|min:30",
  },
];
