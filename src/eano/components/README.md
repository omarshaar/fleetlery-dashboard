# 🤖 EANO Components - AI Assistant Reference

**Version:** 1.0 | **Updated:** January 2026

> **AI Instructions:** This document provides complete component references for code generation. Each component includes import path, props interface, and usage example. Use exact imports and follow TypeScript patterns shown.

---

## 📦 Component Categories

```
@/eano/components/
├── base-ui/             → Form inputs, basic UI elements
├── blocks/              → Kanban, Editor, Calendar, Gantt
├── cards/               → Content, Article, Product cards
├── charts/              → Area, Bar, Pie, Radar charts (Recharts)
├── date-time-ui/        → DatePicker, TimePicker
├── feedback-alerts/     → Alert, ConfirmDialog, InfoAlertCard
├── forms-extended-ui/   → Choicebox, ColorPicker
├── language-switcher/   → LanguageSwitcher
├── layout-ui/           → Dialog, Drawer, Sheet, Accordion, Tabs
├── lists/               → OrderList, ProductList
├── media-visual-ui/     → Carousel, ImageCrop, Gallery, Status, Tags
├── navigation-ui/       → Breadcrumb, Command, Menu, Tabs
├── tables/              → TableDynamic, DataTableDynamic
├── widgets/             → Stats, Charts, Clocks, Headers
└── _shared/             → FieldWrapper, FieldMessage
```

---

## 1️⃣ Base UI Components

**Location:** `@/eano/components/base-ui/`

### Input
```tsx
import { Input } from "@/eano/components/base-ui/Input"

<Input 
  label="Email" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  description="Optional helper text"
  error={errors.email}
  required
  type="email"
/>
```
**Props:** `label`, `description`, `error`, `required`, `type`, `value`, `onChange`, `className`

### Select
```tsx
import { Select } from "@/eano/components/base-ui/Select"

<Select 
  options={[{value: "1", label: "Option 1"}]}
  value={selected}
  onChange={setSelected}
/>
```
**Props:** `options`, `value`, `onChange`, `placeholder`, `disabled`

### Checkbox
```tsx
import { Checkbox } from "@/eano/components/base-ui/Checkbox"

<Checkbox checked={agreed} onCheckedChange={setAgreed} />
```
**Props:** `checked`, `onCheckedChange`, `disabled`, `id`

### RadioGroup
```tsx
import { RadioGroup } from "@/eano/components/base-ui/RadioGroup"

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioGroupItem value="option1" />
</RadioGroup>
```
**Use:** Single selection from multiple options. Mutually exclusive.

### Switch
```tsx
import { Switch } from "@/eano/components/base-ui/Switch"

<Switch checked={enabled} onCheckedChange={setEnabled} />
```
**Use:** Toggle on/off states.

### Slider
```tsx
import { Slider } from "@/eano/components/base-ui/Slider"

<Slider value={[50]} onValueChange={setValue} min={0} max={100} />
```
**Props:** `value`, `onValueChange`, `min`, `max`, `step`

### Textarea
```tsx
import { Textarea } from "@/eano/components/base-ui/Textarea"

<Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
```
**Use:** Multi-line text input.

### Tooltip
```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/eano/components/base-ui/Tooltip"

<Tooltip>
  <TooltipTrigger>Hover me</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```
**Use:** Show information on hover.

### Popover
```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/eano/components/base-ui/Popover"

<Popover>
  <PopoverTrigger>Click me</PopoverTrigger>
  <PopoverContent>Content here</PopoverContent>
</Popover>
```
**Props:** `side` (top/right/bottom/left), `align` (start/center/end)

### TextFields
```tsx
import { TextFields } from "@/eano/components/base-ui/TextFields"

<TextFields value={value} onChange={setValue} />
```
**Use:** Flexible formatted text fields.

---

## 2️⃣ Blocks - Complex Components

**Location:** `@/eano/components/blocks/`

