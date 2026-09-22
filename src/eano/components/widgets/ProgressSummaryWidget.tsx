"use client";

/**
 * ProgressSummaryWidget
 *
 * Generic progress summary widget for displaying
 * multiple labeled progress bars (e.g., statuses, KPIs, metrics).
 *
 * - 100% data-driven
 * - Follows unified Eano widget system
 * - No children
 * - Flat props inside `data`
 */

import React from "react";
import { cn } from "@/eano/lib/utils";
import { ProgressSummarySkeleton, isDataValid } from "./skeletons";

export interface ProgressSummaryItem {
  /** Label shown on the left */
  label: string;

  /** Value in percentage (0-100) */
  value: number;

  /** Bar color */
  color?: string; // e.g. "bg-blue-500", "bg-red-500"
}

export interface ProgressSummaryWidgetData {
  /** Top title */
  title: string;

  /** Subtitle under the title */
  subtitle?: string;

  /** List of progress items */
  items: ProgressSummaryItem[];
}

interface ProgressSummaryWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ProgressSummaryWidgetData;
}

export function ProgressSummaryWidget({
  data,
  className,
  ...rest
}: ProgressSummaryWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <ProgressSummarySkeleton className={className} itemCount={data?.items?.length || 3} {...rest} />;
  }

  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col gap-4
        eano-widget
      `,
        className
      )}
      {...rest}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {data.title}
        </div>
        {data.subtitle && (
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
            {data.subtitle}
          </div>
        )}
      </div>

      {/* Progress list */}
      <div className="flex flex-col gap-5 overflow-auto hide-scrollbar">
        {data.items.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* Label + value */}
            <div className="flex justify-between">
              <span className="text-sm text-neutral-900 dark:text-neutral-300">
                {item.label}
              </span>
              <span className="text-sm text-neutral-800 dark:text-neutral-300">
                {item.value}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className={cn(
                  `
                  h-full transition-all duration-500
                `,
                  item.color ? item.color : "bg-primary"
                )}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
