"use client";

import { cn } from "@/eano/lib/utils";
import { ButtonGroup } from "@/components";
import { Grid2X2, List as ListIcon } from "lucide-react";

import { FileSortMenu } from "./FileSortMenu";
import type { FileSortField, FileSortDirection } from "../types/sort-types";

interface FileToolbarProps {
  title?: string;

  currentView: "grid" | "list";
  onChangeView: (view: "grid" | "list") => void;

  /** Sorting props */
  sortField: FileSortField;
  sortDirection: FileSortDirection;
  onSortFieldChange: (field: FileSortField) => void;
  onSortDirectionChange: (dir: FileSortDirection) => void;

  className?: string;
}

export function FileToolbar({
  title = "Files",
  currentView,
  onChangeView,

  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,

  className,
}: FileToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-4",
        className
      )}
    >
      {/* TITLE */}
      <div className="font-semibold text-lg">{title}</div>

      <div className="flex items-center gap-3">

        {/* SORT MENU */}
        <FileSortMenu
          sortField={sortField}
          sortDirection={sortDirection}
          onChangeField={onSortFieldChange}
          onChangeDirection={onSortDirectionChange}
        />

        {/* VIEW SWITCH BUTTONS */}
        <ButtonGroup className="rounded-md overflow-hidden border border-input">
          {/* GRID VIEW BUTTON */}
          <button
            type="button"
            onClick={() => onChangeView("grid")}
            className={cn(
              "inline-flex items-center justify-center bg-background px-3 py-1 text-xs font-medium border-r border-input rounded-none!",
              currentView === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Grid2X2 className="h-3 w-3" />
          </button>

          {/* LIST VIEW BUTTON */}
          <button
            type="button"
            onClick={() => onChangeView("list")}
            className={cn(
              "inline-flex items-center justify-center bg-background px-3 py-1 text-xs font-medium rounded-none!",
              currentView === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <ListIcon className="h-3 w-3" />
          </button>
        </ButtonGroup>
      </div>
    </div>
  );
}
