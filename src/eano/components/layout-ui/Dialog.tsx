/**
 * @file Dialog.tsx
 * @description Unified Dialog (modal) with a single, simple API.
 * Internally wraps shadcn primitives; consumers don't import subcomponents.
 */

import * as React from "react";
import {
  Dialog as ShadcnDialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/eano/design-system/shadcn/dialog";
import { cn } from "@/eano/lib/utils";

type CssSize = number | string;
type DialogSize = "sm" | "md" | "lg" | CssSize;

export type DialogProps = {
  /** Button/Icon/etc. that opens the dialog */
  trigger: React.ReactNode;

  /** Header text */
  title?: React.ReactNode;

  /**
   * Accessibility-only title (screen readers).
   * Use this when you don't want a visible title, but still want DialogContent
   * to have a proper DialogTitle.
   */
  a11yTitle?: React.ReactNode;

  /** Subtext under the title */
  description?: React.ReactNode;

  /** Main body content */
  children?: React.ReactNode;

  /** Optional footer (e.g., action buttons) */
  footer?: React.ReactNode;

  /** Width presets or custom CSS size (applies to content maxWidth) */
  size?: DialogSize;

  /** Controlled open state (optional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled initial state */
  defaultOpen?: boolean;

  /** Extra classes */
  className?: string;        // applied on DialogContent
  innerClassName?: string;   // wrapper inside content

  /** a11y: hidden close label (kept for screen readers) */
  closeLabel?: React.ReactNode;

  /** Hide the default "X" close icon */
  hideXIcon?: boolean;
};

function toCss(v?: CssSize) {
  if (v == null) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

function resolveMaxWidth(size?: DialogSize) {
  if (!size) return undefined;
  const preset =
    size === "sm" ? "24rem" :  // ~384px
    size === "md" ? "32rem" :  // ~512px
    size === "lg" ? "42rem" :  // ~672px
    size === "xl" ? "56rem" :  // ~896px
    size === "full" ? "96%" :  // full width
    size;
  return { maxWidth: toCss(preset) };
}

/**
 * Single, ready-to-use Dialog component.
 * - Controlled/uncontrolled
 * - Title/Description/Header handled internally
 * - Optional Footer slot
 */
export function Dialog({
  trigger,
  title,
  a11yTitle,
  description,
  children,
  footer,
  size = "md",
  open,
  onOpenChange,
  defaultOpen,
  className,
  hideXIcon = false,
  innerClassName,
  closeLabel = "Close",
}: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const dimStyle = resolveMaxWidth(size);
  const srTitle = title ?? a11yTitle ?? "Dialog";

  return (
    <ShadcnDialog open={currentOpen} onOpenChange={handleChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent  className={cn("gap-0 p-0", className)} style={dimStyle} hideXIcon={hideXIcon}>
        <div className={cn("w-full px-4 py-3", innerClassName)}>
          {title || description ? (
            <DialogHeader className="px-0 py-2">
              {title ? (
                <DialogTitle>{title}</DialogTitle>
              ) : (
                <DialogTitle className="sr-only">{srTitle}</DialogTitle>
              )}
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>
          ) : (
            <DialogHeader className="sr-only">
              <DialogTitle>{srTitle}</DialogTitle>
            </DialogHeader>
          )}

          {children ? <div>{children}</div> : null}

          {footer ? (
            <DialogFooter className="px-0 py-2">
              {footer}
              <DialogClose className="sr-only">{closeLabel}</DialogClose>
            </DialogFooter>
          ) : null}
        </div>
      </DialogContent>
    </ShadcnDialog>
  );
}
