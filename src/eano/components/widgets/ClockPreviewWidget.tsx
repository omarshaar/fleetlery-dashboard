"use client";

/**
 * ClockPreviewWidget (Auto-updating clock with timezone and 12/24 format)
 *
 * Fully data-driven:
 * - format: "12" | "24"
 * - timeZone?: string
 *
 * Auto updates every second (time + date).
 */

import React from "react";
import { cn } from "@/eano/lib/utils";
import { ClockPreviewSkeleton, isDataValid } from "./skeletons";

export interface ClockPreviewWidgetData {
  /** "12" or "24" */
  format: "12" | "24";

  /** Optional time zone (example: "Europe/Berlin") */
  timeZone?: string;
}

interface ClockPreviewWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: ClockPreviewWidgetData;
}

/** Add ordinal suffix to day numbers (1st, 2nd, 3rd, 4th...) */
function getDaySuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  const lastDigit = day % 10;
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}

export function ClockPreviewWidget({
  data,
  className,
  ...rest
}: ClockPreviewWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <ClockPreviewSkeleton className={className} {...rest} />;
  }

  const [now, setNow] = React.useState(new Date());

  /* Auto update every second */
  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* Extract time parts using Intl API */
  const timeParts = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: data.format === "12",
    timeZone: data.timeZone,
  }).formatToParts(now);

  let hourStr = "0";
  let minuteStr = "0";
  let secondStr = "0";

  timeParts.forEach((p) => {
    if (p.type === "hour") hourStr = p.value;
    if (p.type === "minute") minuteStr = p.value;
    if (p.type === "second") secondStr = p.value;
  });

  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  const second = parseInt(secondStr);

  /* Analog clock angles */
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  const secondAngle = second * 6;

  /* Text time output */
  let timeText = "";
  if (data.format === "12") {
    const suffix = hour >= 12 ? "pm" : "am";
    const h = ((hour + 11) % 12) + 1;
    timeText = `${h}:${minuteStr.padStart(2, "0")}${suffix}`;
  } else {
    timeText = `${hourStr}:${minuteStr.padStart(2, "0")}`;
  }

  /* Auto date (weekday, day, month) */
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: data.timeZone,
  }).formatToParts(now);

  let weekday = "";
  let day = "";
  let month = "";

  dateParts.forEach((p) => {
    if (p.type === "weekday") weekday = p.value;
    if (p.type === "day") day = p.value;
    if (p.type === "month") month = p.value;
  });

  const dayNumber = parseInt(day);
  const suffix = getDaySuffix(dayNumber);

  const dateText = `${weekday}, ${dayNumber}${suffix} ${month}`;

  return (
    <div
      className={cn(
        `
        w-full h-full rounded-xl
        bg-white dark:bg-black
        p-0 flex flex-row justify-center gap-2 
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        eano-widget
      `,
        className
      )}
      {...rest}
    >
      {/* Analog Clock */}
      <div className="flex items-center justify-center">
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          className="text-neutral-700 dark:text-neutral-300"
        >
          {/* Minute ticks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180);
            const x1 = 60 + Math.sin(angle) * 48;
            const y1 = 60 - Math.cos(angle) * 48;

            const x2 = 60 + Math.sin(angle) * (i % 5 === 0 ? 42 : 45);
            const y2 = 60 - Math.cos(angle) * (i % 5 === 0 ? 42 : 45);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
                opacity={i % 5 === 0 ? 0.9 : 0.5}
              />
            );
          })}

          {/* Hour hand */}
          <line
            x1="60"
            y1="60"
            x2={60 + Math.sin((hourAngle * Math.PI) / 180) * 28}
            y2={60 - Math.cos((hourAngle * Math.PI) / 180) * 28}
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <line
            x1="60"
            y1="60"
            x2={60 + Math.sin((minuteAngle * Math.PI) / 180) * 40}
            y2={60 - Math.cos((minuteAngle * Math.PI) / 180) * 40}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Second hand */}
          <line
            x1="60"
            y1="60"
            x2={60 + Math.sin((secondAngle * Math.PI) / 180) * 45}
            y2={60 - Math.cos((secondAngle * Math.PI) / 180) * 45}
            stroke="#6CA0FF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Center dot */}
          <circle cx="60" cy="60" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Time + Date */}
      <div className="flex p-5 h-full items-end">
        <div className="flex flex-col">
          <div className="text-xl font-semibold text-neutral-900 dark:text-white">
            {timeText}
          </div>

          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {dateText}
          </div>
        </div>
      </div>
    </div>
  );
}
