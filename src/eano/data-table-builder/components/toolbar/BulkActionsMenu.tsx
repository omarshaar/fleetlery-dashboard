/**
 * @file BulkActionsMenu.tsx
 * @description Displays bulk action button(s) for selected rows.
 */

import { Button } from "@/eano/design-system/shadcn/button"

export interface BulkActionsMenuProps {
  count: number
  onExecute: () => void
}

export function BulkActionsMenu({ count, onExecute }: BulkActionsMenuProps) {
  if (count === 0) return null

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onExecute}
      className="transition-all hover:bg-muted"
    >
      Bulk Action ({count})
    </Button>
  )
}
