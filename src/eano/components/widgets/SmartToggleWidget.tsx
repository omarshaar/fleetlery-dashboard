"use client";

/**
 * SmartToggleWidget (with external icon + correct iOS switch)
 *
 * Same architecture pattern as ValueSummaryWidget:
 * - Flat props
 * - Data-driven
 * - No children
 * - No external wrapper components
 */

import React from "react";
import { cn } from "@/eano/lib/utils";
import { SmartToggleSkeleton, isDataValid } from "./skeletons";

export interface SmartToggleWidgetData {
    /** Small label (e.g., brand or room) */
    subtitle: string;

    /** Main device name */
    title: string;

    /** Custom icon element shown in top-left */
    icon?: React.ReactNode;

    /** Switch state */
    state: boolean;

    /** Called when switch toggles */
    onChange: (newState: boolean) => void;
}

interface SmartToggleWidgetProps
    extends React.HTMLAttributes<HTMLDivElement> {
    data: SmartToggleWidgetData;
}

export function SmartToggleWidget({
    data,
    className,
    ...rest
}: SmartToggleWidgetProps) {
    // Show skeleton if data is invalid
    if (!isDataValid(data)) {
        return <SmartToggleSkeleton className={className} {...rest} />;
    }

    return (
        <div
            className={cn(
                `
        w-full h-full rounded-2xl
        bg-white dark:bg-black
        p-5 flex flex-col justify-between
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        overflow-hidden
        eano-widget
      `,
                className
            )}
            {...rest}
        >
            {/* Top Row */}
            <div className="flex justify-between items-start">
                {/* User Icon */}
                <div className="h-7 w-7 flex items-center justify-center">
                    {data.icon && (
                        <div className="dark:bg-neutral-700 p-1.5 rounded-md">
                            {data.icon}
                        </div>
                    )}
                </div>

                {/* iOS Switch */}
                {/* iOS Switch */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        data.onChange(!data.state);
                    }}
                    className={cn(
                        `
            relative inline-flex items-center
            h-4 w-11 rounded-full transition-colors duration-200 ease-out
        `,
                        data.state
                            ? "bg-primary"
                            : "bg-neutral-400 dark:bg-neutral-600"
                    )}
                >
                    <span
                        className={cn(
                            `
            absolute rounded-full bg-white shadow
            w-4 h-4 transition-all duration-200 ease-out
            `,
                            data.state
                                ? "-translate-x-4"
                                : "translate-x-1.5"
                        )}
                    />

                    <span className="absolute h-2/3 w-px bg-white" style={{ left: "50%" }}></span>
                </button>

            </div>

            {/* Bottom Info */}
            <div className="pt-6 mt-auto">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {data.subtitle}
                </div>

                <div className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">
                    {data.title}
                </div>
            </div>
        </div>
    );
}
