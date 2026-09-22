# Form Builder - Technical Guide

## Overview

Dynamic form system that generates forms from JSON-like schema definitions with automatic validation, persistence, and Redux integration.

---

## Configuration (FormConfig)

```typescript
interface FormConfig {
  formId: string;              // Unique form identifier
  
  persistence?: {
    enabled: boolean;          // Enable/disable persistence
    storage: "session" | "local";  // Storage type
  };
  
  onSubmit?: (context: { values: any; ctx: FormRuntimeCtx }) => void | Promise<void>;
}
```

**Example:**
```typescript
export const productFormConfig: FormConfig = {
  formId: "productFormExample",
  
  persistence: {
    enabled: true,
    storage: "session"
  },
  
  onSubmit: async ({ values }) => {
    console.log("Form submitted:", values);
    // await api.createProduct(values);
  }
};
```

---

## Schema Structure (FormField[])

```typescript
interface FormField {
  type: string;                    // Field type
  name?: string;                   // Field identifier (except container/button)
  label?: string;                  // Display label
  grid: string;                    // Grid system (e.g., "12", "12 md:6")
  className?: string;              // CSS classes
  placeholder?: string;            // Placeholder text
  validation?: string;             // Validation rules (e.g., "required|min:3")
  defaultValue?: any;              // Initial value
  props?: Record<string, any>;     // Field-specific properties
  children?: FormField[];          // For container type only
  innerGrid?: { cols?: number; rows?: string }; // For container only
}
```

### Understanding `props` Property

**CRITICAL:** The `props` object in the schema is **exactly the same** as the props passed to any React component. Any property you add to `props` in the schema will be forwarded **directly** as a prop to the underlying React component.

This means the `props` object serves as a **pass-through** for:
- **Native HTML attributes** (e.g., `disabled`, `readOnly`, `autoFocus`, `maxLength`)
- **Component-specific props** (e.g., `options` for Select, `rows` for Textarea, `min`/`max` for number inputs)
- **Event listeners** (e.g., `onClick`, `onChange`, `onBlur`, `onFocus`)
- **Styling props** (e.g., `className`, `style`, custom style props)
- **Any other props** supported by the underlying component

**In essence:** If the underlying component accepts a prop, you can pass it through the `props` object in your schema.

**Visual Mapping:**

```
Form Schema:
{
  type: "input",
  props: { type: "email", required: true, autoFocus: true }
}
        ↓↓↓ becomes ↓↓↓
Actual Component:
<Input type="email" required={true} autoFocus={true} />

Form Schema:
{
  type: "select",
  props: { options: [...], placeholder: "Select..." }
}
        ↓↓↓ becomes ↓↓↓
Actual Component:
<Select options={[...]} placeholder="Select..." />
```

**Example:**
```typescript
{
  type: "input",
  name: "email",
  props: {
    type: "email",              // → <Input type="email" />
    required: true,             // → <Input required={true} />
    autoFocus: true,            // → <Input autoFocus={true} />
    disabled: false,            // → <Input disabled={false} />
    onBlur: (e) => console.log("Blurred"),  // → <Input onBlur={...} />
    className: "custom-input"   // → <Input className="custom-input" />
  }
}
```

**For Select:**
```typescript
{
  type: "select",
  name: "category",
  props: {
    options: [...],             // → <Select options={[...]} />
    placeholder: "Choose...",   // → <Select placeholder="Choose..." />
    disabled: false             // → <Select disabled={false} />
  }
}
```

**For Checkbox:**
```typescript
{
  type: "checkbox",
  name: "agree",
  props: {
    required: true,             // → <Checkbox required={true} />
    disabled: false,            // → <Checkbox disabled={false} />
    onClick: () => {...}        // → <Checkbox onClick={...} />
  }
}
```

> **💡 Key Point:** The `props` object in your schema **mirrors exactly** what you would pass as props to the React component in JSX.

---

## Field Types Reference

### 1. Input

**Purpose:** Single-line text/number input

