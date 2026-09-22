/**
 * @file DataTable.tsx
 * @description Main DataTable component using cell components for clean UI (Shadcn + Tailwind).
 */

import * as React from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

// Types
import type { DataTableProps, ColumnConfig } from "./types";

// Hooks
import { useDataTable } from "./hooks/useDataTable";
import { useSorting } from "./hooks/useSorting";
import { usePagination } from "./hooks/usePagination";
import { useSelection } from "./hooks/useSelection";
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import { useFiltering } from "./hooks/useFiltering";
import { useDebouncedSearch } from "./hooks/useDebouncedSearch";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/eano/design-system/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/eano/design-system/shadcn/table";
import { Button } from "@/eano/design-system/shadcn/button";
import { Checkbox } from "@/eano/design-system/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/eano/design-system/shadcn/dropdown-menu";
import { Input } from "@/eano/design-system/shadcn/input";
import { Pagination } from "@/eano/components/layout-ui/Pagination";

// Utils & Cell Components
import { cn, getNestedValue } from "../lib/utils";
import { CellImage, CellBadge, CellLink, CellText } from "./components/cells";
import { resolveFeatures } from "./utils/feature-presets";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Renders the appropriate cell component based on column type
 */
function renderCell<T extends Record<string, any>>(
  row: T,
  col: ColumnConfig<T>
) {
  const value = getNestedValue(row, String(col.key));
  
  if (col.render) {
    return col.render(value, row);
  }

  switch (col.type) {
    case "image":
      return <CellImage src={String(value)} alt={col.label} />;
    case "badge":
      return <CellBadge text={String(value)} variant="secondary" />;
    case "link":
      return (
        <CellLink
          text={String(value)}
          onClick={() => console.log("Clicked:", value)}
        />
      );
    default:
      return <CellText text={String(value ?? "")} align={col.align} />;
  }
}

/**
 * Calculates column styles based on width, min/max width
 */