### Kanban Board
```tsx
import { KanbanBlock } from "@/eano/components/blocks/Kanban/KanbanBlock"

<KanbanBlock columns={columns} tasks={tasks} onTaskMove={handleMove} />
```
**Features:** Drag-and-drop task management. Uses `@dnd-kit`.
**Props:** `columns`, `tasks`, `onTaskMove`, `onTaskUpdate`

### Gnatt Chart
```tsx
import { GnattChart } from "@/eano/components/blocks/Gnatt"

<GnattChart tasks={tasks} startDate={start} endDate={end} />
```
**Use:** Project timeline visualization.

### Calendar
```tsx
import { Calendar } from "@/eano/components/blocks/Calender"

<Calendar events={events} onDateSelect={handleSelect} />
```
**Use:** Date selection and event display.

### Rich Text Editor
```tsx
import { Editor } from "@/eano/components/blocks/Editor"

<Editor value={content} onChange={setContent} />
```
**Features:** Formatting, lists, images, links.

### EditableInfoCard
```tsx
import { EditableInfoCard } from "@/eano/components/blocks/EditableInfoCard"

<EditableInfoCard data={userData} onSave={handleSave} editable />
```
**Use:** Display and edit user information inline.

---

## 3️⃣ Cards

**Location:** `@/eano/components/cards/`

### ContentCard
```tsx
import { ContentCard } from "@/eano/components/cards/ContentCard"

<ContentCard 
  data={{
    title: "Article Title",
    subtitle: "Description",
    tag: "Category",
    primaryValue: 100,
    secondaryValue: 50,
    imageUrl: "/image.jpg",
    createdAt: "2026-01-20"
  }}
/>
```
**Props Interface:**
```tsx
interface ContentCardData {
  title: string
  subtitle?: string
  tag?: string
  primaryValue?: number
  secondaryValue?: number
  primaryLabel?: string
  secondaryLabel?: string
  editedAt?: string
  createdAt?: string
  imageUrl?: string
}
```

### ContentArticleCard
```tsx
import { ContentArticleCard } from "@/eano/components/cards/ContentArticleCard"

<ContentArticleCard article={article} onClick={handleClick} />
```
**Use:** Display articles with cover, description, publish date.

### ProductGridItem
```tsx
import { ProductGridItem } from "@/eano/components/cards/ProductGridItem"

<ProductGridItem product={product} onSelect={handleSelect} />
```
**Use:** Product display in grid layout. Shows image, price, rating.

### ProductListItemRow
```tsx
import { ProductListItemRow } from "@/eano/components/cards/ProductListItemRow"

<ProductListItemRow product={product} onEdit={handleEdit} />
```
**Use:** Product display in list/table view.

---

## 4️⃣ Charts (Recharts)

**Location:** `@/eano/components/charts/`

### Common Props Interface
```tsx
interface ChartProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys: string[]
  title?: string
  description?: string
  defaultRange?: "7d" | "30d" | "90d"
  showRangeSelector?: boolean
}
```

### Area Charts
```tsx
import { AreaChart } from "@/eano/components/charts/AreaChart"

<AreaChart data={data} seriesKeys={["sales", "revenue"]} xKey="date" />
```
**Variants:** `AreaChart`, `AreaChartLinear`, `AreaChartStep`
**Use:** Trends over time, cumulative data.

### Bar Charts
```tsx
import { BarChart } from "@/eano/components/charts/BarChart"

<BarChart data={data} seriesKeys={["value"]} xKey="category" />
```
**Variants:** `BarChart`, `BarChartHorizontal`, `BarChartNegative`, `BarChartStacked`
**Use:** Compare categories, show distributions.

### Pie Charts
```tsx
import { PieChartSimple } from "@/eano/components/charts/PieChartSimple"

<PieChartSimple data={data} config={config} />
```
**Variants:** `PieChartSimple`, `PieChartLabel`, `PieChartLabelList`
**Use:** Show proportions and percentages.