```typescript
{
  type: "input",
  name: string,
  label?: string,
  grid: string,
  placeholder?: string,
  validation?: string,           // "required|min:3|email"
  defaultValue?: string | number,
  props?: {
    type?: "text" | "email" | "number" | "password" | "tel" | "url";
    required?: boolean;
    min?: number;  // For type="number"
    max?: number;
  }
}
```

**Examples:**
```typescript
// Text
{ type: "input", name: "title", label: "Title", grid: "12", validation: "required|min:3", props: { required: true } }

// Email
{ type: "input", name: "email", grid: "12", validation: "required|email", props: { type: "email", required: true } }

// Number
{ type: "input", name: "price", grid: "12 md:4", props: { type: "number", min: 0, max: 1000 } }
```

---

### 2. Textarea

**Purpose:** Multi-line text input

```typescript
{
  type: "textarea",
  name: string,
  label?: string,
  grid: string,
  placeholder?: string,
  validation?: string,
  defaultValue?: string,
  props?: { rows?: number; required?: boolean; }
}
```

**Example:**
```typescript
{ type: "textarea", name: "description", label: "Description", grid: "12", props: { rows: 4 } }
```

---

### 3. Select

**Purpose:** Dropdown selection

```typescript
{
  type: "select",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: any,
  props: {
    placeholder?: string;
    options: Array<{ label: string; value: any; disabled?: boolean }>;
    required?: boolean;
  }
}
```

**Example:**
```typescript
{
  type: "select",
  name: "category",
  label: "Category",
  grid: "12 md:6",
  validation: "required",
  props: {
    placeholder: "Choose...",
    options: [
      { label: "Shoes", value: "shoes" },
      { label: "Clothing", value: "clothing" },
      { label: "Accessories", value: "accessories" }
    ],
    required: true
  }
}
```

---

### 4. Checkbox

**Purpose:** Boolean toggle (on/off)

```typescript
{
  type: "checkbox",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: boolean,
  props?: { required?: boolean; }
}
```

**Example:**
```typescript
{ type: "checkbox", name: "is_active", label: "Active", grid: "12", defaultValue: true, validation: "required", props: { required: true } }
```

---

### 5. Radio

**Purpose:** Single selection from multiple options

```typescript
{
  type: "radio",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: any,
  props: {
    options: Array<{ label: string; value: any; disabled?: boolean }>;
    required?: boolean;
  }
}
```

**Example:**
```typescript
{
  type: "radio",
  name: "status",
  label: "Status",
  grid: "12",
  validation: "required",
  props: {
    options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived", disabled: true }
    ],
    required: true
  }
}
```

---

### 6. Slider

**Purpose:** Numeric range value

```typescript
{
  type: "slider",
  name: string,
  label?: string,
  grid: string,
  defaultValue?: number,
  props: { min: number; max: number; step?: number; }
}
```

**Example:**
```typescript
{ type: "slider", name: "discount", label: "Discount (%)", grid: "12", defaultValue: 0, props: { min: 0, max: 80, step: 1 } }
```

---

### 7. Datepicker

**Purpose:** Date selection

```typescript
{
  type: "datepicker",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: Date | string,
  props?: {
    placeholder?: string;
    mode?: "single" | "range" | "multiple";
    minDate?: Date;
    maxDate?: Date;
    autoClose?: boolean;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
    required?: boolean;
  }
}
```

**Example:**
```typescript
{
  type: "datepicker",
  name: "publish_date",
  label: "Publish Date",
  grid: "12 md:6",
  validation: "required",
  props: {
    placeholder: "Select date",
    mode: "single",
    minDate: new Date("2020-01-01"),
    maxDate: new Date("2030-12-31"),
    autoClose: true,
    required: true
  }
}
```

---

### 8. Gallery

**Purpose:** Image upload and management (multiple images)

```typescript
{
  type: "gallery",
  name: string,
  label?: string,
  grid: string,
  className?: string,
  defaultValue?: any[]
}
```

