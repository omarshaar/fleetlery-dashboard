/**
 * @file SearchBox.tsx
 * @description Reusable search input for DataTable toolbar.
 */

import { Input } from "@/eano/design-system/shadcn/input"
import { cn } from "@/eano/lib/utils"

export function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <Input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn("max-w-xs", className)}
    />
  )
}