### Radar Charts
```tsx
import { RadarChartDefault } from "@/eano/components/charts/RadarChartDefault"

<RadarChartDefault data={data} seriesKeys={["value"]} />
```
**Variants:** `RadarChartDefault`, `RadarChartDots`, `RadarChartGridCircle`, `RadarChartMultiple`
**Use:** Multi-dimensional comparisons.

### Sparkline
```tsx
import { Sparkline } from "@/eano/components/charts/Sparkline"

<Sparkline data={data} />
```
**Use:** Compact inline trend visualization.

---

## 5️⃣ Date & Time

**Location:** `@/eano/components/date-time-ui/`

### DatePicker
```tsx
import { DatePicker } from "@/eano/components/date-time-ui/DatePicker"

<DatePicker value={date} onChange={setDate} range={false} />
```
**Props:** `value`, `onChange`, `range` (single date or date range)

### TimePicker
```tsx
import { TimePicker } from "@/eano/components/date-time-ui/TimePicker"

<TimePicker value={time} onChange={setTime} />
```
**Use:** Select hours and minutes.

---

## 6️⃣ Feedback & Alerts

**Location:** `@/eano/components/feedback-alerts/`

### Alert
```tsx
import { Alert } from "@/eano/components/feedback-alerts/Alert"

<Alert type="success" message="Saved successfully" onClose={handleClose} />
```
**Props:** `type` (success/error/warning/info), `message`, `onClose`

### ConfirmDialog
```tsx
import { ConfirmDialog } from "@/eano/components/feedback-alerts/ConfirmDialog"

<ConfirmDialog 
  title="Delete item?"
  message="This action cannot be undone"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  open={isOpen}
/>
```
**Use:** Request user confirmation before destructive actions.

### InfoAlertCard
```tsx
import { InfoAlertCard } from "@/eano/components/feedback-alerts/InfoAlertCard"

<InfoAlertCard 
  title="New Feature"
  description="Check out our latest update"
  variant="blue"
  icon={<Icon />}
/>
```
**Variants:** `blue`, `green`, `amber`, `red`, `purple`

---

## 7️⃣ Forms Extended

**Location:** `@/eano/components/forms-extended-ui/`

### Choicebox
```tsx
import { Choicebox } from "@/eano/components/forms-extended-ui/Choicebox"

<Choicebox 
  options={[{value: "1", label: "Option", image: "/img.jpg"}]}
  value={selected}
  onChange={setSelected}
  multiple
/>
```
**Use:** Visual selection with images and descriptions.

### ColorPicker
```tsx
import { ColorPicker } from "@/eano/components/forms-extended-ui/ColorPicker"

<ColorPicker value={color} onChange={setColor} />
```
**Use:** Select colors in forms.

---

## 8️⃣ Language Switcher

**Location:** `@/eano/components/language-switcher/`

```tsx
import { LanguageSwitcher } from "@/eano/components/language-switcher/LanguageSwitcher"

<LanguageSwitcher />
```
**Languages:** Arabic (ar), English (en), German (de)
**Integration:** Uses `useLanguage()` hook from `@/i18n/hooks`

---

## 9️⃣ Layout UI

**Location:** `@/eano/components/layout-ui/`

### Dialog
```tsx
import { Dialog, DialogTrigger, DialogContent } from "@/eano/components/layout-ui/Dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>Content here</DialogContent>
</Dialog>
```
**Use:** Modal overlays. Click outside or ESC to close.

### Drawer
```tsx
import { Drawer } from "@/eano/components/layout-ui/Drawer"

<Drawer side="left" open={isOpen} onOpenChange={setIsOpen}>
  Content
</Drawer>
```
**Props:** `side` (left/right)

### Sheet
```tsx
import { Sheet, SheetTrigger, SheetContent } from "@/eano/components/layout-ui/Sheet"

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="right">Content</SheetContent>
</Sheet>
```
**Use:** Slide-in panels from sides. Lighter than Dialog.

