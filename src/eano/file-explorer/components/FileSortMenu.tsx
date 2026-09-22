"use client";

import { DropdownMenu } from "@/components";
import { Check, SortDescIcon } from "lucide-react";
import type { FileSortField, FileSortDirection } from "../types/sort-types";

interface FileSortMenuProps {
  sortField: FileSortField;
  sortDirection: FileSortDirection;

  onChangeField: (field: FileSortField) => void;
  onChangeDirection: (dir: FileSortDirection) => void;
}

/**
 * Sort Menu (Windows 11 style)
 * Uses the global DropdownMenu component from the project.
 */
export function FileSortMenu({
  sortField,
  sortDirection,
  onChangeField,
  onChangeDirection,
}: FileSortMenuProps) {
  return (
    <DropdownMenu
      label="Sort"
      trigger={
        <button className="px-3 py-2! text-sm rounded-md border bg-background hover:bg-accent transition">
          <SortDescIcon className="w-4 h-4" />
        </button>
      }
      items={[
        // Sort by Name
        {
          label: "Name",
          rightSlot: sortField === "name" ? <Check className="w-4 h-4" /> : undefined,
          onClick: () => onChangeField("name"),
        },

        // Sort by Date Modified
        {
          label: "Date Modified",
          rightSlot: sortField === "updatedAt" ? <Check className="w-4 h-4" /> : undefined,
          onClick: () => onChangeField("updatedAt"),
        },

        // Sort by Type
        {
          label: "Type",
          rightSlot: sortField === "type" ? <Check className="w-4 h-4" /> : undefined,
          onClick: () => onChangeField("type"),
        },

        // Submenu Example: More >
        {
          label: "More",
          children: [
            { label: "Extension", onClick: () => onChangeField("extension") },
            { label: "SizeBytes", onClick: () => onChangeField("sizeBytes") },
          ],
        },

        // Separator
        { separatorBefore: true, label: "Ascending",
          rightSlot: sortDirection === "asc" ? <Check className="w-4 h-4" /> : undefined,
          onClick: () => onChangeDirection("asc"),
        },

        {
          label: "Descending",
          rightSlot: sortDirection === "desc" ? <Check className="w-4 h-4" /> : undefined,
          onClick: () => onChangeDirection("desc"),
        },

        // Separator + Grouping submenu (optional for future)
        {
          separatorBefore: true,
          label: "Group by",
          children: [
            { label: "Type" },
            { label: "Date" },
            { label: "None" },
          ],
        },
      ]}
    />
  );
}
