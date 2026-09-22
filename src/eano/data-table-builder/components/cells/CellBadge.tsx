/**
 * @file CellBadge.tsx
 * @description Displays a colored badge cell using shadcn Badge component.
 */

import { Badge } from "@/eano/design-system/shadcn/badge"

type BadgeVariant = "secondary" | "default" | "destructive" | "outline" | null | undefined;

export function CellBadge({ text, variant = "secondary" }: { text: string; variant?: BadgeVariant }) {
  return <Badge variant={variant}>{text}</Badge>
}
