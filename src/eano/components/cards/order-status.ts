import type React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";

export type OrderStatusVariant =
  | "active"
  | "processing"
  | "shipped"
  | "delivered"
  | "overdue"
  | "cancelled";

export const ORDER_STATUS_STYLES: Record<
  OrderStatusVariant,
  {
    badge: string;
    accent: string;
    line: string;
    endDotActive: boolean;
    icon: React.ComponentType<{ className?: string }>;
    defaultLabel: string;
  }
> = {
  active: {
    badge: "text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300",
    accent: "border-b-sky-500",
    line: "bg-sky-500",
    endDotActive: false,
    icon: Zap,
    defaultLabel: "Active",
  },
  processing: {
    badge: "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
    accent: "border-b-amber-500",
    line: "bg-amber-500",
    endDotActive: false,
    icon: Clock,
    defaultLabel: "Processing",
  },
  shipped: {
    badge: "text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300",
    accent: "border-b-violet-500",
    line: "bg-violet-500",
    endDotActive: false,
    icon: Truck,
    defaultLabel: "Shipped",
  },
  delivered: {
    badge: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300",
    accent: "border-b-emerald-500",
    line: "bg-emerald-500",
    endDotActive: true,
    icon: CheckCircle2,
    defaultLabel: "Delivered",
  },
  overdue: {
    badge: "text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300",
    accent: "border-b-red-500",
    line: "bg-red-500",
    endDotActive: true,
    icon: AlertTriangle,
    defaultLabel: "Overdue",
  },
  cancelled: {
    badge: "text-zinc-700 bg-zinc-100 dark:bg-zinc-900/50 dark:text-zinc-200",
    accent: "border-b-zinc-400",
    line: "bg-zinc-400",
    endDotActive: true,
    icon: XCircle,
    defaultLabel: "Cancelled",
  },
};

export function getOrderStatusLabel(
  variant: OrderStatusVariant,
  label?: string
) {
  return label ?? ORDER_STATUS_STYLES[variant].defaultLabel;
}