**Example:**
```typescript
{ type: "gallery", name: "images", label: "Product Images", grid: "6", className: "m-0!" }
```

---

### 9. Avatar

**Purpose:** Single image upload for profile pictures/avatars

```typescript
{
  type: "avatar",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: string,
  props?: {
    description?: string;
    size?: number | string;     // Avatar size in pixels (default: 120)
    shape?: "circle" | "square"; // Avatar shape (default: "circle")
    accept?: string[];          // Accepted file types (default: ["image/png", "image/jpeg", "image/webp"])
    uploadMethods?: ("file" | "url")[]; // Upload methods (default: ["file", "url"])
    required?: boolean;
  }
}
```

**Example:**
```typescript
{
  type: "avatar",
  name: "profile_picture",
  label: "Profile Picture",
  grid: "12 md:6",
  validation: "required",
  props: {
    description: "Upload your profile picture",
    size: 120,
    shape: "circle",
    accept: ["image/png", "image/jpeg", "image/webp"],
    uploadMethods: ["file", "url"],
    required: true
  }
}
```

**How it works:**
- Click avatar to upload (if empty) or view full image (if set)
- Uses the same professional upload dialog as ProductImageGallery
- Supports file upload and URL input methods
- Remove button appears on avatar when image is set
- Click image to view in zoom modal
- Returns base64 encoded image string

**Features:**
- Professional upload dialog (file + URL)
- Image zoom modal for viewing
- Circle or square shape
- Remove button on hover
- Click to upload or view
- Clean, minimal UI

---

### 10. ColorPicker

**Purpose:** Color selection with visual preview in a dialog

```typescript
{
  type: "colorpicker",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: string,
  props?: {
    description?: string;
    previewSize?: number;        // Preview circle size in pixels (default: 24)
    dialogTitle?: string;        // Dialog title (default: "Pick a Color")
    dialogDescription?: string;  // Dialog description
    required?: boolean;
  }
}
```

**Example:**
```typescript
{
  type: "colorpicker",
  name: "brand_color",
  label: "Brand Color",
  grid: "12 md:6",
  validation: "required",
  defaultValue: "rgba(59, 130, 246, 1)",
  props: {
    description: "Choose your brand primary color",
    previewSize: 24,
    dialogTitle: "Select Brand Color",
    dialogDescription: "Pick a color for your brand identity",
    required: true
  }
}
```

**How it works:**
- Displays a button with color preview circle
- Click button to open dialog with ColorPicker
- Color updates when dialog closes

**Color Format:**
- Returns: `rgba(r, g, b, a)` string format
- Accepts: `#hex`, `rgb(...)`, `rgba(...)`, or comma-separated values

---

### 10. RichText

**Purpose:** Rich text editor with formatting

```typescript
{
  type: "richtext",
  name: string,
  label?: string,
  grid: string,
  validation?: string,
  defaultValue?: string,
  props?: {
    placeholder?: string;
    editorClassName?: string;
    editorOptions?: {
      minHeight?: string;
      buttonList?: string[][];
      clean?: { removeEmptyTags?: boolean; };
    };
    required?: boolean;
  }
}
```

**Example:**
```typescript
{
  type: "richtext",
  name: "description",
  label: "Description",
  grid: "12",
  validation: "required|min:30",
  props: {
    placeholder: "Write content…",
    editorOptions: {
      minHeight: "150px",
      buttonList: [["undo", "redo"], ["bold", "italic"], ["link"]]
    },
    required: true
  }
}
```

---

### 11. Button

**Purpose:** Form action button

```typescript
{
  type: "button",
  name?: string,
  grid: string,
  className?: string,
  props: {
    text: string;
    type: "submit" | "button" | "reset";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
}
```

**Example:**
```typescript
{
  type: "button",
  grid: "12",
  className: "mt-6",
  props: { text: "Submit", type: "submit", variant: "default", size: "lg" }
}
```

---

### 12. Container

