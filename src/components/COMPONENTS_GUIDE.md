# 📚 Complete Components Guide - EANO Components Reference

**Last Updated:** January 2026

This file is a comprehensive guide for all components in the project. It helps AI assistants and developers understand:
- What each component is
- Where to find it
- How to use it
- Key properties and features

---

## 📍 Project Structure

```
src/eano/components/
├── base-ui/                 # Basic UI elements
├── blocks/                  # Complex ready-to-use blocks
├── cards/                   # Various card types
├── charts/                  # Data visualization charts
├── date-time-ui/            # Date and time pickers
├── feedback-alerts/         # Alerts and dialogs
├── forms-extended-ui/       # Advanced form elements
├── language-switcher/       # Language switcher
├── layout-ui/              # Layout components
├── lists/                  # Different lists
├── media-visual-ui/        # Images and media
├── navigation-ui/          # Navigation elements
├── tables/                 # Dynamic tables
├── widgets/                # Advanced tools and containers
└── _shared/                # Shared components and utilities
```

---

## 🎨 1. Base UI Components

**Path:** `src/eano/components/base-ui/`

### Description:
Stable, reusable basic elements with full documentation and styling support.

### Components:

#### **Input** (`Input.tsx`)
- **Purpose:** Advanced text input field
- **Key Properties:**
  - `label`: Label text
  - `description`: Helper text below input
  - `error`: Error message
  - `required`: Required field indicator
- **Use Case:** Forms, search, data entry
- **Example:**
  ```tsx
  <Input 
    label="Email Address" 
    description="Enter your correct email"
    error={errors.email}
    required
  />
  ```

#### **Checkbox** (`Checkbox.tsx`)
- **Purpose:** Checkbox with options
- **Use Case:** Select multiple options
- **Properties:** `checked`, `disabled`, `onChange`

#### **RadioGroup** (`RadioGroup.tsx`)
- **Purpose:** Radio buttons for single selection
- **Use Case:** Choose one from multiple options
- **Note:** Ensures only one selection at a time

#### **Select** (`Select.tsx`)
- **Purpose:** Advanced dropdown list
- **Properties:** `options`, `value`, `onChange`
- **Use Case:** Select from long list

#### **Switch** (`Switch.tsx`)
- **Purpose:** Toggle switch (on/off)
- **Use Case:** Enable/disable features
- **Properties:** `checked`, `onCheckedChange`

#### **Slider** (`Slider.tsx`)
- **Purpose:** Range slider for gradual values
- **Use Case:** Select value range

#### **Textarea** (`Textarea.tsx`)
- **Purpose:** Multi-line text input
- **Use Case:** Long descriptions, comments

#### **Tooltip** (`Tooltip.tsx`)
- **Purpose:** Tooltip on hover
- **Use Case:** Add non-intrusive additional information

#### **TextFields** (`TextFields.tsx`)
- **Purpose:** Flexible text field component
- **Use Case:** Special formatted text fields

---

## 🧩 2. Blocks - Complex Ready-to-Use Components

**Path:** `src/eano/components/blocks/`

### Description:
Complex integrated components that combine multiple simple elements into one ready-to-use unit.

### Components:

#### **Kanban** (`Kanban/KanbanBlock.tsx`)
- **Purpose:** Kanban board for management
- **Features:**
  - Drag and drop
  - Multiple columns
  - Movable cards
- **Use Case:** Task management, workflow
- **Library:** dnd-kit for drag-and-drop

#### **Gantt** (`Gantt/`)
- **Purpose:** Gantt chart for timelines
- **Use Case:** Project management, timeline scheduling
- **Features:** Task display on timeline

#### **Calendar** (`Calender/`)
- **Purpose:** Advanced calendar component
- **Use Case:** Date selection, event display
- **Features:** Date annotations

#### **Editor** (`Editor/`)
- **Purpose:** Rich text editor
- **Use Case:** Create formatted content
- **Features:** Text formatting, lists, images

#### **EditableInfoCard** (`EditableInfoCard.tsx`)
- **Purpose:** Editable information card
- **Use Case:** Display and edit personal information

---

## 🎴 3. Cards

**Path:** `src/eano/components/cards/`

### Description:
Specialized card components for displaying content in different formats.

### Components:

#### **ContentCard** (`ContentCard.tsx`)
- **Purpose:** Generic card for content display
- **Supported Data:**
  - `title`: Title
  - `subtitle`: Subtitle
  - `tag`: Category
  - `primaryValue` and `secondaryValue`: Values
  - `imageUrl`: Optional image
- **Properties:**
  ```tsx
  interface ContentCardData {
    title: string;
    subtitle?: string;
    tag?: string;
    primaryValue?: number;
    secondaryValue?: number;
    primaryLabel?: string;
    secondaryLabel?: string;
    editedAt?: string;
    createdAt?: string;
    imageUrl?: string;
  }
  ```

