// Popover.tsx
import React from "react"
import {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
} from "@/eano/design-system/shadcn/popover"
import { cn } from "@/eano/lib/utils"

/**
 * Single-component Popover with a simple API:
 *
 * <Popover content={<div>Panel</div>}>
 *   <Button>Open</Button>
 * </Popover>
 *
 * - Wraps shadcn/radix Popover under the hood.
 * - Accepts any React node as trigger (via `asChild`).
 * - Supports controlled and uncontrolled `open` state.
 * - Provides sensible defaults for placement and spacing.
 */
export interface PopoverProps {
  /** Popover body; can be string or any React node */
  content: React.ReactNode
  /** Trigger element (e.g., Button, IconButton, etc.) */
  children: React.ReactNode

  /** Preferred side of the panel relative to the trigger */
  side?: "top" | "right" | "bottom" | "left"
  /** Alignment relative to the trigger */
  align?: "start" | "center" | "end"
  /** Gap between trigger and panel */
  sideOffset?: number
  /** Collision padding for viewport edges */
  collisionPadding?: number
  /** Override Radix collision behavior (leave undefined for default) */
  avoidCollisions?: boolean

  /** Uncontrolled initial open state */
  defaultOpen?: boolean
  /** Controlled open state */
  open?: boolean
  /** Open state change callback */
  onOpenChange?: (open: boolean) => void
  /** Modal behavior (focus trap) */
  modal?: boolean

  /** Disable popover (renders trigger only) */
  disabled?: boolean

  /** Class for the trigger element (merged into child via clone) */
  className?: string
  /** Class for the panel */
  contentClassName?: string

  /** Optional portal container element (helps with transformed/overflowed parents) */
  container?: HTMLElement | null
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  children,

  side = "bottom",
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  avoidCollisions,

  defaultOpen,
  open,
  onOpenChange,
  modal,

  disabled = false,

  className,
  contentClassName,

  container,
}) => {
  // If disabled, render the trigger alone
  if (disabled) {
    return <>{children}</>
  }

  // Ensure we always pass an element to `asChild`
  const triggerChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        className: cn((children.props as any)?.className, className),
      })
    : <span className={cn("inline-flex items-center", className)}>{children}</span>

  // SSR-safe portal container
  const portalContainer =
    typeof window !== "undefined" ? container ?? undefined : undefined

  return (
    <ShadcnPopover
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <ShadcnPopoverTrigger asChild>
        {triggerChild}
      </ShadcnPopoverTrigger>

      <ShadcnPopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...(typeof avoidCollisions === "boolean" ? { avoidCollisions } : {})}
        {...(portalContainer ? { container: portalContainer } : {})}
        className={cn("w-64 p-3 text-sm", contentClassName)}
      >
        {typeof content === "string" ? <div>{content}</div> : content}
      </ShadcnPopoverContent>
    </ShadcnPopover>
  )
}

export default Popover
