"use client";

/**
 * OrderCard
 *
 * Ecommerce-focused order card inspired by the provided mock.
 * - Fully data-driven (no children)
 * - Works with just `data` prop
 * - Optional callbacks for card/action click
 */

import * as React from "react";
import { Card, Button, Avatar, AvatarImage, AvatarFallback } from "@/components";
import { cn } from "@/eano/lib/utils";
import { useLanguage } from "@/i18n/hooks";
import {
  ORDER_STATUS_STYLES,
  getOrderStatusLabel,
  type OrderStatusVariant,
} from "./order-status";
import {
  ChevronRight,
  Globe,
  Package,
  Store,
  Truck,
} from "lucide-react";

export type OrderCardStatusVariant = OrderStatusVariant;

export type OrderCardChannelType =
  | "website"
  | "in_store"
  | "marketplace"
  | "delivery"
  | "pickup";

export interface OrderCardItem {
  name: string;
  quantity?: number;
  variant?: string;
}

export interface OrderCardTimeline {
  start: string;
  end: string;
  startLabel?: string;
  endLabel?: string;
  /** 0..100. If omitted, a sensible default is derived from status. */
  progress?: number;
}

export interface OrderCardCustomer {
  name: string;
  avatarUrl?: string;
  channel?: {
    type?: OrderCardChannelType;
    label: string;
  };
}

export interface OrderCardData {
  id: string | number;
  status: {
    variant: OrderCardStatusVariant;
    label?: string;
  };
  items: OrderCardItem[];
  timeline?: OrderCardTimeline;
  customer: OrderCardCustomer;
  total?: {
    amount: number;
    currency?: string;
  };
}

export interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: OrderCardData;
  onCardClick?: (data: OrderCardData) => void;
  onActionClick?: (data: OrderCardData) => void;
  onUserClick?: (data: OrderCardData) => void;
  actionAriaLabel?: string;
  /** Override the summary line text when there are more items than shown. */
  moreItemsLabel?: (remainingCount: number) => string;
  maxItemsToShow?: number;
}

function clamp01To100(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatItemLines(
  items: OrderCardItem[],
  maxItemsToShow: number,
  moreItemsLabel: (remainingCount: number) => string
) {
  const normalized = items.filter((it) => it?.name?.trim());
  const headCount = Math.max(1, maxItemsToShow);
  const slice = normalized.slice(0, headCount);
  const remaining = Math.max(0, normalized.length - slice.length);

  const lines = slice.map((it) => {
    const qty = it.quantity ?? 1;
    const variant = it.variant ? ` — ${it.variant}` : "";
    return `${it.name}${variant} (${qty}x)`;
  });

  if (remaining > 0) {
    lines.push(moreItemsLabel(remaining));
  }

  return lines;
}

function getChannelIcon(type?: OrderCardChannelType) {
  switch (type) {
    case "website":
      return Globe;
    case "in_store":
      return Store;
    case "delivery":
      return Truck;
    case "pickup":
      return Package;
    case "marketplace":
    default:
      return Package;
  }
}

export function OrderCard({
  data,
  onCardClick,
  onActionClick,
  onUserClick,
  actionAriaLabel,
  moreItemsLabel,
  maxItemsToShow = 2,
  className,
  ...rest
}: OrderCardProps) {
  const { t } = useLanguage();

  const styles = ORDER_STATUS_STYLES[data.status.variant];
  const StatusIcon = styles.icon;
  const ChannelIcon = getChannelIcon(data.customer.channel?.type);

  const statusLabel =
    data.status.label ??
    t(`ecommerce.orders.filters.status.options.${data.status.variant}` as const, {
      defaultValue: getOrderStatusLabel(data.status.variant),
    });

  const resolvedActionAriaLabel =
    actionAriaLabel ??
    t("ecommerce.orderCard.actions.open", {
      defaultValue: "Open order",
    });

  const progress = clamp01To100(
    data.timeline?.progress ??
      (data.status.variant === "delivered" ? 100 : data.status.variant === "overdue" ? 100 : 0)
  );

  const endDotClass =
    progress >= 100 || styles.endDotActive
      ? styles.line
      : "bg-muted-foreground/30";

  const isClickable = Boolean(onCardClick);
  const isActionable = Boolean(onActionClick);

  const normalizedItems = data.items.filter((it) => it?.name?.trim());
  const shownCount = Math.max(1, maxItemsToShow);
  const remainingCount = Math.max(0, normalizedItems.length - shownCount);
  const hasMoreItems = remainingCount > 0;

  const itemLines = formatItemLines(
    data.items,
    maxItemsToShow,
    moreItemsLabel ??
      ((remaining) =>
        t("ecommerce.orderCard.moreItems", {
          count: remaining,
          defaultValue: "....... and {{count}} more items",
        }))
  );

  const totalText =
    data.total?.amount !== undefined
      ? `${(data.total.currency ?? "$")}${data.total.amount.toLocaleString()}`
      : undefined;

  return (
    <Card
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick?.(data);
        }
      }}
      onClick={() => onCardClick?.(data)}
      className={cn(
        "rounded-xl border shadow-sm hover:shadow-md transition cursor-default gap-0! p-0! overflow-hidden",
        "border-b-4",
        styles.accent,
        isClickable && "cursor-pointer",
        className
      )}
      {...rest}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-muted-foreground font-medium shrink-0">
              #{data.id}
            </span>

            {totalText && (
              <span className="text-sm font-semibold text-foreground truncate">
                {totalText}
              </span>
            )}
          </div>

          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0",
              styles.badge
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mt-3 flex-1">
          <div className="space-y-1">
            {itemLines.map((line, index) => (
              <p
                key={`${data.id}-item-${index}`}
                className={cn(
                  "leading-snug line-clamp-1",
                  hasMoreItems && index === itemLines.length - 1
                    ? "text-xs text-muted-foreground"
                    : "text-xs font-medium"
                )}
              >
                { index +1 !== itemLines.length ? `${index + 1}.` : ""} {line}
              </p>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {data.timeline && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex flex-col">
                {data.timeline.startLabel && (
                  <span className="leading-none">{data.timeline.startLabel}</span>
                )}
                <span className="leading-none">{data.timeline.start}</span>
              </div>

              <div className="flex flex-col items-end">
                {data.timeline.endLabel && (
                  <span className="leading-none">{data.timeline.endLabel}</span>
                )}
                <span className="leading-none">{data.timeline.end}</span>
              </div>
            </div>

            <div className="relative mt-2 h-3">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-muted" />
              <div
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-0.5",
                  styles.line
                )}
                style={{ width: `${progress}%` }}
              />

              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-foreground" />
              <span
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
                  endDotClass
                )}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div
            className={cn(
              "flex items-center gap-3 min-w-0",
              onUserClick ? "cursor-pointer" : "cursor-default"
            )}
            onClick={(e) => {
              if (!onUserClick) return;
              e.stopPropagation();
              onUserClick(data);
            }}
            role={onUserClick ? "button" : undefined}
            tabIndex={onUserClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (!onUserClick) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onUserClick(data);
              }
            }}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={data.customer.avatarUrl} alt={data.customer.name} />
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(data.customer.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="text-sm font-semibold leading-none truncate">
                {data.customer.name}
              </p>

              {data.customer.channel?.label && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ChannelIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{data.customer.channel.label}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full",
              !isActionable && "opacity-70 cursor-default"
            )}
            aria-label={resolvedActionAriaLabel}
            disabled={!isActionable}
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.(data);
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