### Accordion
```tsx
import { Accordion, AccordionItem } from "@/eano/components/layout-ui/Accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="1">Content</AccordionItem>
</Accordion>
```
**Props:** `type` (single/multiple)

### Collapsible
```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/eano/components/layout-ui/Collapsible"

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```

### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/eano/components/layout-ui/Tabs"

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
</Tabs>
```

### Pagination
```tsx
import { Pagination } from "@/eano/components/layout-ui/Pagination"

<Pagination currentPage={page} totalPages={10} onChange={setPage} />
```

### HoverCard
```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/eano/components/layout-ui/HoverCard"

<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>Info</HoverCardContent>
</HoverCard>
```

### ScrollArea
```tsx
import { ScrollArea } from "@/eano/components/layout-ui/ScrollArea"

<ScrollArea className="h-[200px]">Long content</ScrollArea>
```

### ResizablePanels
```tsx
import { ResizablePanels } from "@/eano/components/layout-ui/ResizablePanels"

<ResizablePanels>
  <Panel>Left</Panel>
  <Panel>Right</Panel>
</ResizablePanels>
```
**Use:** Drag-to-resize panels.

---

## � Lists

**Location:** `@/eano/components/lists/`

### OrderListBlock
```tsx
import { OrderListBlock } from "@/eano/components/lists/OrderListBlock"

<OrderListBlock orders={orders} onOrderClick={handleClick} />
```
**Use:** Display orders with status, prices, details.

### ProductListBlock
```tsx
import { ProductListBlock } from "@/eano/components/lists/ProductListBlock"

<ProductListBlock products={products} onSearch={handleSearch} />
```
**Features:** Search, filters, sorting.

---

## 🔧 System

**Location:** `@/eano/components/system/`

### DataStateGate

Gate rendering based on typical API/query state.

- If `isLoading` is `true` → renders `LoadingState`
- Else if `isError` is `true` → renders `DataErrorState`
- Else if `data` is an array with `length > 0` → renders `children`
- Otherwise → renders nothing (`null`)

```tsx
import { DataStateGate, DataEmptyState } from "@/eano/components/system"

<>
  {/* Optional: handle empty state outside the gate */}
  {!isLoading && !isError && (orders?.length ?? 0) === 0 && <DataEmptyState />}

  <DataStateGate isLoading={isLoading} isError={isError} data={orders}>
    <div className="grid grid-cols-1 gap-3">
      {/* Render your data UI here */}
    </div>
  </DataStateGate>
</>
```

**Props Interface:**
```tsx
type DataStateGateProps<TData> = {
  isLoading?: boolean
  isError?: boolean
  data?: TData[] | null
  children?: React.ReactNode
}
```

## 1️⃣1️⃣ Media & Visual

**Location:** `@/eano/components/media-visual-ui/`

### Carousel
```tsx
import { Carousel } from "@/eano/components/media-visual-ui/Carousel"

<Carousel images={images} autoplay />
```
**Use:** Image slideshows with navigation.

### ImageCrop
```tsx
import { ImageCrop } from "@/eano/components/media-visual-ui/ImageCrop"

<ImageCrop image={image} onCrop={handleCrop} aspect={1} />
```
**Use:** Crop and edit images.

### ProductImageGallery
```tsx
import { ProductImageGallery } from "@/eano/components/media-visual-ui/ProductImageGallery"

<ProductImageGallery images={images} />
```
**Features:** Main image + thumbnails.

### Status
```tsx
import { Status } from "@/eano/components/media-visual-ui/Status"

<Status status="active" />
```
**States:** `active`, `inactive`, `pending`, `error`

### Tags
```tsx
import { Tags } from "@/eano/components/media-visual-ui/Tags"

<Tags tags={tags} onAdd={handleAdd} onRemove={handleRemove} />
```
**Use:** Display and manage category tags.

---

## 1️⃣2️⃣ Navigation

**Location:** `@/eano/components/navigation-ui/`

### Breadcrumb
```tsx
import { Breadcrumb } from "@/eano/components/navigation-ui/Breadcrumb"

