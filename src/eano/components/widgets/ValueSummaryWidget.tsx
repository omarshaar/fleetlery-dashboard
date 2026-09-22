"use client";

/**
 * ValueSummaryWidget (Final Simplified Actions)
 *
 * Supports:
 * - Title
 * - Large animated value (with auto prefix/suffix parsing)
 * - Growth badge (string like "+2.1%")
 * - Full-width rounded action button
 *
 * Action props simplified:
 *    actionLabel: string
 *    onActionClick?: () => void
 *    actionIcon?: ReactNode
 */

import React from "react";
import { CountingNumber } from "@/eano/design-system/shadcn/counting-number";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/eano/lib/utils";
import { ValueSummarySkeleton, isDataValid } from "./skeletons";

export interface ValueSummaryWidgetData {
  title: string;
  value: number | string;
  animated?: boolean;

  /** Growth like "+2.1%" or "-3%" */
  growth?: string | number;

  /** Simplified action props */
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
}

interface ValueSummaryWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ValueSummaryWidgetData;
}

/** -------------------------------------------
 * Generic number parser (prefix/suffix support)
 * ------------------------------------------- */
function parseDisplayValue(input: number | string) {
  if (typeof input === "number") {
    return { numeric: input, prefix: "", suffix: "", isNumeric: true };
  }

  const raw = input.toString().trim();
  const match = raw.match(/-?\d[\d,.]*/);

  if (!match) {
    return { numeric: 0, prefix: "", suffix: raw, isNumeric: false };
  }

  const numericStr = match[0];
  const numericValue = Number(numericStr.replace(/,/g, ""));

  const prefix = raw.startsWith(numericStr)
    ? ""
    : raw.slice(0, raw.indexOf(numericStr));

  const suffix = raw.endsWith(numericStr)
    ? ""
    : raw.slice(raw.indexOf(numericStr) + numericStr.length);

  return {
    numeric: numericValue,
    prefix,
    suffix,
    isNumeric: !isNaN(numericValue),
  };
}

export function ValueSummaryWidget({
  data,
  className,
  ...rest
}: ValueSummaryWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <ValueSummarySkeleton className={className} {...rest} />;
  }

  const parsed = parseDisplayValue(data.value);

  /* Growth Logic */
  const growthStr = data.growth?.toString() ?? "";
  const hasGrowth = growthStr !== "";
  const growthNegative = growthStr.trim().startsWith("-");

  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col gap-3
        eano-widget
      `,
        className
      )}
      {...rest}
    >
      {/* Title */}
      <div className="text-gray-500 dark:text-gray-400 text-sm">
        {data.title}
      </div>

      {/* Value + Growth */}
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-1">
          <div className="text-3xl font-semibold text-gray-900 dark:text-white flex items-end gap-1">
            {/* Prefix */}
            {parsed.prefix && (
              <span className="text-2xl text-gray-500 dark:text-gray-400 mb-0.5">
                {parsed.prefix}
              </span>
            )}

            {/* Numeric */}
            {data.animated && parsed.isNumeric ? (  
              <CountingNumber number={parsed.numeric} />
            ) : (
              parsed.numeric
            )}

            {/* Suffix */}
            {parsed.suffix && (
              <span className="text-2xl text-gray-500 dark:text-gray-400 mb-0.5">
                {parsed.suffix}
              </span>
            )}
          </div>
        </div>

        {/* Growth badge */}
        {hasGrowth && (
          <div
            className={cn(
              `
              text-xs font-medium px-3 py-1 rounded-full text-white
            `,
              growthNegative ? "bg-red-500" : "bg-green-500"
            )}
          >
            {growthStr}
          </div>
        )}
      </div>

      {/* Action Button */}
      {data.actionLabel && (
        <button
          onClick={data.onActionClick}
          className="
            w-full bg-primary/80
            text-white text-xs!
            rounded-full py-2! px-4
            flex items-center justify-between
            transition
          "
        >
          <span className="text-sm">{data.actionLabel}</span>

          <span>
            {data.actionIcon ? data.actionIcon : <ArrowUpRight size={18} />}
          </span>
        </button>
      )}
    </div>
  );
}
