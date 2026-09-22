import type { FormField } from "@/eano/form-builder/types/form.types";
import type { TFunction } from "i18next";

const containerStyle = "rounded-md p-4 border dark:bg-[#161616] ";

export function createProductFormSchema(t: TFunction): FormField[] {
  return [
  /* ===========================
      PRODUCT MEDIA (Right)
  ============================ */
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
          forceAutoCrop: true,
          viewDirection: { base: "vertical", md: "horizontal" },
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
            label: t("ecommerce.addProduct.fields.title.label", { defaultValue: "Product Title" }),
            placeholder: t("ecommerce.addProduct.fields.title.placeholder", { defaultValue: "Nike Air Jordan 1" }),
            grid: "12",
            validation: "required|min:3",
            props: {
              onChange: () => { console.log("Test"); }
            },
          },
          {
            type: "input",
            name: "subtitle",
            label: t("ecommerce.addProduct.fields.subtitle.label", { defaultValue: "Subtitle" }),
            placeholder: t("ecommerce.addProduct.fields.subtitle.placeholder", { defaultValue: "Premium High-Top Sneakers" }),
            grid: "12",
          },
          {
            type: "input",
            name: "slug",
            label: t("ecommerce.addProduct.fields.slug.label", { defaultValue: "Slug" }),
            placeholder: t("ecommerce.addProduct.fields.slug.placeholder", { defaultValue: "auto-generated if empty" }),
            grid: "12",
            props: {
              description: t("ecommerce.addProduct.fields.slug.description", { defaultValue: "URL friendly product identifier" }),
            },
          },
          {
            type: "colorpicker",
            name: "brand_color",
            label: t("ecommerce.addProduct.fields.brandColor.label", { defaultValue: "Brand Color" }),
            grid: "12 md:6",
            defaultValue: "rgba(59, 130, 246, 1)",
            props: {
              previewSize: 24,
              dialogTitle: t("ecommerce.addProduct.fields.brandColor.dialogTitle", { defaultValue: "Select Brand Color" }),
              dialogDescription: t("ecommerce.addProduct.fields.brandColor.dialogDescription", { defaultValue: "Pick your brand identity color" }),
            },
          },
          {
            type: "colorselect",
            name: "brand_color_preset",
            label: t("ecommerce.addProduct.fields.brandColorPreset.label", { defaultValue: "Brand Color (Preset)" }),
            grid: "12 md:6",
            props: {
              description: t("ecommerce.addProduct.fields.brandColorPreset.description", { defaultValue: "Choose one of the predefined brand colors" }),
              colors: [
                { value: "#3b82f6", label: t("ecommerce.addProduct.fields.brandColorPreset.colors.primaryBlue", { defaultValue: "Primary Blue" }) },
                { value: "#0ea5e9", label: t("ecommerce.addProduct.fields.brandColorPreset.colors.sky", { defaultValue: "Sky" }) },
                { value: "#22c55e", label: t("ecommerce.addProduct.fields.brandColorPreset.colors.success", { defaultValue: "Success" }) },
                { value: "#f97316", label: t("ecommerce.addProduct.fields.brandColorPreset.colors.warning", { defaultValue: "Warning" }) },
                { value: "#ef4444", label: t("ecommerce.addProduct.fields.brandColorPreset.colors.danger", { defaultValue: "Danger" }) },
              ],
            },
          },
          {
            type: "textarea",
            name: "short_description",
            label: t("ecommerce.addProduct.fields.shortDescription.label", { defaultValue: "Short Description" }),
            grid: "12",
            className: "",
          },
        ],
      },
    ],
  },

  /* ===========================
      PRODUCT DETAILS SECTION
  ============================ */
  {
    type: "container",
    grid: "12",
    className: `${containerStyle} m-0!`,

    innerGrid: { cols: 3 },

    children: [
      {
        type: "input",
        name: "sku",
        label: t("ecommerce.addProduct.fields.sku.label", { defaultValue: "SKU" }),
        grid: "12 md:4",
        placeholder: t("ecommerce.addProduct.fields.sku.placeholder", { defaultValue: "SKU-2025-001" }),
      },
      {
        type: "input",
        name: "brand",
        label: t("ecommerce.addProduct.fields.brand.label", { defaultValue: "Brand" }),
        grid: "12 md:4",
        placeholder: t("ecommerce.addProduct.fields.brand.placeholder", { defaultValue: "Nike, Adidas..." }),
      },
      {
        type: "select",
        name: "category",
        label: t("ecommerce.addProduct.fields.category.label", { defaultValue: "Category" }),
        grid: "12 md:4",
        props: {
          placeholder: t("ecommerce.addProduct.fields.category.placeholder", { defaultValue: "Choose category" }),
          options: [
            { label: t("ecommerce.addProduct.fields.category.options.shoes", { defaultValue: "Shoes" }), value: "shoes" },
            { label: t("ecommerce.addProduct.fields.category.options.clothing", { defaultValue: "Clothing" }), value: "clothing" },
            { label: t("ecommerce.addProduct.fields.category.options.accessories", { defaultValue: "Accessories" }), value: "accessories" },
            { label: t("ecommerce.addProduct.fields.category.options.limited", { defaultValue: "Limited Edition" }), value: "limited" },
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
    className: containerStyle,

    innerGrid: { cols: 3 },

    children: [
      {
        type: "input",
        name: "price",
        label: t("ecommerce.addProduct.fields.price.label", { defaultValue: "Base Price" }),
        placeholder: t("ecommerce.addProduct.fields.price.placeholder", { defaultValue: "199" }),
        grid: "12 md:4",
        props: { type: "number" },
        validation: "required|min:1",
      },
      {
        type: "input",
        name: "compare_price",
        label: t("ecommerce.addProduct.fields.comparePrice.label", { defaultValue: "Compare Price" }),
        placeholder: t("ecommerce.addProduct.fields.comparePrice.placeholder", { defaultValue: "249" }),
        grid: "12 md:4",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "cost_price",
        label: t("ecommerce.addProduct.fields.costPrice.label", { defaultValue: "Cost Price" }),
        placeholder: t("ecommerce.addProduct.fields.costPrice.placeholder", { defaultValue: "120" }),
        grid: "12 md:4",
        props: { type: "number" },
      },

      {
        type: "slider",
        name: "discount",
        label: t("ecommerce.addProduct.fields.discount.label", { defaultValue: "Discount (%)" }),
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
    className: containerStyle,

    innerGrid: { cols: 3 },

    children: [
      {
        type: "input",
        name: "stock",
        label: t("ecommerce.addProduct.fields.stock.label", { defaultValue: "Stock Quantity" }),
        placeholder: t("ecommerce.addProduct.fields.stock.placeholder", { defaultValue: "100" }),
        grid: "12 md:4",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "barcode",
        label: t("ecommerce.addProduct.fields.barcode.label", { defaultValue: "Barcode" }),
        grid: "12 md:4",
        placeholder: t("ecommerce.addProduct.fields.barcode.placeholder", { defaultValue: "EAN-13" }),
      },
      {
        type: "select",
        name: "warehouse",
        label: t("ecommerce.addProduct.fields.warehouse.label", { defaultValue: "Warehouse" }),
        grid: "12 md:4",
        props: {
          placeholder: t("ecommerce.addProduct.fields.warehouse.placeholder", { defaultValue: "Select warehouse" }),
          options: [
            { label: t("ecommerce.addProduct.fields.warehouse.options.main", { defaultValue: "Main Warehouse" }), value: "main" },
            { label: t("ecommerce.addProduct.fields.warehouse.options.berlin", { defaultValue: "Berlin Store" }), value: "berlin" },
            { label: t("ecommerce.addProduct.fields.warehouse.options.cologne", { defaultValue: "Cologne Branch" }), value: "cologne" },
          ],
        },
      },

      {
        type: "checkbox",
        name: "track_inventory",
        label: t("ecommerce.addProduct.fields.trackInventory.label", { defaultValue: "Track Inventory" }),
        grid: "12 md:4",
      },
      {
        type: "checkbox",
        name: "allow_out_of_stock",
        label: t("ecommerce.addProduct.fields.allowOutOfStock.label", { defaultValue: "Allow Out-of-Stock Orders" }),
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
    className: containerStyle,

    innerGrid: { cols: 4 },

    children: [
      {
        type: "input",
        name: "weight",
        label: t("ecommerce.addProduct.fields.weight.label", { defaultValue: "Weight (kg)" }),
        grid: "12 md:3",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "length",
        label: t("ecommerce.addProduct.fields.length.label", { defaultValue: "Length (cm)" }),
        grid: "12 md:3",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "width",
        label: t("ecommerce.addProduct.fields.width.label", { defaultValue: "Width (cm)" }),
        grid: "12 md:3",
        props: { type: "number" },
      },
      {
        type: "input",
        name: "height",
        label: t("ecommerce.addProduct.fields.height.label", { defaultValue: "Height (cm)" }),
        grid: "12 md:3",
        props: { type: "number" },
      },

      {
        type: "select",
        name: "shipping_class",
        label: t("ecommerce.addProduct.fields.shippingClass.label", { defaultValue: "Shipping Class" }),
        grid: "12 md:12",
        props: {
          placeholder: t("ecommerce.addProduct.fields.shippingClass.placeholder", { defaultValue: "Choose class" }),
          options: [
            { label: t("ecommerce.addProduct.fields.shippingClass.options.standard", { defaultValue: "Standard" }), value: "standard" },
            { label: t("ecommerce.addProduct.fields.shippingClass.options.express", { defaultValue: "Express" }), value: "express" },
            { label: t("ecommerce.addProduct.fields.shippingClass.options.oversize", { defaultValue: "Oversize" }), value: "oversize" },
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
    className: containerStyle,

    innerGrid: { rows: "auto auto auto" },

    children: [
      {
        type: "input",
        name: "meta_title",
        label: t("ecommerce.addProduct.fields.metaTitle.label", { defaultValue: "Meta Title" }),
        grid: "12",
      },
      {
        type: "textarea",
        name: "meta_description",
        label: t("ecommerce.addProduct.fields.metaDescription.label", { defaultValue: "Meta Description" }),
        grid: "12",
      },
      {
        type: "input",
        name: "meta_keywords",
        label: t("ecommerce.addProduct.fields.metaKeywords.label", { defaultValue: "Meta Keywords" }),
        placeholder: t("ecommerce.addProduct.fields.metaKeywords.placeholder", { defaultValue: "keyword1, keyword2, keyword3" }),
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
    className: containerStyle,

    innerGrid: { cols: 3 },

    children: [
      {
        type: "checkbox",
        name: "is_active",
        label: t("ecommerce.addProduct.fields.isActive.label", { defaultValue: "Active Product" }),
        grid: "12 md:4",
        validation: "required",
      },
      {
        type: "radio",
        name: "product_status",
        label: t("ecommerce.addProduct.fields.productStatus.label", { defaultValue: "Product Status" }),
        grid: "12 md:4",
        props: {
          options: [
            { label: t("ecommerce.addProduct.fields.productStatus.options.active", { defaultValue: "Active" }), value: "active" },
            { label: t("ecommerce.addProduct.fields.productStatus.options.draft", { defaultValue: "Draft" }), value: "draft" },
            { label: t("ecommerce.addProduct.fields.productStatus.options.archived", { defaultValue: "Archived" }), value: "archived", disabled: true },
          ],
        },
        validation: "required",
      },
      {
        type: "datepicker",
        name: "publish_date",
        label: t("ecommerce.addProduct.fields.publishDate.label", { defaultValue: "Publish Date" }),
        grid: "12 md:4",
        props: {
          placeholder: t("ecommerce.addProduct.fields.publishDate.placeholder", { defaultValue: "Select date" }),
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
    type: "richtext",
    name: "description",
    label: t("ecommerce.addProduct.fields.description.label", { defaultValue: "Full Description" }),
    grid: "12",
    validation: "required|min:30",
    props: {
      editorClassName: "soson",
      placeholder: t("ecommerce.addProduct.fields.description.placeholder", { defaultValue: "Write full product content…" }),
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
    className: "mt-6",
    props: {
      text: t("ecommerce.addProduct.fields.saveButton.text", { defaultValue: "Create Product" }),
      variant: "default",
      size: "lg",
      className: "m-0!",
      type: "submit",
      // isLoading: true,
    },
  },
  ];
}

// Backward-compatible export (static). Prefer createProductFormSchema(t) for live language switching.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const productFormSchema: FormField[] = createProductFormSchema(((...args: any[]) => args[0]) as any);