**Purpose:** Group and organize fields

```typescript
{
  type: "container",
  grid: string,
  className?: string,
  innerGrid?: { cols?: number; rows?: string; },
  children: FormField[]
}
```

**Example:**
```typescript
{
  type: "container",
  grid: "12",
  className: "p-4 border rounded",
  innerGrid: { cols: 3 },
  children: [
    { type: "input", name: "price", label: "Price", grid: "12 md:4", props: { type: "number" } },
    { type: "input", name: "compare_price", label: "Compare", grid: "12 md:4", props: { type: "number" } },
    { type: "slider", name: "discount", label: "Discount", grid: "12", props: { min: 0, max: 80 } }
  ]
}
```

---

## Grid System

```typescript
grid: "12"              // Full width
grid: "6"               // Half width
grid: "4"               // One-third
grid: "3"               // One-quarter

grid: "12 md:6"         // Mobile: 100%, Desktop: 50%
grid: "12 md:6 lg:4"    // Mobile: 100%, Tablet: 50%, Desktop: 33%
```

---

## Validation Rules

| Rule | Example |
|------|---------|
| `required` | `"required"` |
| Min length/value | `"min:3"` or `"min:1"` |
| Max length/value | `"max:100"` |
| Email format | `"email"` |
| URL format | `"url"` |

**Combined:** `"required|min:3|email"` | `"required\|min:30"`

---

## Complete Example

```typescript
import type { FormConfig, FormField } from "@/eano/form-builder/types/form.types";

export const productFormConfig: FormConfig = {
  formId: "productForm",
  persistence: { enabled: true, storage: "session" },
  onSubmit: async ({ values }) => { console.log("Submitted:", values); }
};

export const productFormSchema: FormField[] = [
  { type: "input", name: "title", label: "Title", grid: "12", validation: "required|min:3", props: { required: true } },
  {
    type: "container",
    grid: "12",
    className: "p-4 border rounded",
    innerGrid: { cols: 3 },
    children: [
      { type: "input", name: "price", label: "Price", grid: "12 md:4", validation: "required", props: { type: "number", required: true } },
      { type: "input", name: "compare_price", label: "Compare", grid: "12 md:4", props: { type: "number" } },
      { type: "slider", name: "discount", label: "Discount", grid: "12", props: { min: 0, max: 80 } }
    ]
  },
  { type: "select", name: "category", label: "Category", grid: "12 md:6", validation: "required", props: { placeholder: "Choose...", options: [{ label: "Shoes", value: "shoes" }], required: true } },
  { type: "checkbox", name: "is_active", label: "Active", grid: "12 md:6", defaultValue: true },
  { type: "colorpicker", name: "brand_color", label: "Brand Color", grid: "12 md:6", defaultValue: "rgba(59, 130, 246, 1)", props: { previewSize: 24, dialogTitle: "Select Brand Color" } },
  { type: "richtext", name: "description", label: "Description", grid: "12", validation: "required|min:30", props: { editorOptions: { minHeight: "150px" }, required: true } },
  { type: "button", grid: "12", className: "mt-6", props: { text: "Create", type: "submit", variant: "default", size: "lg" } }
];
```

**Usage:**
```typescript
export default function ProductPage() {
  return <DynamicForm config={productFormConfig} schema={productFormSchema} />;
}
```

---

## Avatar Field Example (User Profile)