#### **ContentArticleCard** (`ContentArticleCard.tsx`)
- **Purpose:** Article content card
- **Use Case:** Display articles and resources
- **Features:** Cover image, description, publish date

#### **ProductGridItem** (`ProductGridItem.tsx`)
- **Purpose:** Product item in grid view
- **Use Case:** Product galleries, stores
- **Features:** Image, price, rating

#### **ProductListItemRow** (`ProductListItemRow.tsx`)
- **Purpose:** Product row in list view
- **Use Case:** Product lists
- **Features:** Complete row with all product details

---

## 📊 4. Charts - Data Visualizations

**Path:** `src/eano/components/charts/`

### Description:
Advanced charts built on Recharts library.

### Chart Types:

#### **Area Charts**
- `AreaChart.tsx` - Standard area
- `AreaChartLinear.tsx` - Linear area
- `AreaChartStep.tsx` - Step area
- **Use Case:** Display trends over time

#### **Bar Charts**
- `BarChart.tsx` - Standard bars
- `BarChartHorizontal.tsx` - Horizontal bars
- `BarChartNegative.tsx` - Positive and negative bars
- `BarChartStacked.tsx` - Stacked bars
- **Use Case:** Compare values

#### **Pie Charts**
- `PieChartSimple.tsx` - Simple pie
- `PieChartLabel.tsx` - Pie with labels
- `PieChartLabelList.tsx` - Pie with label list
- **Use Case:** Display ratios and parts

#### **Radar Charts**
- `RadarChartDefault.tsx` - Standard radar
- `RadarChartDots.tsx` - Radar with dots
- `RadarChartGridCircle.tsx` - Radar with circular grid
- `RadarChartMultiple.tsx` - Multi-line radar
- **Use Case:** Multi-dimensional comparison

#### **Other Charts**
- `Sparkline.tsx` - Compact compressed chart
- **Use Case:** Quick trend view

### Shared Properties:
```tsx
interface ChartProps {
  data: any[];           // Chart data
  config: ChartConfig;   // Color and label settings
  xKey?: string;         // X-axis key
  seriesKeys: string[];  // Series keys
  title?: string;        // Chart title
  description?: string;  // Description
  defaultRange?: "7d" | "30d" | "90d";
  showRangeSelector?: boolean;
}
```

---

## 📅 5. Date-Time UI

**Path:** `src/eano/components/date-time-ui/`

### Components:

#### **DatePicker** (`DatePicker.tsx`)
- **Purpose:** Date picker
- **Use Case:** Select single date or range
- **Properties:** `value`, `onChange`, `range`

#### **TimePicker** (`TimePicker.tsx`)
- **Purpose:** Time picker
- **Use Case:** Select hours and minutes
- **Properties:** `value`, `onChange`

---

## 🎯 6. Feedback & Alerts

**Path:** `src/eano/components/feedback-alerts/`

### Components:

#### **Alert** (`Alert.tsx`)
- **Purpose:** Dismissible alert message
- **Types:** `success`, `error`, `warning`, `info`
- **Use Case:** Notify user of operation status
- **Properties:**
  - `type`: Alert type
  - `message`: Message text
  - `onClose`: Close handler

#### **ConfirmDialog** (`ConfirmDialog.tsx`)
- **Purpose:** Confirmation dialog
- **Use Case:** Request user confirmation before sensitive operations
- **Properties:** `title`, `message`, `onConfirm`, `onCancel`

---

## 📝 7. Forms Extended UI

**Path:** `src/eano/components/forms-extended-ui/`

### Components:

#### **Choicebox** (`Choicebox.tsx`)
- **Purpose:** Advanced choice box with visual representation
- **Use Case:** Multiple choices with sleek design
- **Features:** Images, description, multi-select

#### **ColorPicker** (`ColorPicker.tsx`)
- **Purpose:** Color picker
- **Use Case:** Select colors in forms
- **Properties:** `value`, `onChange`

---

## 🌍 8. Language Switcher

**Path:** `src/eano/components/language-switcher/`

### Components:

#### **LanguageSwitcher** (`LanguageSwitcher.tsx`)
- **Purpose:** Language switching component
- **Supported Languages:** Arabic, English, German
- **Use Case:** Place in header or sidebar
- **Integration:** Works with `useLanguage()` hook

---

## 🎨 9. Layout UI

**Path:** `src/eano/components/layout-ui/`

### Components:

#### **Accordion** (`Accordion.tsx`)
- **Purpose:** Expandable accordion list
- **Use Case:** Show/hide content
- **Features:** Only one item open at a time

#### **Collapsible** (`Collapsible.tsx`)
- **Purpose:** Collapsible container
- **Use Case:** Show/hide optional content
- **Features:** Multiple can be open simultaneously

