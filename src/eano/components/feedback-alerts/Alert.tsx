/**
 * @file Alert.tsx
 * @description Unified Alert component (no subcomponents for consumers).
 * It wraps the shadcn Alert primitives internally and exposes a simple API.
 */

import * as React from "react";
import {
  Alert as ShadcnAlert,
  AlertTitle,
  AlertDescription,
} from "@/eano/design-system/shadcn/alert";
import { cn } from "@/eano/lib/utils";

type AlertVariant = "default" | "destructive";

export type AlertProps = {
  /** Optional heading/title for the alert */
  title?: React.ReactNode;
  /** Optional longer description for the alert */
  description?: React.ReactNode;
  /** Visual/semantic style of the alert */
  variant?: AlertVariant;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Extra class names for the root */
  className?: string;
} & React.ComponentPropsWithoutRef<"div">;

/**
 * Unified Alert: single ready-to-use component.
 * Accessibility: role + aria-live are adjusted by variant.
 */
export function Alert({
  title,
  description,
  variant = "default",
  icon,
  className,
  ...rest
}: AlertProps) {
  // For destructive messages, we announce assertively.
  const role = variant === "destructive" ? "alert" : "status";
  const ariaLive = variant === "destructive" ? "assertive" : "polite";

  return (
    <ShadcnAlert
      variant={variant}
      role={role}
      aria-live={ariaLive}
      className={cn("flex items-start gap-2", className)}
      {...rest}
    >
      {icon ? <span className="mt-0.5">{icon}</span> : null}

      <div className="min-w-0">
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {description ? (
          <AlertDescription>{description}</AlertDescription>
        ) : null}
      </div>
    </ShadcnAlert>
  );
}
