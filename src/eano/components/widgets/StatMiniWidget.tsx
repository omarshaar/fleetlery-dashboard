"use client";

/**
 * StatMiniWidget
 *
 * Small KPI widget with optional animated number support.
 * Automatically extracts numeric values even when combined with symbols
 * like %, $, €, or thousand separators.
 *
 * Now supports:
 * - All React DOM events (onClick, onMouseEnter, ...)
 * - Navigation via `navigateTo`
 */

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { CountingNumber } from "@/eano/design-system/shadcn/counting-number";
import { useNavigate } from "react-router-dom";
import { StatMiniSkeleton, isDataValid } from "./skeletons";
import type { ReactNode } from "react";
import { cn } from "@/eano/lib/utils";

export interface StatMiniData {
  title: string;
  /** Optional icon to display near the title */
  icon?: ReactNode;
  value: number | string;
  growth?: number;
  subtitle?: string;
}

interface StatMiniWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StatMiniData;

  /** Enables animation on the numeric value */
  animated?: boolean;

  /** When provided, clicking the widget navigates to this path */
  navigateTo?: string;

  /** Custom class for the value text */
  valueClassName?: string;
}

export function StatMiniWidget({
  data,
  animated = false,
  navigateTo,
  onClick,
  className = "",
  valueClassName = "",
  ...rest
}: StatMiniWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <StatMiniSkeleton className={className} {...rest} />;
  }

  const navigate = useNavigate();
  const growthPositive = data.growth !== undefined && data.growth >= 0;

  /** -----------------------------
   * Numeric parsing logic
   * ------------------------------*/
  const parseValue = (value: string | number) => {
    if (typeof value === "number") {
      return {
        prefix: "",
        suffix: "",
        numeric: value,
        isNumeric: true,
      };
    }

    const raw = value.toString().trim();
    const match = raw.match(/-?\d[\d,.]*/);

    if (!match) {
      return { prefix: "", suffix: "", numeric: 0, isNumeric: false };
    }

    const numericStr = match[0];
    const numericValue = Number(numericStr.replace(/,/g, ""));

    const prefix = raw.startsWith(numericStr)
      ? ""
      : raw.replace(numericStr, "").trim().replace(/[0-9.,-]/g, "").slice(0, raw.indexOf(numericStr));

    const suffix = raw.endsWith(numericStr)
      ? ""
      : raw.split(numericStr)[1].trim();

    return {
      prefix,
      suffix,
      numeric: numericValue,
      isNumeric: !isNaN(numericValue),
    };
  };

  const parsed = parseValue(data.value);

  /** -----------------------------
   * Click handler (supports user click + navigation)
   * ------------------------------*/
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(e); // Run user click
    if (navigateTo) navigate(navigateTo); // Then navigate
  };

  return (
    <div
      onClick={handleClick}
      className={`
        w-full h-full rounded-2xl 
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4 flex flex-col justify-between
        transition-all
        eano-widget
        ${navigateTo ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900" : ""}
        ${className}
      `}
      {...rest}
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-3">
        <div className="text-gray-500 dark:text-gray-400">
          {data.title}
        </div>

        {data.icon && (
          <div className="shrink-0 rounded-xl border border-gray-200/80 dark:border-neutral-700/70 bg-white/60 dark:bg-neutral-950/30 p-2 text-gray-600 dark:text-gray-300 [&_svg]:h-5 [&_svg]:w-5">
            {data.icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className={cn("text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1", valueClassName)} >
        {animated && parsed.isNumeric ? (
          <>
            {parsed.prefix && <span>{parsed.prefix}</span>}
            <CountingNumber number={parsed.numeric} />
            {parsed.suffix && <span>{parsed.suffix}</span>}
          </>
        ) : (
          <>{data.value}</>
        )}
      </div>

      {/* Growth */}
      {data.growth !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {growthPositive ? (
            <ArrowUpRight size={16} className="text-green-500 dark:text-green-400" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500 dark:text-red-400" />
          )}

          <span
            className={
              growthPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {data.growth}%
          </span>

          {data.subtitle && (
            <span className="text-gray-500 dark:text-gray-400 ">
              {data.subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
