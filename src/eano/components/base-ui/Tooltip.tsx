// ToolTip.tsx
import React from "react"
import {
  Tooltip as ShadcnTooltip,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
} from "@/eano/design-system/shadcn/tooltip"
import { cn } from "@/eano/lib/utils"

/**
 * Single-component Tooltip with a simple API:
 *
 * <ToolTip content="Add to library">
 *   <Button>Hover</Button>
 * </ToolTip>
 *
 * Notes:
 * - Uses Radix/SHADCN under the hood.
 * - Keeps the panel close via sensible defaults (sideOffset/collisionPadding).
 * - Accepts any React node as trigger (wrapped with `asChild`).
 * - Optionally pass a custom portal container to avoid transform/overflow issues.
 */
export interface ToolTipProps {
  /** The tooltip body; can be string or rich React content */
  content: React.ReactNode
  /** The trigger node (e.g., a Button) */
  children: React.ReactNode
  /** Side where the tooltip appears relative to the trigger */
  side?: "top" | "right" | "bottom" | "left"
  /** Alignment relative to the trigger */
  align?: "start" | "center" | "end"
  /** Show delay in ms */
  delayDuration?: number
  /** Distance between trigger and panel (default 4) */
  sideOffset?: number
  /** Collision padding for viewport edges (default 4) */
  collisionPadding?: number
  /** Override collision behavior (leave undefined for default) */
  avoidCollisions?: boolean
  /** Disable tooltip (renders children only) */
  disabled?: boolean
  /** Class for the trigger wrapper (applied on the trigger element via asChild) */
  className?: string
  /** Class for the tooltip content panel */
  contentClassName?: string
  /** Optional portal container to fix positioning inside transformed parents */
  container?: HTMLElement | null
}

export const ToolTip: React.FC<ToolTipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  sideOffset = 4,
  collisionPadding = 4,
  avoidCollisions,
  disabled = false,
  className,
  contentClassName,
  container,
}) => {
  // Guard: if disabled, render trigger only
  if (disabled) {
    return <>{children}</>
  }

  // Ensure we always provide a valid element to `asChild`
  const triggerChild = React.isValidElement(children) ? (
    React.cloneElement(children as React.ReactElement<any>, {
      className: cn((children as React.ReactElement<any>).props?.className, className),
    })
  ) : (
    <span className={cn("inline-flex items-center", className)}>{children}</span>
  )

  // SSR-safe container (Radix will ignore undefined)
  const portalContainer =
    typeof window !== "undefined" ? container ?? undefined : undefined

  return (
    <ShadcnTooltipProvider delayDuration={delayDuration}>
      <ShadcnTooltip>
        <ShadcnTooltipTrigger asChild>
          {triggerChild}
        </ShadcnTooltipTrigger>

        <ShadcnTooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          {...(typeof avoidCollisions === "boolean" ? { avoidCollisions } : {})}
          // Radix Tooltip.Content supports `container` to control the portal root
          {...(portalContainer ? { container: portalContainer } : {})}
          className={cn("max-w-xs text-sm", contentClassName)}
        >
          {typeof content === "string" ? <p>{content}</p> : content}
        </ShadcnTooltipContent>
      </ShadcnTooltip>
    </ShadcnTooltipProvider>
  )
}