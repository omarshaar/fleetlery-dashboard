/**
 * @file Sheet.tsx
 * @description Unified Sheet (side/bottom drawer) with a single, simple API.
 * Consumers use one component (no subcomponents).
 */

import * as React from "react";
import {
  Sheet as ShadcnSheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/eano/design-system/shadcn/sheet";
import { cn } from "@/eano/lib/utils";

type CssSize = number | string;
type SheetSide = "left" | "right" | "top" | "bottom";
type SheetSize = "sm" | "md" | "lg" | CssSize;

export type SheetProps = {
  /** Trigger element (e.g., a Button) */
  trigger: React.ReactNode;

  /** Heading and supporting text */
  title?: React.ReactNode;
  description?: React.ReactNode;

  /** Which side to open from (default: right) */
  side?: SheetSide;

  /** Size preset or custom CSS size:
   * - number -> px, string -> any CSS size
   * - presets: sm, md, lg
   */
  size?: SheetSize;

  /** Main content (body) */
  children?: React.ReactNode;

  /** Optional footer (e.g., action buttons). If omitted, footer is hidden. */
  footer?: React.ReactNode;

  /** Controlled state (optional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled initial state */
  defaultOpen?: boolean;

  /** Root content class (SheetContent) */
  className?: string;
  /** Inner wrapper class (inside SheetContent) */
  innerClassName?: string;

  /** Accessible label for close button (visually hidden) */
  closeLabel?: React.ReactNode;
};

function toCss(v?: CssSize) {
  if (v == null) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

function resolveSize(side: SheetSide, size?: SheetSize) {
  if (size == null) return undefined;
  const preset =
    size === "sm" ? 320 :
    size === "md" ? 420 :
    size === "lg" ? 560 :
    size;

  if (side === "left" || side === "right") {
    return { width: toCss(preset) };
  }
  return { height: toCss(preset) };
}

/**
 * Single, ready-to-use Sheet component.
 * - Supports side + size
 * - Controlled/uncontrolled
 * - Optional header/description/footer
 */
export function Sheet({
  trigger,
  title,
  description,
  side = "right",
  size = "md",
  children,
  footer,
  open,
  onOpenChange,
  defaultOpen,
  className,
  innerClassName,
  closeLabel = "Close",
}: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(!!defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const dimStyle = resolveSize(side, size);

  return (
    <ShadcnSheet open={currentOpen} onOpenChange={handleChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent side={side} className={cn("gap-0 p-0", className)} style={dimStyle}>
        <div className={cn("mx-auto w-full", innerClassName)}>
          {(title || description) && (
            <SheetHeader className="px-0 py-2">
              {title ? <SheetTitle>{title}</SheetTitle> : null}
              {description ? <SheetDescription>{description}</SheetDescription> : null}
            </SheetHeader>
          )}

          {children ? <div className="py-2 overflow-auto no-scrollbar relative">{children}</div> : null}

          {footer ? (
            <SheetFooter className="px-0 py-2">
              {footer}
              <SheetClose className="sr-only">{closeLabel}</SheetClose>
            </SheetFooter>
          ) : null}
        </div>
      </SheetContent>
    </ShadcnSheet>
  );
}
