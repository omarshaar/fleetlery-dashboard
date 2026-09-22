"use client";

/**
 * ChartWidgetContainer
 *
 * A unified container for all chart-based widgets.
 *
 * Features:
 * - Title
 * - Optional description
 * - Optional actions (right side)
 * - Optional footer
 * - Responsive layout
 * - Dark mode ready
 * - Fully compatible with any chart passed as children
 */

import * as React from "react";
import { ChartContainerSkeleton, isDataValid } from "./skeletons";

export interface ChartWidgetContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: string;
  children: React.ReactNode;
}

export function ChartWidgetContainer({
  title,
  description,
  actions,
  footer,
  children,
  className = "",
  ...rest
}: ChartWidgetContainerProps) {
  // Show skeleton if title is invalid (indicating missing data)
  if (!isDataValid(title)) {
    return <ChartContainerSkeleton className={className} {...rest} />;
  }
  const hasFooter = Boolean(footer);
  const hasActions = Boolean(actions);

  return (
    <div
      className={`
        w-full h-full
        rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        pt-4 flex flex-col
        eano-widget
        ${className}
      `}
      {...rest}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-2 px-4">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </p>

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {hasActions && <div>{actions}</div>}
      </div>

      {/* CHART SLOT */}
      <div className="flex-1 flex items-center justify-center px-2">
        {children}
      </div>

      {/* FOOTER */}
      {hasFooter && (
        <div
          className="
            mt-3
            border-t border-gray-200 dark:border-neutral-700
            bg-gray-50 dark:bg-neutral-900/60
            text-sm text-gray-700 dark:text-gray-300
            px-4 py-2 rounded-b-2xl
          "
        >
          {footer}
        </div>
      )}
    </div>
  );
}
