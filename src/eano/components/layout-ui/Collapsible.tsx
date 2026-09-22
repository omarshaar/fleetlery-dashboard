/**
 * @file Collapsible.tsx
 * @description Unified Collapsible component with a single, simple API.
 * Wraps shadcn primitives internally (Trigger, Content).
 */

import * as React from "react";
import {
  Collapsible as ShadcnCollapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/eano/design-system/shadcn/collapsible";
import { cn } from "@/eano/lib/utils";
import { ChevronDown } from "lucide-react";

export type CollapsibleProps = {
  /** Trigger label or React node (e.g., button, text, etc.) */
  trigger: React.ReactNode;

  /** Collapsible inner content */
  children: React.ReactNode;

  /** Initially open (uncontrolled) */
  defaultOpen?: boolean;

  /** Controlled open state */
  open?: boolean;

  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;

  /** Adds border and padding for layout */
  bordered?: boolean;
  padded?: boolean;

  /** Adds toggle icon automatically */
  withIcon?: boolean;

  /** Custom class name */
  className?: string;
};

/**
 * A single, ready-to-use Collapsible component.
 * - Handles open/close state internally (or controlled)
 * - Optionally adds icon and border/padding
 */
export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  bordered,
  padded,
  withIcon = true,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? open : internalOpen;

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <ShadcnCollapsible open={currentOpen} onOpenChange={handleChange}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-medium transition hover:bg-muted/70",
            bordered && "border",
            className
          )}
        >
          <span>{trigger}</span>
          {withIcon && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                currentOpen && "rotate-180"
              )}
            />
          )}
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={cn(
          bordered && "border-t",
          padded && "p-3",
          "text-sm text-foreground/80"
        )}
      >
        {children}
      </CollapsibleContent>
    </ShadcnCollapsible>
  );
}
