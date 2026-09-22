"use client";

/**
 * PieDistributionWidget
 *
 * Pie chart distribution widget with labeled legend.
 * - Data-driven via `data` prop only
 * - Uses existing <PieChartLabelList /> component
 * - Custom legend (color dot + label + value)
 * - Supports all default DOM events
 * - Fully responsive inside any grid (uses h-full)
 */

import * as React from "react";
import PieChartLabelList from "../charts/PieChartLabelList";
import { PieDistributionSkeleton, isDataValid } from "./skeletons";

export interface PieDistributionSeries {
  /** Key in data objects (e.g. "chrome") */
  key: string;
  /** Legend label (e.g. "Chrome") */
  label: string;
  /** Color used in chart & legend */
  color: string;
}

export interface PieDistributionData {
  /** Widget title */
  title: string;

  /** Data array passed directly to the pie chart */
  data: Array<Record<string, string | number>>;

  /** Field used for value (e.g. visitors) */
  valueKey: string;

  /** Field used for category name (e.g. browser) */
  nameKey: string;

  /** Pie series mapping for legend and config */
  series: PieDistributionSeries[];
}

export interface PieDistributionWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PieDistributionData;
  chartSize?: number;
  showLegend?: boolean;
}

export function PieDistributionWidget({
  data,
  chartSize = 260,
  showLegend = true,
  className = "",
  ...rest
}: PieDistributionWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <PieDistributionSkeleton className={className} {...rest} />;
  }

  // Build config object for chart component
  const chartConfig = React.useMemo(() => {
    const base: Record<string, { label: string; color: string }> = {
      [data.valueKey]: { label: "Value", color: "#000000" },
    };

    data.series.forEach((s) => {
      base[s.key] = { label: s.label, color: s.color };
    });

    return base;
  }, [data.series, data.valueKey]);

  return (
    <div
      className={`
        w-full h-full
        rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4 flex flex-col
        eano-widget
        ${className}
      `}
      {...rest}
    >
      {/* Header: title + legend */}
      <div className="flex items-center justify-between mb-2 flex-wrap">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-full mb-2">
          {data.title}
        </p>

        {showLegend && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300 justify-end">
            {data.series.map((series) => (
              <div key={series.key} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                <span>{series.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center opacity-80">
        <PieChartLabelList
          data={data.data}
          config={chartConfig}
          valueKey={data.valueKey}
          nameKey={data.nameKey}
          chartSize={chartSize}
          showLegend={false} // legend handled by widget
        />
      </div>
    </div>
  );
}
