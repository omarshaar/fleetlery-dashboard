"use client";

/**
 * StatProgressWidget
 *
 * Horizontal KPI widget with optional animated progress circle.
 * Supports:
 * - animated number (CountingNumber)
 * - animated circular progress
 * - dark mode
 * - click navigation via `navigateTo`
 * - all default DOM events (onClick, onMouseEnter, etc.)
 */

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { CountingNumber } from "@/eano/design-system/shadcn/counting-number";
import { useNavigate } from "react-router-dom";
import { StatProgressSkeleton, isDataValid } from "./skeletons";

export interface StatProgressData {
  title: string;
  growth: number;
  growthLabel?: string;
  progress: number; // 0–100
}

interface StatProgressWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StatProgressData;

  /** Enables animations */
  animated?: boolean;

  /** When provided, clicking the widget navigates to that path */
  navigateTo?: string;
}

export function StatProgressWidget({
  data,
  animated = false,
  navigateTo,
  onClick,
  className = "",
  ...rest
}: StatProgressWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <StatProgressSkeleton className={className} {...rest} />;
  }

  const growthPositive = data.growth >= 0;

  const navigate = useNavigate();

  /** handle click logic */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Call user onClick first if exists
    if (onClick) onClick(e);

    // If navigation prop exists → navigate
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  /** Circle geometry */
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  /** Animation values */
  const progressMotion = useMotionValue(0);
  const animatedProgress = useSpring(progressMotion, {
    stiffness: 80,
    damping: 20,
  });

  const strokeOffset = useTransform(animatedProgress, (v) => {
    const ratio = Math.min(Math.max(v, 0), 100) / 100;
    return circumference - ratio * circumference;
  });

  React.useEffect(() => {
    progressMotion.set(data.progress);
  }, [data.progress, progressMotion]);

  return (
    <div
      onClick={handleClick}
      className={`
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4 flex items-center justify-between
        transition-all
        eano-widget
        ${
          navigateTo
            ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900"
            : ""
        }
        ${className}
      `}
      {...rest}
    >
      {/* Left text */}
      <div className="flex flex-col justify-evenly h-full py-1">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {data.title}
        </div>

        <div className="flex items-center gap-1 text-sm">
          {growthPositive ? (
            <ArrowUpRight
              size={16}
              className="text-green-500 dark:text-green-400"
            />
          ) : (
            <ArrowDownRight
              size={16}
              className="text-red-500 dark:text-red-400"
            />
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

          {data.growthLabel && (
            <span className="text-gray-500 dark:text-gray-400">
              {data.growthLabel}
            </span>
          )}
        </div>
      </div>

      {/* Right: circular progress */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          {/* Update radius */}
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={46}
            strokeWidth="9"
            className="text-gray-200 dark:text-neutral-700"
            stroke="currentColor"
            fill="transparent"
          />

          <motion.circle
            cx="50"
            cy="50"
            r={46}
            strokeWidth="9"
            strokeLinecap="round"
            className="text-primary/80"
            stroke="currentColor"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 46}
            style={{
              strokeDashoffset: strokeOffset,
            }}
          />
        </svg>

        {/* Center number */}
        <span className="absolute text-base font-semibold text-gray-900 dark:text-gray-100">
          {animated ? (
            <>
              <CountingNumber number={data.progress} />%
            </>
          ) : (
            `${data.progress}%`
          )}
        </span>
      </div>
    </div>
  );
}