<Breadcrumb items={[{label: "Home", href: "/"}, {label: "Products"}]} />
```

### Command
```tsx
import { Command } from "@/eano/components/navigation-ui/Command"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem>Item</CommandItem>
  </CommandList>
</Command>
```
**Use:** Cmd+K style command palette.

### DropdownMenu
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/eano/components/navigation-ui/DropdownMenu"

<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### ContextMenu
```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuContent } from "@/eano/components/navigation-ui/ContextMenu"

<ContextMenu>
  <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
  <ContextMenuContent>Options</ContextMenuContent>
</ContextMenu>
```

### Menubar
```tsx
import { Menubar, MenubarMenu, MenubarTrigger } from "@/eano/components/navigation-ui/Menubar"

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
  </MenubarMenu>
</Menubar>
```

### NavigationMenu
```tsx
import { NavigationMenu } from "@/eano/components/navigation-ui/NavigationMenu"

<NavigationMenu items={navItems} />
```
**Use:** Main site navigation with nested items.

---

## 1️⃣3️⃣ Tables

**Location:** `@/eano/components/tables/`

### TableDynamic
```tsx
import { TableDynamic } from "@/eano/components/tables/TableDynamic"

<TableDynamic 
  columns={[{key: "name", label: "Name"}]}
  data={data}
  pagination
/>
```
**Use:** Simple tables with basic sorting.

### DataTableDynamic
```tsx
import { DataTableDynamic } from "@/eano/components/tables/DataTableDynamic"

<DataTableDynamic 
  columns={columns}
  data={data}
  searchable
  sortable
  selectable
  columnVisibility
/>
```
**Features:** Advanced table with filters, sorting, selection, column toggle, pagination.
**Integration:** Uses `@/eano/data-table-builder` under the hood.

---

## 1️⃣4️⃣ Widgets

**Location:** `@/eano/components/widgets/`

### PageHeader
```tsx
import { PageHeader } from "@/eano/components/widgets/PageHeader"

<PageHeader 
  title="Dashboard"
  breadcrumbs={[{label: "Home", href: "/"}]}
  actions={<Button>Add</Button>}
/>
```

### StatMiniWidget
```tsx
import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget"

<StatMiniWidget 
  label="Total Sales"
  value="$1,234"
  change="+12%"
  icon={<DollarSign />}
/>
```

### StatProgressWidget
```tsx
import { StatProgressWidget } from "@/eano/components/widgets/StatProgressWidget"

<StatProgressWidget label="Progress" value={75} max={100} />
```

### ChartWidgetContainer
```tsx
import { ChartWidgetContainer } from "@/eano/components/widgets/ChartWidgetContainer"

<ChartWidgetContainer title="Sales Chart">
  <BarChart data={data} />
</ChartWidgetContainer>
```

### ValueSummaryWidget
```tsx
import { ValueSummaryWidget } from "@/eano/components/widgets/ValueSummaryWidget"

<ValueSummaryWidget items={[{label: "Total", value: "100"}]} />
```

### ClockPreviewWidget
```tsx
import { ClockPreviewWidget } from "@/eano/components/widgets/ClockPreviewWidget"

<ClockPreviewWidget type="digital" />
```
**Types:** `digital`, `analog`

### ContributionMatrixWidget
```tsx
import { ContributionMatrixWidget } from "@/eano/components/widgets/ContributionMatrixWidget"

<ContributionMatrixWidget data={contributions} />
```
**Use:** GitHub-style activity heatmap.

### DialControlWidget
```tsx
import { DialControlWidget } from "@/eano/components/widgets/DialControlWidget"

<DialControlWidget value={50} onChange={setValue} min={0} max={100} />
```

### PieDistributionWidget
```tsx
import { PieDistributionWidget } from "@/eano/components/widgets/PieDistributionWidget"

