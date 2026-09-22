"use client";

/**
 * Widget Skeletons Library
 *
 * Provides skeleton loading states for all widgets.
 * Each skeleton maintains the exact dimensions and structure of its corresponding widget.
 *
 * Usage:
 * - StatMiniSkeleton, StatProgressSkeleton, ValueSummarySkeleton, etc.
 * - All accept className and rest props for customization
 */

import React from "react";
import { Skeleton } from "@/eano/design-system/shadcn/skeleton";
import { cn } from "@/eano/lib/utils";

// ========== Utility: Helper to check if data is valid ==========
export function isDataValid(data: any): boolean {
  return data !== null && data !== undefined;
}

// ========== StatMini Skeleton ==========
export function StatMiniSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col justify-between
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

// ========== StatProgress Skeleton ==========
export function StatProgressSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col justify-between gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div>
        
        <Skeleton className="h-3 w-40 mt-3" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full shrink-0" />
      </div>
    </div>
  );
}

// ========== ValueSummary Skeleton ==========
export function ValueSummarySkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <Skeleton className="h-4 w-32" />
      <div className="flex items-baseline gap-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

// ========== SummaryList Skeleton ==========
export function SummaryListSkeleton({
  className = "",
  itemCount = 4,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { itemCount?: number }) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div>
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== RadarWidget Skeleton ==========
export function RadarSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4 flex flex-col justify-center
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-3 mt-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-48 w-48 rounded-full" />
      </div>
    </div>
  );
}

// ========== PieDistribution Skeleton ==========
export function PieDistributionSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4 flex flex-col
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <Skeleton className="h-6 w-full mb-2" />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center flex-1 items-center">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
    </div>
  );
}

// ========== WeeklyTasks Skeleton ==========
export function WeeklyTasksSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-6 pt-2 justify-evenly">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center flex-1">
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-3 flex-1 mt-4">
        <Skeleton className="h-14 w-full rounded-lg shrink-0" />
        <Skeleton className="h-14 w-full rounded-lg shrink-0" />
      </div>
    </div>
  );
}

// ========== ClockPreview Skeleton ==========
export function ClockPreviewSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col justify-center items-center gap-3
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <Skeleton className="h-12 w-28" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

// ========== RotaryDial Skeleton ==========
export function RotaryDialSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col justify-center items-center gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

// ========== SmartToggle Skeleton ==========
export function SmartToggleSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col justify-between
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div className="flex justify-between items-start">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-3 w-20 mb-1" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

// ========== ProgressSummary Skeleton ==========
export function ProgressSummarySkeleton({
  className = "",
  itemCount = 3,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { itemCount?: number }) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-5 flex flex-col gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div>
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-3 flex-1">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between mb-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== ContributionMatrix Skeleton ==========
export function ContributionMatrixSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        p-4 flex flex-col gap-4
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div>
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="flex gap-1 overflow-hidden pb-2">
        {Array.from({ length: 45 }).map((_, week) => (
          <div key={week} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, day) => (
              <Skeleton key={`${week}-${day}`} className="h-5 w-4 rounded-sm" />
           ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== ChartWidgetContainer Skeleton ==========
export function ChartContainerSkeleton({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        pt-4 flex flex-col
        overflow-hidden
      `,
        className
      )}
      {...rest}
    >
      <div className="flex items-start justify-between gap-4 mb-4 px-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="flex-1 px-4 flex items-center justify-center">
        <div className="w-full space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-neutral-700 mt-4 px-4 py-3">
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}
