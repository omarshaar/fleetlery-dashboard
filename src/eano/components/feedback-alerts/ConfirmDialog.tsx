/**
 * @file ConfirmDialog.tsx
 * @description Unified, single-API wrapper around shadcn AlertDialog primitives.
 * Consumers use a single component with simple props (no subcomponents).
 */

import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/eano/design-system/shadcn/alert-dialog";
import { cn } from "@/eano/lib/utils";

export type ConfirmDialogProps = {
  /** Trigger element shown in the page (e.g., a Button) */
  trigger: React.ReactNode;

  /** Dialog title and description */
  title: React.ReactNode;
  description?: React.ReactNode;

  /** Buttons labeling */
  actionLabel?: React.ReactNode;   // default: "Continue"
  cancelLabel?: React.ReactNode;   // default: "Cancel"

  /** Visual hint: marks the action as destructive (red emphasis) */
  destructive?: boolean;

  /** Controlled open state (optional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled initial open state (optional) */
  defaultOpen?: boolean;

  /** Called when user confirms */
  onConfirm?: () => void;

  /** Called when user cancels/close */
  onCancel?: () => void;

  /** Extra class for the content container */
  className?: string;
};

/**
 * A single, ready-to-use confirm dialog with consistent API.
 * Accessibility: uses shadcn/Radix semantics under the hood.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  actionLabel = "Continue",
  cancelLabel = "Cancel",
  destructive = false,
  open,
  onOpenChange,
  defaultOpen,
  onConfirm,
  onCancel,
  className,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(!!defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? (open as boolean) : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    // close if uncontrolled
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  };

  return (
    <AlertDialog open={currentOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              destructive &&
                "bg-primary text-white! text-destructive-foreground"
            )}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
