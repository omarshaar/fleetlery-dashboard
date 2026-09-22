/**
 * @file HoverCard.tsx
 * @description Unified HoverCard with a single, simple API.
 * Internally wraps shadcn primitives; consumers don't import subcomponents.
 */

import * as React from "react";
import {
  HoverCard as ShadcnHoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/eano/design-system/shadcn/hover-card";
import { cn } from "@/eano/lib/utils";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

export type HoverCardProps = {
  /** The element that triggers the hover card (e.g., a Button) */
  trigger: React.ReactNode;

  /** The content shown on hover */
  children: React.ReactNode;

  /** Positioning */
  side?: Side;          // default: "top"
  align?: Align;        // default: "center"
  sideOffset?: number;  // default: 4
  collisionPadding?: number; // default: 4

  /** Open/close delays in milliseconds */
  openDelay?: number;   // default: 200
  closeDelay?: number;  // default: 100

  /** Controlled state (optional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Root/content classes */
  className?: string;        // applies to content
  triggerClassName?: string; // optional wrapper class for trigger
};

/**
 * Single, ready-to-use HoverCard.
 * - Supports controlled/uncontrolled mode via open/onOpenChange
 * - Configurable positioning & delays
 */
export function HoverCard({
  trigger,
  children,
  side = "top",
  align = "center",
  sideOffset = 4,
  collisionPadding = 4,
  openDelay = 200,
  closeDelay = 100,
  open,
  onOpenChange,
  className,
  triggerClassName,
}: HoverCardProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <ShadcnHoverCard
      openDelay={openDelay}
      closeDelay={closeDelay}
      open={currentOpen}
      onOpenChange={handleOpenChange}
    >
      <HoverCardTrigger asChild>
        <span className={cn("inline-flex", triggerClassName)}>{trigger}</span>
      </HoverCardTrigger>

      <HoverCardContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("w-64 p-3 text-sm", className)}
      >
        {children}
      </HoverCardContent>
    </ShadcnHoverCard>
  );
}
