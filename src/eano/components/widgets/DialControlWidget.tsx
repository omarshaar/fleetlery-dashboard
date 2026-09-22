"use client";

/**
 * RotaryDialWidget
 *
 * Fully corrected rotary dial:
 * - Perfect rotation around true center
 * - Accurate tick rotation using <g transform="rotate(...)">
 * - Mouse + Touch drag up/down changes value
 * - Data-driven (min, max, value, step...)
 * - No children, unified widget architecture
 */

import React from "react";
import { cn } from "@/eano/lib/utils";
import { RotaryDialSkeleton, isDataValid } from "./skeletons";

export interface RotaryDialWidgetData {
  min: number;
  max: number;
  value: number;
  step?: number;
  title?: string;
  subtitle?: string;
  unitLabel?: string;
  precision?: number;
}

interface RotaryDialWidgetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  data: RotaryDialWidgetData;
  onValueChange?: (value: number) => void;
}

type DragState = {
  startY: number;
  startValue: number;
} | null;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function RotaryDialWidget({
  data,
  onValueChange,
  className,
  ...rest
}: RotaryDialWidgetProps) {
  // Show skeleton if data is invalid
  if (!isDataValid(data)) {
    return <RotaryDialSkeleton className={className} {...rest} />;
  }

  const { min, max } = data;
  const step = data.step ?? 1;
  const precision = data.precision ?? (step < 1 ? 1 : 0);

  const range = Math.max(1, max - min);

  const [dragState, setDragState] = React.useState<DragState>(null);
  const savedBodyPadding = React.useRef<{ left?: string; right?: string } | null>(null);

  // ratio 0→1
  const ratio = (data.value - min) / range;

  // angle from -120° to +120° (span = 240°)
  const dialAngle = -120 + ratio * 240;

  /** Start drag */
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    // prevent selection/scroll during drag and keep page width stable
    document.body.style.userSelect = "none";

    // Save inline paddings so we can restore them later
    savedBodyPadding.current = {
      left: document.body.style.paddingLeft,
      right: document.body.style.paddingRight,
    };

    // Calculate browser scrollbar width (works for most modern browsers)
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    // Apply padding to the side where scrollbar would be to avoid layout shift on overflow hidden
    if (scrollbarWidth > 0) {
      // read computed direction (ltr/rtl)
      const dir = (getComputedStyle(document.documentElement).direction || "ltr").toLowerCase();

      if (dir === "rtl") {
        // compute existing computed padding-left and set inline style accordingly
        const currentPaddingLeft = parseFloat(getComputedStyle(document.body).paddingLeft) || 0;
        document.body.style.paddingLeft = `${currentPaddingLeft + scrollbarWidth}px`;
      } else {
        const currentPaddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
      }
    }

    // Hide overflow after we set padding so width stays the same
    document.body.style.overflow = "hidden";

    setDragState({
      startY: clientY,
      startValue: data.value,
    });
  };

  /** Drag behavior */
  React.useEffect(() => {
    if (!dragState) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaY = clientY - dragState.startY;

      // sensitivity: full 300px drag = full range
      const sensitivity = range / 300;
      const raw = dragState.startValue + deltaY * sensitivity;

      const snapped = Math.round(raw / step) * step;

      const nextValue = clamp(snapped, min, max);

      if (onValueChange) onValueChange(nextValue);

      if ("preventDefault" in e) e.preventDefault();
    };

    const end = () => {
      setDragState(null);
      document.body.style.userSelect = "";
      document.body.style.overflow = "";

      // restore any inline paddings previously saved
      if (savedBodyPadding.current) {
        if (typeof savedBodyPadding.current.left !== "undefined") {
          document.body.style.paddingLeft = savedBodyPadding.current.left;
        } else {
          // ensure we clear the inline style if there was none before
          document.body.style.paddingLeft = "";
        }

        if (typeof savedBodyPadding.current.right !== "undefined") {
          document.body.style.paddingRight = savedBodyPadding.current.right;
        } else {
          document.body.style.paddingRight = "";
        }
      } else {
        // fallback to clearing if nothing saved
        document.body.style.paddingLeft = "";
        document.body.style.paddingRight = "";
      }
      savedBodyPadding.current = null;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchmove", handleMove, {
      passive: false,
    });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
    };
  }, [dragState, range, step, min, max, onValueChange]);

  const displayValue = data.value.toFixed(precision);

  return (
    <div
      style={{direction: "ltr"}}
      className={cn(
        `items-center
        overflow-hidden
        w-full h-full rounded-xl
        bg-white dark:bg-black
        p-0 flex flex-row justify-center
        border border-gray-200 dark:border-neutral-700
        shadow-sm dark:shadow-none
        eano-widget
      `,
        className
      )}
      {...rest}
    >
      {/* LEFT — ROTARY DIAL */}
      <div className="relative -left-20">
        <div
          className={`
            relative w-48 h-48 rounded-full
            bg-linear-to-br from-primary/40 to-primary/20 dark:from-primary/85
            flex items-center justify-center
            cursor-pointer select-none
          `}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {/* Black inner circle */}
          <div className="absolute inset-6 rounded-full bg-black/75 shadow-inner" />

          {/* ===== FIXED AND CORRECT ROTATING TICKS RING ===== */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotate(${dialAngle}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <svg
              width="300"
              height="300"
              viewBox="0 0 200 200"
              className="absolute"
            >
              {Array.from({ length: 60 }).map((_, i) => {
                const isMajor = i % 5 === 0;
                return (
                  <g key={i} transform={`rotate(${i * 6}, 100, 100)`}>
                    <line
                      x1="100"
                      y1="14"
                      x2="100"
                      y2={isMajor ? 34 : 24}
                      className="dark:stroke-white stroke-black"
                      strokeWidth={isMajor ? 2 : 1}
                      opacity={isMajor ? 0.9 : 0.4}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* arc border accent */}
          <div
            className="
              absolute inset-5 rounded-full
              border-14 border-transparent
              border-l-primary-500 border-b-primary-500
              opacity-70
            "
          />

          {/* Center circular label */}
          <div
            className={`
            relative z-10 w-24 h-24 rounded-full
            dark:bg-black/95 bg-gray-900 border border-white/10
            flex flex-col items-center justify-center
          `}
          >
            <span className="text-sm text-neutral-100 dark:text-neutral-200">
              {data.unitLabel ?? ""}
            </span>
          </div>

          {/* Fixed pointer */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-20 bg-purple-400 rounded-full -translate-y-8" />
          </div>
        </div>
      </div>

      {/* RIGHT — VALUE DISPLAY */}
      <div className="flex flex-col justify-center items-center flex-1 gap-3 relative -left-3">
        {data.title && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{data.title}</div>
        )}

        <div>
          <span className="text-4xl font-semibold">{displayValue}</span>

          {data.unitLabel && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{data.unitLabel}</span>
          )}
        </div>

        {data.subtitle && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 text-center">{data.subtitle}</div>
        )}
      </div>
    </div>
  );
}