#### **Dialog** (`Dialog.tsx`)
- **Purpose:** Modal dialog
- **Use Case:** Display urgent content
- **Features:** Dark background, click outside to close

#### **Drawer** (`Drawer.tsx`)
- **Purpose:** Sliding panel from side
- **Use Case:** Side menus, notes
- **Features:** Slides from left or right

#### **HoverCard** (`HoverCard.tsx`)
- **Purpose:** Card on hover
- **Use Case:** Quick additional information
- **Features:** Auto show/hide

#### **Pagination** (`Pagination.tsx`)
- **Purpose:** Page navigation element
- **Use Case:** Long lists, tables
- **Properties:** `currentPage`, `totalPages`, `onChange`

#### **ResizablePanels** (`ResizablePanels.tsx`)
- **Purpose:** Resizable panels
- **Use Case:** Complex customizable layouts
- **Features:** Drag divider to resize

#### **ScrollArea** (`ScrollArea.tsx`)
- **Purpose:** Custom scroll area
- **Use Case:** Long lists, sidebars
- **Features:** Custom scrollbar

#### **Sheet** (`Sheet.tsx`)
- **Purpose:** Sliding sheet from side
- **Use Case:** Menus, forms, notes
- **Features:** Lighter than Dialog

---

## 📋 10. Lists

**Path:** `src/eano/components/lists/`

### Components:

#### **OrderListBlock** (`OrderListBlock.tsx`)
- **Purpose:** Order list
- **Use Case:** Display orders with details
- **Features:** Different states, prices

#### **ProductListBlock** (`ProductListBlock/`)
- **Purpose:** Product list
- **Use Case:** Display product list
- **Features:** Search, filters, sorting

---

## 📸 11. Media & Visual UI

**Path:** `src/eano/components/media-visual-ui/`

### Components:

#### **Carousel** (`Carousel.tsx`)
- **Purpose:** Image slide show
- **Use Case:** Image galleries, promotions
- **Features:** Navigation buttons, indicators

#### **ImageCrop** (`ImageCrop.tsx`)
- **Purpose:** Image cropping tool
- **Use Case:** Edit profile images
- **Features:** Drag and drop, zoom

#### **ProductImageGallery** (`ProductImageGallery/`)
- **Purpose:** Product image gallery
- **Use Case:** Display multiple product images
- **Features:** Main image, thumbnails

#### **Status** (`Status.tsx`)
- **Purpose:** Status indicator (colors and icons)
- **Use Case:** Display system or task status
- **States:** Active, inactive, pending, error

#### **Tags** (`Tags.tsx`)
- **Purpose:** Display and manage tags
- **Use Case:** Categories, features
- **Features:** Add/remove tags

---

## 🧭 12. Navigation UI

**Path:** `src/eano/components/navigation-ui/`

### Components:

#### **Breadcrumb** (`Breadcrumb.tsx`)
- **Purpose:** Navigation path
- **Use Case:** Show user location in structure
- **Properties:** `items` (list of links)

#### **Command** (`Command.tsx`)
- **Purpose:** Quick search platform
- **Use Case:** General search, shortcuts
- **Features:** Command discovery, instant search

#### **ContextMenu** (`ContextMenu.tsx`)
- **Purpose:** Context menu (right-click)
- **Use Case:** Item options
- **Features:** Shows on right-click

#### **DropdownMenu** (`DropdownMenu.tsx`)
- **Purpose:** Dropdown menu
- **Use Case:** Option menus
- **Properties:** `trigger`, `items`, `onSelect`

#### **Menubar** (`Menubar.tsx`)
- **Purpose:** Horizontal menu bar
- **Use Case:** App main menus
- **Features:** Nested menus

#### **NavigationMenu** (`NavigationMenu.tsx`)
- **Purpose:** Main navigation menu
- **Use Case:** Site navigation
- **Features:** Nested items, vertical and horizontal menus

#### **Tabs** (`Tabs.tsx`)
- **Purpose:** Content tabs
- **Use Case:** Switch between sections
- **Properties:** `tabs`, `value`, `onChange`

---

## 📊 13. Tables

**Path:** `src/eano/components/tables/`

### Components:

#### **TableDynamic** (`TableDynamic.tsx`)
- **Purpose:** Simple dynamic table
- **Use Case:** Display tabular data
- **Properties:** `columns`, `data`, `pagination`

#### **DataTableDynamic** (`DataTableDynamic.tsx`)
- **Purpose:** Advanced dynamic table
- **Use Case:** Large data with filters and sorting
- **Features:**
  - Local and server-side search
  - Column sorting
  - Row selection
  - Show/hide columns
  - Pagination
- **Integration:** Uses `DataTable` from `src/eano/data-table-builder`

---

## 🎛️ 14. Widgets - Tools and Containers

**Path:** `src/eano/components/widgets/`

