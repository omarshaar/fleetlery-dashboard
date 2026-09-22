/**
 * @file ScrollArea.tsx
 * @description Unified ScrollArea wrapper with a simple, consistent API.
 * Consumers don't need subcomponents or custom wrappers.
 */

import * as React from "react";
import { ScrollArea as ShadcnScrollArea } from "@/eano/design-system/shadcn/scroll-area";
import { cn } from "@/eano/lib/utils";

type CssSize = number | string;

export type ScrollAreaProps = {
  /** Optional ARIA label for accessibility */
  ariaLabel?: string;

  /** Fixed height (number = px or any CSS size string) */
  height?: CssSize;

  /** Fixed width (number = px or any CSS size string) */
  width?: CssSize;

  /** Max height constraint (number = px or any CSS size string) */
  maxHeight?: CssSize;

  /** Max width constraint (number = px or any CSS size string) */
  maxWidth?: CssSize;

  /** Adds border around the area */
  bordered?: boolean;

  /** Adds padding inside the scrollable area */
  padded?: boolean;

  /** Round corners (default true) */
  rounded?: boolean;

  /** Extra class names for the root */
  className?: string;

  /** Scrollable content */
  children?: React.ReactNode;

  /** Custom inline styles (merged) */
  style?: React.CSSProperties;
};

/**
 * A single, ready-to-use ScrollArea with opinionated defaults.
 * - Rounded corners on by default
 * - Optional border and padding flags
 * - Size helpers (height/width/maxHeight/maxWidth)
 */
export function ScrollArea({
  ariaLabel,
  height,
  width,
  maxHeight,
  maxWidth,
  bordered,
  padded,
  rounded = true,
  className,
  children,
  style,
}: ScrollAreaProps) {
  const sizeStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
    maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
  };

  return (
    <ShadcnScrollArea
      role="region"
      aria-label={ariaLabel}
      className={cn(
        rounded && "rounded-md",
        bordered && "border",
        padded && "p-4",
        className
      )}
      style={{ ...sizeStyle, ...style }}
    >
      {children}
    </ShadcnScrollArea>
  );
}
