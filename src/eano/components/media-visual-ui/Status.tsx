"use client"

import {
  Status as ShadcnStatus,
  StatusIndicator,
  StatusLabel,
} from "@/eano/design-system/shadcn/status"
import type { BaseFieldProps } from "@/eano/components/_shared/field-types"
import { cn } from "@/eano/lib/utils"

/**
 * Status – unified wrapper for Shadcn Status component
 * ----------------------------------------------------------
 * - Single import, no need to use StatusIndicator or StatusLabel manually.
 * - Supports label, description, error, disabled via BaseFieldProps.
 * - Designed to show a system/user/service state (online/offline/etc.).
 */

// Keep in sync with design-system StatusProps.status union
type StatusType = "online" | "offline" | "maintenance" | "degraded"

type StatusProps = Omit<BaseFieldProps, "required"> & {
  /** Current status type */
  status: StatusType
  /** Custom label (optional). Default = capitalized status string */
  label?: string
  /** If true, shows the status as muted (disabled visual) */
  muted?: boolean
}

export function Status({
  status,
  label,
  muted,
  disabled,
  className,
}: StatusProps) {
  return (
    <ShadcnStatus
      status={status}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border",
        muted && "opacity-70",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      <StatusIndicator />
      <StatusLabel>{label ?? capitalize(status)}</StatusLabel>
    </ShadcnStatus>
  )
}

/** Helper: Capitalizes the first letter */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