function getColumnStyle<T extends Record<string, any>>(
  col: ColumnConfig<T>
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  // Grid-based width (1-12)
  if (col.width && col.width >= 0 && col.width <= 12) {
    styles.width = `${(col.width / 12) * 100}%`;
  }

  // Min width
  styles.minWidth = col.minWidth
    ? typeof col.minWidth === "number"
      ? `${col.minWidth}px`
      : col.minWidth
    : "100px";

  // Max width
  if (col.maxWidth) {
    styles.maxWidth =
      typeof col.maxWidth === "number"
        ? `${col.maxWidth}px`
        : col.maxWidth;
  }

  // Text overflow handling
  styles.whiteSpace = "normal";
  styles.wordBreak = "break-word";
  styles.overflow = "hidden";
  styles.textOverflow = "ellipsis";

  return styles;
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Table Header Component
 */
type TableHeaderSectionProps<T extends Record<string, any>> = {
  columns: ColumnConfig<T>[];
  isVisible: (key: string) => boolean;
  onSort: (key: keyof T) => void;
  selectable?: boolean;
  allSelected: boolean;
  toggleAll: () => void;
};

function TableHeaderSection<T extends Record<string, any>>({
  columns,
  isVisible,
  onSort,
  selectable,
  allSelected,
  toggleAll,
}: TableHeaderSectionProps<T>) {
  return (
    <TableHeader>
      <TableRow>
        {selectable && (
          <TableHead className="w-[42px] text-center">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
          </TableHead>
        )}

        {columns
          .filter((c) => isVisible(String(c.key)))
          .map((col) => (
            <TableHead
              key={String(col.key)}
              onClick={() => col.sortable && onSort(col.key)}
              className="cursor-pointer"
            >
              <div style={getColumnStyle(col)} className="flex gap-1">
                {col.label}
                {col.sortable && <ArrowUpDown className="h-4 w-4 opacity-50" />}
              </div>
            </TableHead>
          ))}
      </TableRow>
    </TableHeader>
  );
}

/**
 * Table Row Component
 */
type TableRowDataProps<T extends Record<string, any>> = {
  row: T;
  rowIndex: number;
  columns: ColumnConfig<T>[];
  isVisible: (key: string) => boolean;
  selectable?: boolean;
  isSelected: (id: string | number) => boolean;
  toggleRow: (id: string | number) => void;
  rowKey?: (row: T, index: number) => string | number;
};

function TableRowData<T extends Record<string, any>>({
  row,
  rowIndex,
  columns,
  isVisible,
  selectable,
  isSelected,
  toggleRow,
  rowKey,
}: TableRowDataProps<T>) {
  return (
    <TableRow key={String(rowKey?.(row, rowIndex) ?? rowIndex)}>
      {selectable && (
        <TableCell className="text-center">
          <Checkbox
            checked={isSelected(row.id ?? rowIndex)}
            onCheckedChange={() => toggleRow(row.id ?? rowIndex)}
          />
        </TableCell>
      )}

      {columns
        .filter((c) => isVisible(String(c.key)))
        .map((col) => (
          <TableCell key={String(col.key)}>
            <div style={getColumnStyle(col)}>{renderCell(row, col)}</div>
          </TableCell>
        ))}
    </TableRow>
  );
}

/**
 * Table Body States (Loading, Empty, Data)
 */
type TableBodySectionProps<T extends Record<string, any>> = {
  loading: boolean;
  hasData: boolean;
  emptyMessage: string;
  columnsLength: number;
  paginatedData: T[];
  columns: ColumnConfig<T>[];
  isVisible: (key: string) => boolean;
  selectable?: boolean;
  isSelected: (id: string | number) => boolean;
  toggleRow: (id: string | number) => void;
  rowKey?: (row: T, index: number) => string | number;
};

function TableBodySection<T extends Record<string, any>>({
  loading,
  hasData,
  emptyMessage,
  columnsLength,
  paginatedData,
  columns,
  isVisible,
  selectable,
  isSelected,
  toggleRow,
  rowKey,
}: TableBodySectionProps<T>) {
  return (
    <TableBody>
      {loading && (
        <TableRow>
          <TableCell colSpan={columnsLength + 1} className="text-center">
            Loading...
          </TableCell>
        </TableRow>
      )}

      {!loading && !hasData && (
        <TableRow>
          <TableCell colSpan={columnsLength + 1} className="text-center">
            {emptyMessage}
          </TableCell>
        </TableRow>
      )}

      {hasData &&
        paginatedData.map((row, rIndex) => (
          <TableRowData
            key={String(rowKey?.(row, rIndex) ?? rIndex)}
            row={row}
            rowIndex={rIndex}
            columns={columns}
            isVisible={isVisible}
            selectable={selectable}
            isSelected={isSelected}
            toggleRow={toggleRow}
            rowKey={rowKey}
          />
        ))}
    </TableBody>
  );
}

/**
 * Toolbar Section (Search & Column Visibility)
 */
type ToolbarSectionProps<T extends Record<string, any>> = {
  features?: DataTableProps<T>["features"];
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  columns: ColumnConfig<T>[];
  isVisible: (key: string) => boolean;
  toggleColumn: (key: string) => void;
};

function ToolbarSection<T extends Record<string, any>>({
  features,
  searchValue,
  onSearchChange,
  columns,
  isVisible,
  toggleColumn,
}: ToolbarSectionProps<T>) {
  if (!features?.hideableColumns && !features?.search) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b bg-muted/40">
      {features?.search && (
        <Input
          placeholder={features.search.placeholder ?? "Search..."}
          value={searchValue}
          onChange={onSearchChange}
          className="max-w-xs"
        />
      )}

      {features?.hideableColumns && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              Columns <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={String(col.key)}
                checked={isVisible(String(col.key))}
                onCheckedChange={() => toggleColumn(String(col.key))}
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

/**
 * Pagination Footer Section
 */
type PaginationSectionProps = {
  paginationEnabled: boolean;
  pagination: { page: number } | null;
  totalPages: number;
  setPage: (page: number) => void;
};

function PaginationSection({
  paginationEnabled,
  pagination,
  totalPages,
  setPage,
}: PaginationSectionProps) {
  if (!paginationEnabled || !pagination || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center border-t px-4 py-3">
      <Pagination
        total={totalPages}
        current={pagination.page}
        onChange={setPage}
        siblingCount={1}
        boundaryCount={1}
        showPrevNext
        showFirstLast={false}
        size="sm"
      />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function DataTable<T extends Record<string, any>>(
  props: DataTableProps<T>
) {
  // Props destructuring
  const {
    tableId,
    title,
    description,
    columns,
    preset,
    enableSearch,
    enableSorting,
    enablePagination,
    enableSelection,
    enableColumnToggle,
    features: explicitFeatures,
    data: initialData,
    rowKey,
    className,
    loading = false,
    emptyMessage = "No data available",
  } = props;

  const features = React.useMemo(
    () =>
      resolveFeatures<T>(
        preset,
        enableSearch,
        enableSorting,
        enablePagination,
        enableSelection,
        enableColumnToggle,
        explicitFeatures
      ),
    [
      preset,
      enableSearch,
      enableSorting,
      enablePagination,
      enableSelection,
      enableColumnToggle,
      explicitFeatures,
    ]
  );

  // ============================================================================
  // State & Data Management
  // ============================================================================

  const { data, actions } = useDataTable(tableId);

  const { visibleColumns, toggleColumn, isVisible, resetVisibility } =
    useColumnVisibility(
      tableId,
      columns.map((c) => String(c.key))
    );

  // Initialize data and column visibility
  React.useEffect(() => {
    actions.setData(initialData ?? []);
    if (!visibleColumns.length) resetVisibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // ============================================================================
  // Search Feature
  // ============================================================================

  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    actions.setSearch(value);
  };

  useDebouncedSearch(
    searchValue,
    features?.search?.debounceMs ?? 800,
    features?.search?.mode === "server"
      ? (term) => features.search?.onServerSearch?.(term)
      : undefined
  );

  const filteredData =
    features?.search?.mode === "local"
      ? useFiltering(data, searchValue, features?.search?.searchColumns)
      : data;

  // ============================================================================
  // Sorting, Pagination & Selection
  // ============================================================================

  const { sortedData, onSort } = useSorting(filteredData);

  const paginationEnabled = Boolean(features?.pagination);

  const { paginatedData, pagination, totalPages, setPage } = paginationEnabled
    ? usePagination(sortedData, features!.pagination!.pageSize ?? 10)
    : {
        paginatedData: sortedData,
        pagination: null,
        totalPages: 1,
        setPage: () => {},
      };

  const { toggleRow, toggleAll, isSelected, allSelected } = useSelection(
    tableId,
    paginatedData
  );

  const hasData = paginatedData.length > 0 && !loading;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <Card className={cn("w-full py-1 gap-3!",  className)}>
      {/* Header Section */}
      {(title || description) && (
        <CardHeader className="pt-4">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {/* Toolbar Section */}
      <ToolbarSection
        features={features}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        columns={columns}
        isVisible={isVisible}
        toggleColumn={toggleColumn}
      />

      {/* Table Section */}
      <CardContent className={`p-0 overflow-auto h-full ${features?.selectable ? "" : "px-4" }`}>
        <Table>
          <TableHeaderSection
            columns={columns}
            isVisible={isVisible}
            onSort={onSort}
            selectable={features?.selectable}
            allSelected={allSelected}
            toggleAll={toggleAll}
          />

          <TableBodySection
            loading={loading}
            hasData={hasData}
            emptyMessage={emptyMessage}
            columnsLength={columns.length}
            paginatedData={paginatedData}
            columns={columns}
            isVisible={isVisible}
            selectable={features?.selectable}
            isSelected={isSelected}
            toggleRow={toggleRow}
            rowKey={rowKey}
          />
        </Table>
      </CardContent>

      {/* Pagination Section */}
      <PaginationSection
        paginationEnabled={paginationEnabled}
        pagination={pagination}
        totalPages={totalPages}
        setPage={setPage}
      />
    </Card>
  );
}
