# Example Form Schema

```typescript
import type { FormField } from "@/eano/form-builder/types/form.types";

const containerStyle = "rounded-md p-4 border dark:bg-[#161616] ";

export const productFormSchema: FormField[] = [
  {
    type: "container",
    grid: "12",
    className: `${containerStyle} p-0!`,
    children: [
      {
        type: "gallery",
        name: "images",
        grid: "12",
        className: "m-0!",
        props: {
          // forceAutoCrop: true,
          viewDirection: "horizontal",
        },
      },
    ],
  },
  {
    type: "container",
    grid: "12",
    className: "gap-y-0! bg-transparent!",
    children: [
      {
        type: "container",
        grid: "12",
        className: `${containerStyle} h-full m-0!`,
        innerGrid: { rows: "repeat(4, auto) 1fr" },
        children: [
          {
            type: "input",
            name: "title",
            label: "Product Title",
            placeholder: "Nike Air Jordan 1",
            grid: "12",
            validation: "required|min:3",
            props: {
              onChange: () => { console.log("Test"); }
            },
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
          {
            type: "colorpicker",
            name: "brand_color",
            label: "Brand Color",
            grid: "12 md:6",
            defaultValue: "rgba(59, 130, 246, 1)",
            props: {
              previewSize: 24,
              dialogTitle: "Select Brand Color",
              dialogDescription: "Pick your brand identity color",
            },
          },
          {
            type: "colorselect",
            name: "brand_color_preset",
            label: "Brand Color (Preset)",
            grid: "12 md:6",
            props: {
              description: "Choose one of the predefined brand colors",
              colors: [
                { value: "#3b82f6", label: "Primary Blue" },
                { value: "#0ea5e9", label: "Sky" },
                { value: "#22c55e", label: "Success" },
                { value: "#f97316", label: "Warning" },
                { value: "#ef4444", label: "Danger" },
              ],
            },
          },
          {
            type: "textarea",
            name: "short_description",
            label: "Short Description",
            grid: "12",
            className: "",
          },
        ],
      },
    ],
  },
  {
    type: "container",
    grid: "12",
    className: `${containerStyle} m-0!`,

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
  {
    type: "container",
    grid: "12",
    className: containerStyle,

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
  {
    type: "container",
    grid: "12",
    className: containerStyle,

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
  {
    type: "container",
    grid: "12",
    className: containerStyle,

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
        grid: "12 md:12",
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
  {
    type: "container",
    grid: "12",
    className: containerStyle,

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
  {
    type: "container",
    grid: "12",
    className: containerStyle,

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
  {
    type: "richtext",
    name: "description",
    label: "Full Description",
    grid: "12",
    validation: "required|min:30",
    props: {
      editorClassName: "soson",
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
  {
    type: "button",
    name: "save_button",
    grid: "12",
    className: "mt-6",
    props: {
      text: "Create Product",
      variant: "default",
      size: "lg",
      className: "m-0!",
      type: "submit",
      // isLoading: true,
    },
  },
];

```
