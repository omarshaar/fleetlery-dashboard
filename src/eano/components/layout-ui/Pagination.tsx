/**
 * @file Pagination.tsx
 * @description Unified Pagination component with a simple, consistent API.
 * Internally uses shadcn primitives for layout, but exposes a single component.
 */

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/eano/design-system/shadcn/pagination";
import { cn } from "@/eano/lib/utils";

export type PaginationProps = {
  /** Total number of pages (>= 1) */
  total: number;
  /** Current page (1-based) */
  current?: number;
  /** Called when user selects a page */
  onChange?: (page: number) => void;

  /** Number of page neighbors around the current page (default 1) */
  siblingCount?: number;
  /** Number of always-visible pages at the boundaries (default 1) */
  boundaryCount?: number;

  /** Show prev/next buttons (default true) */
  showPrevNext?: boolean;
  /** Show first/last buttons (default false) */
  showFirstLast?: boolean;

  /** Disable all interactions */
  disabled?: boolean;

  /** Size styles */
  size?: "sm" | "md" | "lg";

  /** Extra class names for the wrapper */
  className?: string;
};

type PageToken = number | "ellipsis" | "first" | "last" | "prev" | "next";

/** Build the pagination range with ellipses */
function buildRange(
  total: number,
  current: number,
  siblingCount: number,
  boundaryCount: number,
  opts: { showPrevNext: boolean; showFirstLast: boolean }
): PageToken[] {
  const range: PageToken[] = [];

  const startPages = Array.from({ length: Math.min(boundaryCount, total) }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: Math.min(boundaryCount, total) },
    (_, i) => total - i
  ).reverse();

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const hasLeftEllipsis = leftSibling > (boundaryCount + 1);
  const hasRightEllipsis = rightSibling < (total - boundaryCount);

  if (opts.showFirstLast) range.push("first");
  if (opts.showPrevNext) range.push("prev");

  // start pages
  for (const p of startPages) range.push(p);

  if (hasLeftEllipsis) range.push("ellipsis");

  // middle
  const middleStart = Math.max(leftSibling, boundaryCount + 1);
  const middleEnd = Math.min(rightSibling, total - boundaryCount);
  for (let p = middleStart; p <= middleEnd; p++) range.push(p);

  if (hasRightEllipsis) range.push("ellipsis");

  // end pages
  for (const p of endPages) {
    if (!startPages.includes(p)) range.push(p);
  }

  if (opts.showPrevNext) range.push("next");
  if (opts.showFirstLast) range.push("last");

  return range;
}

function sizeClasses(size: "sm" | "md" | "lg" = "md") {
  switch (size) {
    case "sm":
      return "h-8 min-w-8 px-2 text-xs";
    case "lg":
      return "h-10 min-w-10 px-3 text-sm";
    default:
      return "h-9 min-w-9 px-3 text-sm";
  }
}

export function Pagination({
  total,
  current = 1,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  showPrevNext = true,
  showFirstLast = false,
  disabled = false,
  size = "md",
  className,
}: PaginationProps) {
  const safeTotal = Math.max(1, Math.floor(total));
  const safeCurrent = Math.min(Math.max(1, Math.floor(current)), safeTotal);

  const tokens = buildRange(safeTotal, safeCurrent, siblingCount, boundaryCount, {
    showPrevNext,
    showFirstLast,
  });

  const baseBtn =
    "inline-flex items-center justify-center rounded-md border border-input bg-background " +
    "text-foreground hover:bg-accent hover:text-accent-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition";

  const activeBtn =
    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground";

  const disabledBtn = "opacity-50 pointer-events-none";

  const onClickPage = (page: number) => {
    if (disabled) return;
    if (page < 1 || page > safeTotal) return;
    onChange?.(page);
  };

  const renderToken = (t: PageToken, idx: number) => {
    if (t === "ellipsis") {
      return (
        <PaginationItem key={`e-${idx}`} className="text-muted-foreground">
          <span aria-hidden>…</span>
        </PaginationItem>
      );
    }

    if (t === "first") {
      const isDisabled = safeCurrent === 1 || disabled;
      return (
        <PaginationItem key="first">
          <button
            type="button"
            aria-label="First page"
            className={cn(baseBtn, sizeClasses(size), isDisabled && disabledBtn)}
            onClick={() => onClickPage(1)}
            disabled={isDisabled}
          >
            «
          </button>
        </PaginationItem>
      );
    }

    if (t === "last") {
      const isDisabled = safeCurrent === safeTotal || disabled;
      return (
        <PaginationItem key="last">
          <button
            type="button"
            aria-label="Last page"
            className={cn(baseBtn, sizeClasses(size), isDisabled && disabledBtn)}
            onClick={() => onClickPage(safeTotal)}
            disabled={isDisabled}
          >
            »
          </button>
        </PaginationItem>
      );
    }

    if (t === "prev") {
      const isDisabled = safeCurrent === 1 || disabled;
      return (
        <PaginationItem key="prev">
          {/* Using shadcn's visual for previous, but with button behavior */}
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isDisabled) onClickPage(safeCurrent - 1);
            }}
            className={cn(sizeClasses(size), isDisabled && disabledBtn)}
          />
        </PaginationItem>
      );
    }

    if (t === "next") {
      const isDisabled = safeCurrent === safeTotal || disabled;
      return (
        <PaginationItem key="next">
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isDisabled) onClickPage(safeCurrent + 1);
            }}
            className={cn(sizeClasses(size), isDisabled && disabledBtn)}
          />
        </PaginationItem>
      );
    }

    // page number
    const p = t as number;
    const isActive = p === safeCurrent;
    return (
      <PaginationItem key={p}>
        <button
          type="button"
          aria-current={isActive ? "page" : undefined}
          className={cn(baseBtn, sizeClasses(size), isActive && activeBtn, disabled && disabledBtn)}
          onClick={() => onClickPage(p)}
          disabled={disabled}
        >
          {p}
        </button>
      </PaginationItem>
    );
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn("w-full", className)}
      role="navigation"
    >
      <ShadcnPagination>
        <PaginationContent>{tokens.map(renderToken)}</PaginationContent>
      </ShadcnPagination>
    </nav>
  );
}
