"use client";

/**
 * CouponsDiscountsCard
 *
 * Modern, clean card for Coupons / Discounts.
 * Uses a clipped background container with the requested clip-path.
 */

import * as React from "react";
import {
  Badge,
  Button,
  Card,
  Progress,
} from "@/components";
import { cn } from "@/eano/lib/utils";
import {
  BadgePercent,
  Calendar,
  Copy,
  Sparkles,
  Users,
} from "lucide-react";

const COUPON_CLIP_PATH =
  "polygon(100% 0%, 100% 65%, 97.5% 70%, 100% 75%, 100% 100%, 0% 100%, 0% 75%, 2.5% 70%, 0% 65%, 0% 0%)";

export type CouponDiscountStatus =
  | "active"
  | "scheduled"
  | "paused"
  | "expired";

export interface CouponsDiscountsCardData {
  /** Main heading (e.g., Coupons / Discounts) */
  title?: string;
  /** Small helper text under title */
  subtitle?: string;

  /** Coupon code (e.g., SAVE15) */
  code: string;
  /** Human-readable discount label (e.g., "15% off", "$10 off") */
  discountLabel: string;
  /** Optional scope label (e.g., "All products", "Orders > $50") */
  scopeLabel?: string;

  /** ISO date or already formatted text */
  startsAt?: string;
  expiresAt?: string;

  /** Usage statistics */
  usedCount?: number;
  maxUses?: number;

  /** Optional status */
  status?: CouponDiscountStatus;
}

export interface CouponsDiscountsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: CouponsDiscountsCardData;
  onManageClick?: () => void;
  manageLabel?: string;
  onCopyCode?: (code: string) => void;
}

function clamp01To100(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function getStatusBadge(status?: CouponDiscountStatus) {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" };
    case "scheduled":
      return { label: "Scheduled", className: "bg-sky-600/15 text-sky-700 dark:text-sky-300 border-sky-500/20" };
    case "paused":
      return { label: "Paused", className: "bg-amber-600/15 text-amber-800 dark:text-amber-300 border-amber-500/20" };
    case "expired":
      return { label: "Expired", className: "bg-zinc-600/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/20" };
    default:
      return null;
  }
}

export function CouponsDiscountsCard({
  data,
  onManageClick,
  manageLabel = "Manage",
  onCopyCode,
  className,
  ...rest
}: CouponsDiscountsCardProps) {
  const {
    title = "Coupons / Discounts",
    subtitle = "Create, track, and optimize promotions.",
    code,
    discountLabel,
    scopeLabel,
    startsAt,
    expiresAt,
    usedCount,
    maxUses,
    status = "active",
  } = data;

  const usagePercent =
    typeof usedCount === "number" && typeof maxUses === "number" && maxUses > 0
      ? clamp01To100((usedCount / maxUses) * 100)
      : undefined;

  const statusBadge = getStatusBadge(status);

  return (
    <div
      style={{ clipPath: COUPON_CLIP_PATH }}
      className={cn(
        "relative rounded-xl bg-border p-px transition-shadow hover:shadow-md",
        className
      )}
      {...rest}
    >
      <Card
        style={{ clipPath: COUPON_CLIP_PATH }}
        className="relative overflow-hidden rounded-xl border-0 bg-card py-0 shadow-none"
      >
      {/* Clipped background layer */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
        )}
      />

      {/* Subtle overlay for contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-background/30 dark:bg-background/10"
      />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center min-w-8 min-h-8 rounded-md bg-primary/12 text-primary border border-primary/15">
                <BadgePercent className="size-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {statusBadge && (
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium",
                  statusBadge.className
                )}
              >
                {statusBadge.label}
              </Badge>
            )}
          </div>
        </div>

        <div className="w-full mt-2 flex justify-between gap-3">
          {onManageClick && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2 w-full!"
                onClick={(e) => {
                  e.stopPropagation();
                  onManageClick();
                }}
              >
                <Sparkles className="size-4" />
                <span className="ms-2 text-xs">{manageLabel}</span>
              </Button>
            )}
        </div>

        {/* Main */}
        <div className="mt-3 grid gap-3">
          {/* Code row */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Code</p>
              <p className="text-base font-semibold tracking-wide truncate">
                {code}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Badge className="rounded-full" variant="secondary">
                {discountLabel}
              </Badge>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-full bg-background/70"
                aria-label="Copy coupon code"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyCode?.(code);
                  if (!onCopyCode && navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(code).catch(() => undefined);
                  }
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          {/* Scope */}
          {scopeLabel && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Applies to</p>
              <p className="text-sm font-medium text-foreground truncate">
                {scopeLabel}
              </p>
            </div>
          )}

          {/* Dates */}
          {(startsAt || expiresAt) && (
            <div className="grid grid-cols-2 gap-3">
              {startsAt && (
                <div className="flex items-center gap-2 rounded-lg border bg-background/60 p-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Starts</p>
                    <p className="text-xs font-medium truncate">{startsAt}</p>
                  </div>
                </div>
              )}
              {expiresAt && (
                <div className="flex items-center gap-2 rounded-lg border bg-background/60 p-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Expires</p>
                    <p className="text-xs font-medium truncate">{expiresAt}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Usage */}
          {(typeof usedCount === "number" || typeof maxUses === "number") && (
            <div className="rounded-lg border bg-background/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Usage</p>
                </div>
                <p className="text-xs font-medium">
                  {typeof usedCount === "number" ? usedCount : "–"}
                  {typeof maxUses === "number" ? ` / ${maxUses}` : ""}
                </p>
              </div>

              {typeof usagePercent === "number" && (
                <div className="mt-2">
                  <Progress value={usagePercent} className="h-2" />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {Math.round(usagePercent)}% used
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </Card>
    </div>
  );
}
