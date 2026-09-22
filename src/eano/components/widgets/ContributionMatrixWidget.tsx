"use client";

/**
 * ContributionMatrixWidget
 *
 * A modern GitHub-like activity heatmap.
 * - Data-driven only (days[] with date+value)
 * - Uses primary color scale: bg-primary/20 → bg-primary
 * - Auto-aligns weeks (Mon → Sun)
 * - Dark & Light mode optimized
 * - Scrollable horizontally
 * - No children (flat widget system)
 */

import React from "react";
import { cn } from "@/eano/lib/utils";
import { ContributionMatrixSkeleton, isDataValid } from "./skeletons";

export interface ContributionMatrixDay {
  date: string; // ISO "YYYY-MM-DD"
  value: number; // activity level
}

export interface ContributionMatrixWidgetData {
  title: string;
  subtitle?: string;
  days: ContributionMatrixDay[];
  maxValue?: number;
}

interface ContributionMatrixWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ContributionMatrixWidgetData;
  onDayClick?: (day: ContributionMatrixDay) => void;
}

/** Helpers */
function cloneDate(d: Date) {
  return new Date(d.getTime());
}

function addDays(d: Date, days: number) {
  const copy = cloneDate(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function ContributionMatrixWidget({
  data,
  className,
  onDayClick,
  ...rest
}: ContributionMatrixWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <ContributionMatrixSkeleton className={className} {...rest} />;
  }

  const { days } = data;

  /** Map date → value */
  const valuesMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of days) map[d.date] = d.value;
    return map;
  }, [days]);

  /** Determine date range from data */
  const { startDate, endDate } = React.useMemo(() => {
    if (!days.length) {
      const today = new Date();
      return { startDate: today, endDate: today };
    }

    let min = new Date(days[0].date);
    let max = new Date(days[0].date);

    for (const d of days) {
      const date = new Date(d.date);
      if (date < min) min = date;
      if (date > max) max = date;
    }

    return { startDate: min, endDate: max };
  }, [days]);

  /** Align range to full weeks: Monday → Sunday */
  const aligned = React.useMemo(() => {
    const start = cloneDate(startDate);
    const end = cloneDate(endDate);

    while (start.getDay() !== 1) start.setDate(start.getDate() - 1);
    while (end.getDay() !== 0) end.setDate(end.getDate() + 1);

    return { start, end };
  }, [startDate, endDate]);

  /** Build matrix: weeks[] -> 7 days each */
  const weeks = React.useMemo(() => {
    const output: ContributionMatrixDay[][] = [];
    let current: ContributionMatrixDay[] = [];

    for (
      let d = cloneDate(aligned.start);
      d <= aligned.end;
      d = addDays(d, 1)
    ) {
      const id = iso(d);
      current.push({
        date: id,
        value: valuesMap[id] ?? 0,
      });

      if (current.length === 7) {
        output.push(current);
        current = [];
      }
    }

    if (current.length) output.push(current);
    return output;
  }, [aligned.start, aligned.end, valuesMap]);

  /** Calculate max value */
  const maxValue = data.maxValue ?? Math.max(1, ...days.map((d) => d.value));

  /** Primary-based Scale */
  const scale = [
    "bg-neutral-200/80 dark:bg-neutral-700/60", // 0
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
    "bg-primary",
  ];

  /** Map numeric value → color class */
  const getColor = (value: number) => {
    if (value <= 0) return scale[0];

    const levels = scale.length - 1;
    const ratio = Math.min(1, value / maxValue);
    const idx = Math.max(1, Math.ceil(ratio * levels));
    return scale[idx];
  };

  /** Month Labels */
  const monthLabels = React.useMemo(() => {
    const labels: { weekIndex: number; label: string }[] = [];

    weeks.forEach((week, wIndex) => {
      if (!week.length) return;

      const firstDay = new Date(week[0].date);
      const month = firstDay.toLocaleString("en", { month: "short" });

      if (!labels.length || labels[labels.length - 1].label !== month) {
        labels.push({ weekIndex: wIndex, label: month });
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div
      className={cn(
        `
        w-full h-full rounded-xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        p-4 flex flex-col justify-around shadow-sm dark:shadow-none
        overflow-hidden
        eano-widget
      `,
        className
      )}
      {...rest}
    >
      {/* Header */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {data.title}
        </div>
        {data.subtitle && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {data.subtitle}
          </div>
        )}
      </div>

      {/* Months row */}
      <div className="overflow-x-auto w-full">
        <div className="ml-8 flex justify-between mb-1 w-max">
          <div className="flex gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            {weeks.map((_, wIndex) => {
              const label = monthLabels.find((m) => m.weekIndex === wIndex);
              return (
                <div key={wIndex} className="w-2.5 flex justify-center">
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div className="flex flex-row">
          {/* Weekday labels */}
          <div className="flex flex-col text-[10px] text-neutral-500 dark:text-neutral-400 mr-2 h-full justify-evenly">
            <span className="h-2.5 leading-3 mt-1">Mon</span>
            <span className="h-2.5 leading-3 mt-3">Wed</span>
            <span className="h-2.5 leading-3 mt-3">Fri</span>
          </div>

          {/* Grid */}
          <div className="pb-2">
            <div className="flex gap-1">
              {weeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      onClick={onDayClick ? () => onDayClick(day) : undefined}
                      className={cn(
                        "w-3.5 h-3.5 rounded-[2px]! border border-neutral-800/25 transition p-0!",
                        getColor(day.value),
                        onDayClick && "hover:border-neutral-100/70"
                      )}
                      title={`${day.date} • ${day.value}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {scale.map((c, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-[1px] border border-neutral-800/40",
                c
              )}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
