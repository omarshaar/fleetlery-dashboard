/**
 * @file Drawer.tsx
 * @description Unified Drawer (bottom sheet) with a simple API.
 * Note: DrawerContent does NOT accept `side`. Use Sheet for left/right/top.
 */

import * as React from "react";
import {
  Drawer as ShadcnDrawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/eano/design-system/shadcn/drawer";
import { cn } from "@/eano/lib/utils";

type CssSize = number | string;

export type DrawerProps = {
  /** Trigger element (e.g., a Button) */
  trigger: React.ReactNode;

  /** Heading and supporting text */
  title?: React.ReactNode;
  description?: React.ReactNode;

  /** Body content */
  children?: React.ReactNode;

  /** Optional footer (e.g., actions) */
  footer?: React.ReactNode;

  /** Controlled state (optional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled initial state */
  defaultOpen?: boolean;

  /** Max width of the inner container (e.g., 480, "28rem", "640px") */
  maxWidth?: CssSize;

  /** Root content class (DrawerContent) */
  className?: string;
  /** Inner container class (wrapper inside DrawerContent) */
  innerClassName?: string;

  /** Accessible label for close button (visually hidden) */
  closeLabel?: React.ReactNode;
};

function toCssSize(v?: CssSize) {
  if (v == null) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

/**
 * Bottom-sheet Drawer:
 * - No `side` prop (use Sheet for side drawers).
 * - Centers inner content with configurable `maxWidth`.
 */
export function Drawer({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  defaultOpen,
  maxWidth = 560,
  className,
  innerClassName,
  closeLabel = "Close",
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(!!defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <ShadcnDrawer open={currentOpen} onOpenChange={handleChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className={cn("gap-0 p-0", className)}>
        <div
          className={cn("mx-auto w-full px-4 py-3", innerClassName)}
          style={{ maxWidth: toCssSize(maxWidth) }}
        >
          {(title || description) && (
            <DrawerHeader className="px-0 py-2">
              {title ? <DrawerTitle>{title}</DrawerTitle> : null}
              {description ? <DrawerDescription>{description}</DrawerDescription> : null}
            </DrawerHeader>
          )}

          {children ? <div className="py-2">{children}</div> : null}

          {footer ? (
            <DrawerFooter className="px-0 py-2">
              {footer}
              <DrawerClose className="sr-only">{closeLabel}</DrawerClose>
            </DrawerFooter>
          ) : null}
        </div>
      </DrawerContent>
    </ShadcnDrawer>
  );
}
