/**
 * ============================================================================
 * @file index.ts
 * @description Central barrel export file that aggregates and re-exports
 *              all reusable UI components from the Eano design system.
 *              Includes base UI, charts, feedback, layout, and navigation components.
 * 
 * @version 1.0.0
 * @author Omar Shaar
 * @since 2024
 * ============================================================================
 */

import { lazy } from "react";

export const AreaChartLinearWidget = lazy(() => import("@/eano/components/charts/AreaChartLinear"));
export const AreaChartWidget = lazy(() => import("@/eano/components/charts/AreaChart"));
export const AreaChartStepWidget = lazy(() => import("@/eano/components/charts/AreaChartStep"));
export { Sparkline } from "@/eano/components/charts/Sparkline";
export { Input } from "@/eano/components/base-ui/Input";
export { TableDynamic } from "@/eano/components/tables/TableDynamic";

// ================= Branding =================
export { Logo } from "@/components/Logo";

// ================= Base UI =================
export { Button } from "@/eano/design-system/shadcn/button";
export { Textarea } from "@/eano/components/base-ui/Textarea";
export { Label } from "@/eano/design-system/shadcn/label";
export { Select } from "@/eano/components/base-ui/Select";
export { Checkbox } from "@/eano/components/base-ui/Checkbox";
export { RadioGroup } from "@/eano/components/base-ui/RadioGroup";
export { Switch } from "@/eano/components/base-ui/Switch";
export { Slider } from "@/eano/components/base-ui/Slider";
export { Badge } from "@/eano/design-system/shadcn/badge";
export { Separator } from "@/eano/design-system/shadcn/separator";
export { Avatar, AvatarImage, AvatarFallback } from "@/eano/design-system/shadcn/avatar";
export { Progress } from "@/eano/design-system/shadcn/progress";
export { Skeleton } from "@/eano/design-system/shadcn/skeleton";
export { Spinner } from "@/eano/design-system/shadcn/spinner";
export { ToolTip } from "@/eano/components/base-ui/Tooltip";
export { Popover } from "@/eano/components/base-ui/Popover";
export { CopyButton } from "@/eano/design-system/shadcn/copy-button";

// ================= Feedback =================
export { Alert } from "@/eano/components/feedback-alerts/Alert";
export { ConfirmDialog } from "@/eano/components/feedback-alerts/ConfirmDialog";
export { InfoAlertCard, type InfoAlertCardProps } from "@/eano/components/feedback-alerts/InfoAlertCard";
export { Toaster } from "@/eano/design-system/shadcn/sonner";

// ================= Layout =================
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/eano/design-system/shadcn/card";
export { ScrollArea } from "@/eano/components/layout-ui/ScrollArea";
export { ResizablePanels } from "@/eano/components/layout-ui/ResizablePanels";
export { Collapsible } from "@/eano/components/layout-ui/Collapsible";
export { Accordion } from "@/eano/components/layout-ui/Accordion";
export { Drawer } from "@/eano/components/layout-ui/Drawer";
export { Sheet } from "@/eano/components/layout-ui/Sheet";
export { HoverCard } from "@/eano/components/layout-ui/HoverCard";
export { Dialog } from "@/eano/components/layout-ui/Dialog";
export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/eano/design-system/shadcn/table";
export { Pagination } from "@/eano/components/layout-ui/Pagination";

// ================= Navigation =================
export { Breadcrumb } from "@/eano/components/navigation-ui/Breadcrumb";
export { Tabs } from "@/eano/components/navigation-ui/Tabs";
export { DropdownMenu } from "@/eano/components/navigation-ui/DropdownMenu";
export { ContextMenu } from "@/eano/components/navigation-ui/ContextMenu";
export { NavigationMenu } from "@/eano/components/navigation-ui/NavigationMenu";
export { Menubar } from "@/eano/components/navigation-ui/Menubar";
export { Sidebar } from "@/eano/design-system/shadcn/sidebar";
export { Command } from "@/eano/components/navigation-ui/Command";