<PieDistributionWidget data={data} />
```

### ProgressSummaryWidget
```tsx
import { ProgressSummaryWidget } from "@/eano/components/widgets/ProgressSummaryWidget"

<ProgressSummaryWidget tasks={tasks} />
```

### RadarWidget
```tsx
import { RadarWidget } from "@/eano/components/widgets/RadarWidget"

<RadarWidget data={data} />
```

### SmartToggleWidget
```tsx
import { SmartToggleWidget } from "@/eano/components/widgets/SmartToggleWidget"

<SmartToggleWidget states={["off", "on", "auto"]} value={state} onChange={setState} />
```

### SummaryListWidget
```tsx
import { SummaryListWidget } from "@/eano/components/widgets/SummaryListWidget"

<SummaryListWidget items={summaryItems} />
```

### WeeklyTasksWidget
```tsx
import { WeeklyTasksWidget } from "@/eano/components/widgets/WeeklyTasksWidget"

<WeeklyTasksWidget tasks={weeklyTasks} />
```

### Skeletons
```tsx
import { CardSkeleton, TableSkeleton } from "@/eano/components/widgets/skeletons"

<CardSkeleton />
<TableSkeleton rows={5} />
```
**Use:** Show while loading data.

---

## 1️⃣5️⃣ Shared Components

**Location:** `@/eano/components/_shared/`

### FieldWrapper
```tsx
import { FieldWrapper } from "@/eano/components/_shared/FieldWrapper"

<FieldWrapper label="Username" error={error} required>
  <Input />
</FieldWrapper>
```
**Use:** Standardize form field layout.

### FieldMessage
```tsx
import { FieldMessage } from "@/eano/components/_shared/FieldMessage"

<FieldMessage type="error">Invalid input</FieldMessage>
```
**Types:** `error`, `info`, `success`

---

## 🎯 AI Usage Patterns

### Dashboard Page
```tsx
import { StatMiniWidget, ChartWidgetContainer, BarChart } from "@/eano/components"

<div className="grid grid-cols-3 gap-4">
  <StatMiniWidget label="Users" value="1,234" />
  <ChartWidgetContainer title="Sales">
    <BarChart data={salesData} />
  </ChartWidgetContainer>
</div>
```

### Form Page
```tsx
import { Input, Select, DatePicker, ConfirmDialog } from "@/eano/components"

<form>
  <Input label="Name" required />
  <Select options={options} />
  <DatePicker />
  <ConfirmDialog onConfirm={handleSubmit} />
</form>
```

### Product Page
```tsx
import { ProductGridItem, DataTableDynamic, Carousel } from "@/eano/components"

// Grid view
<div className="grid grid-cols-4 gap-4">
  {products.map(p => <ProductGridItem product={p} />)}
</div>

// List view
<DataTableDynamic columns={columns} data={products} />
```

### Navigation Setup
```tsx
import { NavigationMenu, Breadcrumb, Tabs } from "@/eano/components"

<NavigationMenu items={menuItems} />
<Breadcrumb items={breadcrumbs} />
<Tabs value={activeTab} onValueChange={setActiveTab} />
```

---

## 🔗 Related Systems

- **Form Builder:** `@/eano/form-builder` - Dynamic form generation
- **Data Table Builder:** `@/eano/data-table-builder` - Advanced table system
- **File Explorer:** `@/eano/file-explorer` - File browsing component
- **Design System:** `@/eano/design-system/shadcn` - Base UI primitives
- **i18n:** `@/i18n/hooks` - `useLanguage()` for translations

---

## 📝 Technical Notes

**Stack:** React 18+ | TypeScript | Tailwind CSS | Shadcn/ui  
**RTL Support:** All components support Arabic (RTL)  
**Theming:** Light/Dark mode via theme provider  
**Imports:** Use `@/` alias for absolute imports

---

**Version:** 1.0 | **Updated:** January 2026