### Description:
Complex containers and elements ready for use in admin dashboards.

### Components:

#### **ChartWidgetContainer** (`ChartWidgetContainer.tsx`)
- **Purpose:** Chart display container
- **Use Case:** Place charts on dashboards
- **Features:** Title, toolbar, borders

#### **ClockPreviewWidget** (`ClockPreviewWidget.tsx`)
- **Purpose:** Digital/analog clock
- **Use Case:** Display current time

#### **ContributionMatrixWidget** (`ContributionMatrixWidget.tsx`)
- **Purpose:** Contribution matrix (like GitHub)
- **Use Case:** Display daily activity

#### **DialControlWidget** (`DialControlWidget.tsx`)
- **Purpose:** Dial control
- **Use Case:** Analog value control

#### **PieDistributionWidget** (`PieDistributionWidget.tsx`)
- **Purpose:** Circular distribution display
- **Use Case:** Percentages and ratios

#### **ProgressSummaryWidget** (`ProgressSummaryWidget.tsx`)
- **Purpose:** Progress summary
- **Use Case:** Display completion rate

#### **RadarWidget** (`RadarWidget.tsx`)
- **Purpose:** Radar chart container
- **Use Case:** Multi-dimensional comparison

#### **SmartToggleWidget** (`SmartToggleWidget.tsx`)
- **Purpose:** Smart toggle with states
- **Use Case:** Advanced switching

#### **StatMiniWidget** (`StatMiniWidget.tsx`)
- **Purpose:** Mini statistic display
- **Use Case:** Dashboards
- **Properties:** `label`, `value`, `change`, `icon`

#### **StatProgressWidget** (`StatProgressWidget.tsx`)
- **Purpose:** Statistic with progress
- **Use Case:** Display progress rate

#### **SummaryListWidget** (`SummaryListWidget.tsx`)
- **Purpose:** Summary list
- **Use Case:** Display important items

#### **ValueSummaryWidget** (`ValueSummaryWidget.tsx`)
- **Purpose:** Key value summary
- **Use Case:** Display KPIs

#### **WeeklyTasksWidget** (`WeeklyTasksWidget.tsx`)
- **Purpose:** Weekly tasks
- **Use Case:** Weekly planning

#### **Skeletons** (`skeletons/`)
- **Purpose:** Loading placeholders
- **Use Case:** Display while loading data

---

## 🔧 15. Shared Components

**Path:** `src/eano/components/_shared/`

### Components:

#### **FieldWrapper** (`FieldWrapper.tsx`)
- **Purpose:** Wrapper for form fields
- **Use Case:** Standardize field design
- **Features:** Labels, error messages, description

#### **FieldMessage** (`FieldMessage.tsx`)
- **Purpose:** Field message
- **Use Case:** Field annotations
- **Types:** `error`, `info`, `success`

#### **field-types.ts** (`field-types.ts`)
- **Purpose:** Field type definitions
- **Use Case:** Type-safe fields

---

## 🚀 Usage Tips

### ✅ Best Practices:

1. **Use appropriate components:**
   - Simple data: Use `Base UI`
   - Complex interfaces: Use `Blocks` and `Widgets`

2. **Error handling:**
   ```tsx
   // Use Error Boundary or Alert
   try {
     // Operation
   } catch (error) {
     // Show Alert
   }
   ```

3. **Reusability:**
   - Create custom components from basic components
   - Use Props for flexible control

4. **Performance:**
   - Use `React.memo()` for static components
   - Use `useMemo()` for expensive calculations
   - Use `Skeletons` during loading

5. **RTL Compatibility:**
   - All components support RTL (Arabic)
   - Ensure `dir="rtl"` in HTML

### 🎯 Common Usage Maps:

**Dashboard:**
- `Widgets` (Stats, Charts, Progress)
- `Cards` (Content Summary)
- `Layout UI` (Grid, Tabs)

**Products Page:**
- `ProductGridItem` or `ProductListItemRow`
- `DataTableDynamic` for advanced lists
- `Carousel` for images

**Form:**
- `Input`, `Select`, `Textarea` from Base UI
- `DatePicker` for dates
- `ConfirmDialog` for confirmation
- `FieldWrapper` for consistency

**Navigation:**
- `NavigationMenu` for main menu
- `Breadcrumb` for path
- `Tabs` for sections

---

## 📖 More Information

- **Data Table Builder:** See `src/eano/data-table-builder/`
- **Form Builder:** See `src/eano/form-builder/`
- **File Explorer:** See `src/eano/file-explorer/`
- **Design System:** See `src/eano/design-system/`

---

## 📞 Additional Notes

- All components support Theme (Light/Dark)
- Built with React 18+
- TypeScript for safety
- Compatible with Tailwind CSS
- Most from Shadcn/ui with EANO customizations

---

**Last Updated:** January 2026
**Version:** 1.0