// ================= Date & Time =================
export { DatePicker } from "@/eano/components/date-time-ui/DatePicker";
export { TimePicker } from "@/eano/components/date-time-ui/TimePicker";

// ================= Forms Extended =================
export { Form } from "@/eano/design-system/shadcn/form";
export { InputOTP } from "@/eano/design-system/shadcn/input-otp";
export { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/eano/design-system/shadcn/dropzone";
export { ColorPicker } from "@/eano/components/forms-extended-ui/ColorPicker";
export { Choicebox } from "@/eano/components/forms-extended-ui/Choicebox";
export { ColorPresetSelect } from "@/eano/components/forms-extended-ui/ColorPresetSelect";
export { MinimalTiptap } from "@/eano/design-system/shadcn/minimal-tiptap";
export { EanoRichTextEditor } from "@/eano/components/blocks/Editor/SunEditor";

// ================= Media =================
export { ImageCrop } from "@/eano/components/media-visual-ui/ImageCrop";
export { ImageZoom } from "@/eano/design-system/shadcn/image-zoom";
export { Tags } from "@/eano/components/media-visual-ui/Tags";
export { ProductImageGallery } from "@/eano/components/media-visual-ui/ProductImageGallery";

// ================= Interactive =================
export { CardContainer, CardBody, CardItem } from "@/eano/design-system/shadcn/3d-card";
export type { CardContainerProps, CardBodyProps } from "@/eano/design-system/shadcn/3d-card";
export { Spinner as Spinner2 } from "@/eano/design-system/shadcn/spinner";

// ================= Visualization =================
export { QRCode } from "@/eano/design-system/shadcn/qr-code";
export { Status } from "@/eano/components/media-visual-ui/Status";
export { VideoPlayer } from "@/eano/design-system/shadcn/video-player";

// ================= Misc =================
export { ToggleGroup } from "@/eano/design-system/shadcn/toggle-group";

// ================= Typography =================
export { Kbd } from "@/eano/design-system/shadcn/kbd";

// ================= Code Blocks =================
export { CodeBlock } from "@/eano/design-system/shadcn/code-block";

// ================= Carousel =================
export { Carousel } from "@/eano/components/media-visual-ui/Carousel";

// ================= Blocks =================
export { GanttBlock } from "@/eano/components/blocks/Gnatt/GnattBlock";
export { KanbanBlock } from "@/eano/components/blocks/Kanban/KanbanBlock";
export type { KanbanColumn, KanbanItem, KanbanUser } from "@/eano/components/blocks/Kanban/KanbanBlock";
export { EditableInfoCard } from "@/eano/components/blocks/EditableInfoCard";
export { CalenderBlock } from "@/eano/components/blocks/Calender/Calender";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/eano/design-system/shadcn/button-group";
export { OrderListBlock, type OrderListItem } from "@/eano/components/lists/OrderListBlock";
export { OrderCard, type OrderCardData, type OrderCardProps } from "@/eano/components/cards/OrderCard";
export {
	CouponsDiscountsCard,
	type CouponsDiscountsCardData,
	type CouponsDiscountsCardProps,
	type CouponDiscountStatus,
} from "@/eano/components/cards/CouponsDiscountsCard";
export { ProductListBlock } from "@/eano/components/lists/ProductListBlock/ProductListBlock";
export type { ProductListItem } from "@/eano/components/lists/ProductListBlock/types";

// ================= Widgets =================
export { PageHeader } from "@/eano/components/widgets/PageHeader";
export { Page } from "@/eano/components/page/Page";
export { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget";
export { StatMiniSkeleton } from "@/eano/components/widgets/skeletons/WidgetSkeletons";
export { DataTable } from "@/eano/data-table-builder";
export type { ColumnConfig } from "@/eano/data-table-builder";
export type { FormConfig, FormField } from "@/eano/form-builder/types/form.types";