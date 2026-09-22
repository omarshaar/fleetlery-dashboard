/**
 * @file ColumnsMenu.tsx
 * @description Dropdown menu for toggling visible columns in the DataTable.
 */

import { Button } from "@/eano/design-system/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/eano/design-system/shadcn/dropdown-menu"

export interface ColumnsMenuProps {
  columns: { key: string; label: string }[]
  isVisible: (key: string) => boolean
  toggleColumn: (key: string) => void
}

export function ColumnsMenu({ columns, isVisible, toggleColumn }: ColumnsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {columns.map((col) => (
          <DropdownMenuCheckboxItem
            key={col.key}
            checked={isVisible(col.key)}
            onCheckedChange={() => toggleColumn(col.key)}
          >
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
