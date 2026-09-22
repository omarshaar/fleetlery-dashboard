"use client";

/**
 * SummaryListWidget
 *
 * Generic list widget for recent items, logs, notifications, etc.
 * Supports scrolling inside the items area.
 *
 * Flat props – data-driven – no children.
 */

import React from "react";
import { cn } from "@/eano/lib/utils";
import { SummaryListSkeleton, isDataValid } from "./skeletons";

export interface SummaryListItem {
  id: string | number;
  title: string;
  meta?: string;
  icon?: React.ReactNode;
}

export interface SummaryListWidgetData {
  title: string;
  subtitle?: string;
  items: SummaryListItem[];
}

interface SummaryListWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: SummaryListWidgetData;
  onItemClick?: (id: SummaryListItem["id"]) => void;
}

export function SummaryListWidget({
  data,
  onItemClick,
  className,
  ...rest
}: SummaryListWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <SummaryListSkeleton className={className} itemCount={4} {...rest} />;
  }

  return (
    <div
      className={cn(
        `
        w-full h-full rounded-xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col
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
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {data.subtitle}
          </div>
        )}
      </div>

      {/* Scrollable Items */}
      <div className="flex flex-col gap-3 mt-1 overflow-auto pr-1 hide-scrollbar">
        {data.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={
              onItemClick ? () => onItemClick(item.id) : undefined
            }
            className={cn(
              `
              flex items-center gap-3 text-left
              w-full rounded-lg
              transition
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-primary/60 p-1! py-2!
            `,
              onItemClick &&
                "hover:bg-neutral-50 dark:hover:bg-neutral-800/70"
            )}
          >
            {/* Icon square */}
            <div
              className="
                h-9 w-9 rounded-lg
                border border-neutral-700/30
                flex items-center justify-center
                dark:text-neutral-100
                dark:bg-neutral-900
                bg-white shadow-sm
              "
            >
              <span className="text-sm">{item.icon}</span>
            </div>

            {/* Texts */}
            <div className="flex flex-col">
              <div className="text-sm text-neutral-800 dark:text-neutral-50">
                {item.title}
              </div>
              {item.meta && (
                <div className="text-xs text-neutral-400">
                  {item.meta}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
