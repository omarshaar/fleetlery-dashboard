/**
 * InfoAlertCard Component
 *
 * A reusable info alert card component that displays an icon with title and description.
 * Used for displaying important information or updates to users.
 */

import React from "react";
import { Card, CardContent } from "@/eano/design-system/shadcn/card";
import { cn } from "@/eano/lib/utils";

export type InfoAlertCardProps = {
  /** Title text for the alert */
  title: React.ReactNode;
  /** Description/subtitle text for the alert */
  description: React.ReactNode;
  /** Icon to display on the left side */
  icon?: React.ReactNode;
  /** Optional CSS class names */
  className?: string;
  /** Background color variant (default: blue) */
  variant?: "blue" | "green" | "amber" | "red" | "purple";
} & React.ComponentPropsWithoutRef<"div">;

const variantStyles: Record<string, { card: string; title: string; description: string; iconColor: string }> = {
  blue: {
    card: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    title: "text-blue-900 dark:text-blue-100",
    description: "text-blue-700 dark:text-blue-200",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  green: {
    card: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    title: "text-green-900 dark:text-green-100",
    description: "text-green-700 dark:text-green-200",
    iconColor: "text-green-600 dark:text-green-400",
  },
  amber: {
    card: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    title: "text-amber-900 dark:text-amber-100",
    description: "text-amber-700 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  red: {
    card: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
    title: "text-red-900 dark:text-red-100",
    description: "text-red-700 dark:text-red-200",
    iconColor: "text-red-600 dark:text-red-400",
  },
  purple: {
    card: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
    title: "text-purple-900 dark:text-purple-100",
    description: "text-purple-700 dark:text-purple-200",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
};

export const InfoAlertCard = React.forwardRef<HTMLDivElement, InfoAlertCardProps>(
  ({ title, description, icon, className, variant = "blue", ...rest }, ref) => {
    const styles = variantStyles[variant];

    return (
      <Card ref={ref} className={cn(styles.card, className)} {...rest}>
        <CardContent className="flex items-start gap-3">
          {icon && (
            <div className={cn(styles.iconColor, "mt-0.5 shrink-0")}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <p className={cn("text-sm font-medium", styles.title)}>
              {title}
            </p>
            <p className={cn("text-sm mt-1", styles.description)}>
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

InfoAlertCard.displayName = "InfoAlertCard";
