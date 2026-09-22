"use client";

/**
 * WeeklyTasksWidget (Simplified Version)
 *
 * A large dashboard widget that displays:
 * - Main title + section title
 * - Stats row (supports animated numbers)
 * - Scrollable tasks list
 *
 * Uses simplified data structure:
 *  stats[]  → value, label, animated, onClick
 *  tasks[]  → id, title, desc, avatar, actionIcon?, onActionClick?, onClick?
 *
 * Fully data-driven, supports dark mode, pure, clean, and reusable.
 */

import React from "react";
import { CountingNumber } from "@/eano/design-system/shadcn/counting-number";
import { Ellipsis } from "lucide-react";
import { cn } from "@/eano/lib/utils";
import { WeeklyTasksSkeleton, isDataValid } from "./skeletons";

export interface WeeklyTasksWidgetData {
  mainTitle: string;
  title: string;

  stats: Array<{
    value: number | string;
    label: string;
    animated?: boolean;
    onClick?: () => void;
  }>;

  tasks: Array<{
    id: string | number;
    title: string;
    desc?: string;
    avatar?: string;
    actionIcon?: React.ReactNode;
    onActionClick?: () => void;
    onClick?: () => void;
  }>;
}

interface WeeklyTasksWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: WeeklyTasksWidgetData;
}

export function WeeklyTasksWidget({
  data,
  className,
  ...rest
}: WeeklyTasksWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <WeeklyTasksSkeleton className={className} {...rest} />;
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
      {/* Main Title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {data.mainTitle}
      </h2>

      {/* Section Title */}
      <div className="text-gray-500 dark:text-gray-400 text-sm">
        {data.title}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 pt-2 justify-evenly">
        {data.stats.map((s, idx) => (
          <div
            key={idx}
            onClick={s.onClick}
            className="
              flex flex-col cursor-pointer 
              hover:opacity-80 transition
            "
          >
            {/* Value */}
            <div className="text-5xl font-semibold text-primary flex justify-center">
              {s.animated && typeof s.value === "number" ? (
                <CountingNumber number={s.value} />
              ) : (
                s.value
              )}
            </div>

            {/* Label */}
            <div className="text-xs text-gray-500 dark:text-gray-400 ">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* TASKS LIST */}
      <div className="flex-1 overflow-y-auto pr-1 mt-1 flex flex-col gap-3 hide-scrollbar">
        {data.tasks.map((t) => (
          <div
            key={t.id}
            onClick={t.onClick}
            className="
              flex items-center justify-between
              bg-gray-50 dark:bg-neutral-900
              border border-border dark:border-border
              rounded-xl p-3 cursor-pointer
              hover:bg-gray-100 dark:hover:bg-neutral-800
              transition
            "
          >
            {/* Left side: avatar + title + desc */}
            <div className="flex items-start gap-3">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.title}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <></>
              )}

              <div className="flex flex-col">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {t.title}
                </div>

                {t.desc && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t.desc}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: action button (if exists) */}
            {t.onActionClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  t.onActionClick?.();
                }}
                className="
                  p-2 rounded-full
                  hover:bg-gray-200 dark:hover:bg-neutral-700
                  transition
                "
              >
                {t.actionIcon ? t.actionIcon : <Ellipsis size={16} />}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
