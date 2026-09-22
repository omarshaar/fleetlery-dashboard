/**
 * @file Accordion.tsx
 * @description Unified Accordion component (single API) wrapping shadcn primitives.
 * - One component for consumers (no subcomponents).
 * - Supports single/multiple, controlled/uncontrolled.
 */

import * as React from "react";
import {
  Accordion as ShadcnAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/eano/design-system/shadcn/accordion";
import { cn } from "@/eano/lib/utils";

export type AccordionItemData = {
  /** Optional stable value key (auto-generated if omitted) */
  value?: string;
  /** Header content shown in the trigger */
  title: React.ReactNode;
  /** Body content shown when open */
  content: React.ReactNode;
  /** Optional class for this specific item */
  className?: string;
};

export type AccordionProps = {
  /** Accordion behavior: single (radio-like) or multiple */
  type?: "single" | "multiple";
  /** Allow collapsing the open item (relevant for type="single") */
  collapsible?: boolean;
  /** Items to render */
  items: AccordionItemData[];

  /** Uncontrolled initial value(s) */
  defaultValue?: string | string[];
  /** Controlled value(s) */
  value?: string | string[];
  /** Change handler for controlled mode */
  onValueChange?: (value: string | string[]) => void;

  /** Styling helpers */
  bordered?: boolean;
  padded?: boolean;
  className?: string;
  /** Classes for nested elements */
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

/**
 * A single, ready-to-use Accordion that:
 * - Supports single/multiple modes
 * - Works in controlled/uncontrolled ways
 * - Adds consistent styles and an optional chevron icon
 */
export function Accordion({
  type = "single",
  collapsible = true,
  items,
  defaultValue,
  value,
  onValueChange,
  bordered,
  padded,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}: AccordionProps) {
  const autoId = React.useId();
  const values = items.map((it, i) => it.value ?? `${autoId}-${i}`);

  return (
    <ShadcnAccordion
      type={type}
      collapsible={collapsible}
      defaultValue={defaultValue as any}
      value={value as any}
      onValueChange={onValueChange as any}
      className={cn(
        "w-full",
        bordered && "rounded-md border",
        padded && "p-2",
        className
      )}
    >
      {items.map((item, i) => {
        const v = values[i];
        return (
          <AccordionItem
            key={v}
            value={v}
            className={cn("border-b last:border-b-0", itemClassName, item.className)}
          >
            <AccordionTrigger
              className={cn(
                "flex items-center justify-between gap-2 py-2 text-sm font-medium transition hover:no-underline",
                triggerClassName
              )}
            >
              <span className="text-foreground/90">{item.title}</span>
            </AccordionTrigger>

            <AccordionContent
              className={cn(
                "text-sm text-foreground/80 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                padded && "px-1 pb-2",
                contentClassName
              )}
            >
              {item.content}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </ShadcnAccordion>
  );
}
