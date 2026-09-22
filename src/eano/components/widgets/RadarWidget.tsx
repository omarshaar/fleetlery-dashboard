"use client";

/**
 * RadarWidget
 *
 * Radar comparison widget for average salary per role/team.
 * - Data-driven via `data` prop only
 * - Uses existing <RadarChartLinesOnly /> chart component
 * - Custom legend (dots + labels) like the reference design
 * - Supports all standard DOM events via ...rest
 * - Uses h-full and is fully controlled by outer grid/container
 */

import * as React from "react";
import RadarChartLinesOnly from "../charts/RadarChartLinesOnly";
import { RadarSkeleton, isDataValid } from "./skeletons";

export interface RadarSeries {
  /** Series key used in chart data (e.g. "alpha", "beta") */
  key: string;
  /** Legend label (e.g. Team "Alpha") */
  label: string;
  /** Optional color for the series (CSS color or CSS var). If omitted, falls back to var(--chart-n) */
  color?: string;
}

export interface RadarData {
  /** Widget title (e.g. "Avg. salary") */
  title: string;

  /** Key for x-axis / category field (e.g. "role") */
  xKey: string;

  /** Roles/categories data passed directly to the chart */
  data: Array<Record<string, string | number>>;

  /** Series definitions used for config + legend */
  series: RadarSeries[];
}

export interface RadarWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** All widget content data */
  data: RadarData;

  /** Optional chart size in px (width/height of the radar chart area) */
  chartSize?: number;

  /** Show / hide legend (default: true) */
  showLegend?: boolean;
}

export function RadarWidget({
  data,
  chartSize = 260,
  showLegend = true,
  className = "",
  ...rest
}: RadarWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <RadarSkeleton className={className} {...rest} />;
  }

  // Build chart config object from series (flat shape, but mapped internally)
  const chartConfig = React.useMemo(() => {
    const base: Record<string, { label: string; color: string }> = {};
    data.series.forEach((series, index) => {
      base[series.key] = {
        label: series.label,
        color: series.color ?? `var(--chart-${index + 1})`,
      };
    });
    return base;
  }, [data.series]);

  const seriesKeys = React.useMemo(
    () => data.series.map((s) => s.key),
    [data.series]
  );

  return (
    <div
      className={`
        w-full h-full
        rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4
        flex flex-col justify-center
        eano-widget
        ${className}
      `}
      {...rest}
    >
      {/* Header: Title + Legend */}
      <div className="flex items-center justify-between mb-4 flex-wrap ">
        <p className="font-semibold text-gray-900 dark:text-gray-50 mb-2 text-lg">
          {data.title}
        </p>

        {showLegend && (
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            {data.series.map((series, index) => (
              <div key={series.key} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    // Use series.color if provided, otherwise use var(--chart-n)
                    backgroundColor:
                      series.color ?? `var(--chart-${index + 1})`,
                  }}
                />
                <span>{series.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        <RadarChartLinesOnly
          data={data.data}
          config={chartConfig}
          xKey={data.xKey}
          seriesKeys={seriesKeys}
          chartSize={chartSize}
          showLegend={false}
        />
      </div>
    </div>
  );
}