```typescript
export const userProfileConfig: FormConfig = {
  formId: "userProfile",
  persistence: { enabled: true, storage: "local" },
  onSubmit: async ({ values }) => { 
    console.log("Profile updated:", values);
    // await api.updateProfile(values);
  }
};

export const userProfileSchema: FormField[] = [
  {
    type: "avatar",
    name: "profile_picture",
    label: "Profile Picture",
    grid: "12",
    validation: "required",
    props: {
      size: 150,
      shape: "circle",
      maxSize: 5,
      description: "Upload your profile picture (JPG, PNG, max 5MB)",
      required: true
    }
  },
  { 
    type: "input", 
    name: "full_name", 
    label: "Full Name", 
    grid: "12 md:6", 
    validation: "required|min:3",
    props: { required: true } 
  },
  { 
    type: "input", 
    name: "email", 
    label: "Email", 
    grid: "12 md:6", 
    validation: "required|email",
    props: { type: "email", required: true } 
  },
  { 
    type: "textarea", 
    name: "bio", 
    label: "Biography", 
    grid: "12",
    props: { rows: 4, placeholder: "Tell us about yourself..." } 
  },
  { 
    type: "button", 
    grid: "12", 
    className: "mt-4",
    props: { text: "Update Profile", type: "submit", variant: "default" } 
  }
];
```

---

## Field Type Summary

| Type | Purpose | Key Props |
|------|---------|-----------|
| `input` | Single-line text/number | `type`, `placeholder` |
| `textarea` | Multi-line text | `rows` |
| `select` | Dropdown selection | `options`, `placeholder` |
| `checkbox` | Boolean toggle | `defaultValue` |
| `radio` | Single selection | `options` |
| `slider` | Numeric range | `min`, `max`, `step` |
| `datepicker` | Date selection | `mode`, `minDate`, `maxDate` |
| `gallery` | Multiple image upload | - |
| `avatar` | Single image upload (profile) | `size`, `shape`, `maxSize` |
| `colorpicker` | Color selection (dialog) | `previewSize`, `dialogTitle` |
| `richtext` | Rich text editor | `editorOptions`, `buttonList` |
| `button` | Action button | `text`, `type`, `variant` |
| `container` | Group fields | `children`, `innerGrid` |

---

## Programmatic Value Filling

In addition to `defaultValue` in the schema and persistence, you can programmatically
fill or update any form field from code using small helper functions.

These helpers are built on top of the same Redux slice used by `DynamicForm`, so they
work consistently with validation, persistence, and error handling.

### API

```typescript
import {
  fillFormValues,
  setFormFieldValue,
} from "@/eano/form-builder/core/formApi";

// Generic values shape
type FormValues = Record<string, any>;
```

#### `fillFormValues(formId: string, values: FormValues)`

Fill multiple fields of a form in one call.

- `formId`: must match `FormConfig.formId` used by `DynamicForm`.
- `values`: plain object of `{ fieldName: value }`.

**Example – fill product form after fetching from API:**

```typescript
import { useEffect } from "react";
import { DynamicForm } from "@/eano/form-builder/DynamicForm";
import { fillFormValues } from "@/eano/form-builder/core/formApi";
import { productFormConfig, productFormSchema } from "./schema";

export default function ProductFormPage() {
  const formId = productFormConfig.formId;

  // Example data from API (can be any shape)
  const productFromApi = {
    title: "Nike Air Jordan 1",
    price: 199,
    compare_price: 249,
    is_active: true,
  };

  useEffect(() => {
    // Once data is available → fill the form fields
    fillFormValues(formId, productFromApi);
  }, [formId, productFromApi]);

  return <DynamicForm config={productFormConfig} schema={productFormSchema} />;
}
```

You can pass **any subset** of fields; only matching field names will be updated.

#### `setFormFieldValue(formId: string, name: string, value: any)`

Set a **single** field value programmatically.

**Example – update one field only:**

```typescript
import { setFormFieldValue } from "@/eano/form-builder/core/formApi";

// Later in your code (e.g., after user action)
setFormFieldValue("productForm", "title", "New Product Title");
```

Both helpers:

- Use the central Redux store (`formBuilder` slice).
- Automatically clear existing validation errors for the updated fields.
- Respect persistence configuration defined in `FormConfig.persistence`.

---

## Best Practices

✅ Use `validation` for required fields  
✅ Set `grid` for responsive layouts  
✅ Use `container` to organize sections  
✅ Enable `autoSave` for long forms  
✅ Use `defaultValue` when appropriate  
✅ Set `placeholder` for better UX  
