import type { FormField } from "@/eano/form-builder/types/form.types";

export const productFormSchema : FormField[] = [
  /* ===========================
      PRODUCT MEDIA (LEFT)
  ============================ */
  {
    type: "gallery",
    name: "images",
    label: "Product Images",
    grid: "12 md:5",
  },

  /* ===========================
      MAIN PRODUCT INFO (RIGHT)
  ============================ */
  {
    type: "container",
    grid: "12 md:7",

    children: [
      {
        type: "input",
        name: "title",
        label: "Product Title",
        placeholder: "Nike Air Jordan 1",
        grid: "12",
        validation: "required|min:3",
      },
      {
        type: "input",
        name: "subtitle",
        label: "Subtitle",
        placeholder: "Premium High-Top Sneakers",
        grid: "12",
      },
      {
        type: "input",
        name: "slug",
        label: "Slug",
        placeholder: "auto-generated if empty",
        grid: "12",
        props: {
          description: "URL friendly product identifier",
        },
      },
    ],
  },

  /* ===========================
      PRODUCT DETAILS SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: "mt-6 p-4 rounded-lg border bg-card",

    innerGrid: { cols: 3 },

    children: [
      {
        type: "input",
        name: "sku",
        label: "SKU",
        grid: "12 md:4",
        placeholder: "SKU-2025-001",
      },
      {
        type: "input",
        name: "brand",
        label: "Brand",
        grid: "12 md:4",
        placeholder: "Nike, Adidas...",
      },
      {
        type: "select",
        name: "category",
        label: "Category",
        grid: "12 md:4",
        props: {
          placeholder: "Choose category",
          options: [
            { label: "Shoes", value: "shoes" },
            { label: "Clothing", value: "clothing" },
            { label: "Accessories", value: "accessories" },
            { label: "Limited Edition", value: "limited" },
          ],
        },
        validation: "required",
      },
    ],
  },

  /* ===========================
      PRICING SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: "mt-6 p-4 rounded-lg border bg-card",

    innerGrid: { cols: 3 },

    children: [
      {
        type: "input",
        name: "price",
        label: "Base Price",
        placeholder: "199",
        grid: "12 md:4",
        props: { type: "number" },
        validation: "required|min:1",
      },
      {
        type: "input",
        name: "compare_price",
        label: "Compare Price",
        placeholder: "249",
        grid: "12 md:4",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "cost_price",
        label: "Cost Price",
        placeholder: "120",
        grid: "12 md:4",
        props: { type: "number" },
      },

      {
        type: "slider",
        name: "discount",
        label: "Discount (%)",
        grid: "12",
        props: { min: 0, max: 80, step: 1 },
      },
    ],
  },

  /* ===========================
      INVENTORY SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: "mt-6 p-4 rounded-lg border bg-card",

    innerGrid: { cols: 3 },

    children: [
      {
        type: "input",
        name: "stock",
        label: "Stock Quantity",
        placeholder: "100",
        grid: "12 md:4",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "barcode",
        label: "Barcode",
        grid: "12 md:4",
        placeholder: "EAN-13",
      },
      {
        type: "select",
        name: "warehouse",
        label: "Warehouse",
        grid: "12 md:4",
        props: {
          placeholder: "Select warehouse",
          options: [
            { label: "Main Warehouse", value: "main" },
            { label: "Berlin Store", value: "berlin" },
            { label: "Cologne Branch", value: "cologne" },
          ],
        },
      },

      {
        type: "checkbox",
        name: "track_inventory",
        label: "Track Inventory",
        grid: "12 md:4",
      },
      {
        type: "checkbox",
        name: "allow_out_of_stock",
        label: "Allow Out-of-Stock Orders",
        grid: "12 md:4",
      },
    ],
  },

  /* ===========================
      SHIPPING SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: "mt-6 p-4 rounded-lg border bg-card",

    innerGrid: { cols: 4 },

    children: [
      {
        type: "input",
        name: "weight",
        label: "Weight (kg)",
        grid: "12 md:3",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "length",
        label: "Length (cm)",
        grid: "12 md:3",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "width",
        label: "Width (cm)",
        grid: "12 md:3",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "height",
        label: "Height (cm)",
        grid: "12 md:3",
        props: { type: "number" },
      },

      {
        type: "select",
        name: "shipping_class",
        label: "Shipping Class",
        grid: "12",
        props: {
          placeholder: "Choose class",
          options: [
            { label: "Standard", value: "standard" },
            { label: "Express", value: "express" },
            { label: "Oversize", value: "oversize" },
          ],
        },
      },
    ],
  },

  /* ===========================
      SEO SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: "mt-6 p-4 rounded-lg border bg-card",

    innerGrid: { rows: "auto auto auto" },

    children: [
      {
        type: "input",
        name: "meta_title",
        label: "Meta Title",
        grid: "12",
      },
      {
        type: "textarea",
        name: "meta_description",
        label: "Meta Description",
        grid: "12",
      },
      {
        type: "input",
        name: "meta_keywords",
        label: "Meta Keywords",
        placeholder: "keyword1, keyword2, keyword3",
        grid: "12",
      },
    ],
  },

  /* ===========================
      AVAILABILITY SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: "mt-6 p-4 rounded-lg border bg-card",

    innerGrid: { cols: 3 },

    children: [
      {
        type: "checkbox",
        name: "is_active",
        label: "Active Product",
        grid: "12 md:4",
        validation: "required",
      },
      {
        type: "radio",
        name: "product_status",
        label: "Product Status",
        grid: "12 md:4",
        props: {
          options: [
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived", disabled: true },
          ],
        },
        validation: "required",
      },
      {
        type: "datepicker",
        name: "publish_date",
        label: "Publish Date",
        grid: "12 md:4",
        props: {
          placeholder: "Select date",
          mode: "single",
          minDate: new Date("2020-01-01"),
          maxDate: new Date("2030-01-01"),
          align: "start",
          side: "bottom",
          autoClose: true,
        },
        validation: "required",
      },
    ],
  },

  /* ===========================
      PRODUCT CONTENT
  ============================ */
  {
    type: "textarea",
    name: "short_description",
    label: "Short Description",
    grid: "12",
    className: "mt-6",
  },

  {
    type: "richtext",
    name: "description",
    label: "Full Description",
    grid: "12",
    validation: "required|min:30",
    props: {
      placeholder: "Write full product content…",
      editorOptions: {
        minHeight: "150px",
        buttonList: [
          ["undo", "redo"],
          ["bold", "underline", "italic"],
          ["fontColor"],
          ["align", "list"],
          ["link"],
          ["codeView", "fullScreen"],
        ],
        clean: { removeEmptyTags: true },
      },
    },
  },

  /* ===========================
      FINAL BUTTON
  ============================ */
  {
    type: "button",
    name: "save_button",
    grid: "12",
    props: {
      text: "Create Product",
      variant: "default",
      size: "lg",
      className: "mt-8",
      onAction: ({ values }) => {
        console.log("Saving product...", values);
        alert("Product Created!");
      },
    },
  },
];
