"use client"

import * as React from "react"
import { cn } from "@/eano/lib/utils"
import { ButtonGroup, PageHeader, Pagination } from "@/components"
import { Grid2X2, List as ListIcon, Table2 } from "lucide-react"
import { DataStateGate } from "@/eano/components/system"
import { DataTable } from "@/eano/data-table-builder"
import type { ColumnConfig } from "@/eano/data-table-builder/types"
import { useTranslation } from "react-i18next"

import type { ProductListItem } from "./types"
import { ProductGridItem } from "../../cards/ProductGridItem"
import { ProductListItemRow } from "../../cards/ProductListItemRow"

/* -----------------------------------------------------
   Props
----------------------------------------------------- */

export interface ProductListBlockProps {
  /** Items to render */
  items: ProductListItem[]

  /** State */
  loading?: boolean
  error?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string

  /** List | Grid */
  viewType?: "grid" | "list" | "table"
  defaultViewType?: "grid" | "list" | "table"
  onViewTypeChange?: (view: "grid" | "list" | "table") => void

  /** Optional DataTable instance id (useful when multiple blocks exist on one page) */
  dataTableId?: string

  /** Header title */
  title?: string

  /** Pagination */
  page: number
  totalPages: number
  onPageChange: (page: number) => void

  /** Optional item click */
  onItemClick?: (item: ProductListItem) => void

  /** CTA */
  onItemAction?: (item: ProductListItem) => void
  itemActionLabel?: string

  className?: string
}

/* -----------------------------------------------------
   Component
----------------------------------------------------- */

export function ProductListBlock({
  items,
  loading = false,
  error = false,
  loadingText,
  errorText,
  emptyText,
  title,
  viewType,
  defaultViewType = "grid",
  onViewTypeChange,
  dataTableId,
  page,
  totalPages,
  onPageChange,
  onItemClick,
  onItemAction,
  itemActionLabel,
  className,
}: ProductListBlockProps) {
  const { t } = useTranslation("components")

  const resolvedTitle =
    title ?? t("productListBlock.title", { defaultValue: "Products" })
  const resolvedLoadingText =
    loadingText ??
    t("productListBlock.states.loading", { defaultValue: "Loading..." })
  const resolvedErrorText =
    errorText ??
    t("productListBlock.states.error", { defaultValue: "Something went wrong." })
  const resolvedEmptyText =
    emptyText ??
    t("productListBlock.states.empty", { defaultValue: "No products to display." })
  const resolvedItemActionLabel =
    itemActionLabel ??
    t("productListBlock.table.actionLabel", { defaultValue: "Details" })

  /* Controlled / Uncontrolled view mode */
  const isControlled = viewType !== undefined
  const [internalView, setInternalView] =
    React.useState<"grid" | "list" | "table">(defaultViewType)

  const currentView = isControlled ? viewType! : internalView

  const changeView = (v: "grid" | "list" | "table") => {
    if (!isControlled) setInternalView(v)
    onViewTypeChange?.(v)
  }

  const internalId = React.useId()
  const tableId = React.useMemo(() => {
    if (dataTableId) return dataTableId
    // React useId can contain ':' which is fine, but keep it URL/selector-friendly.
    return `product-list-${internalId.replace(/:/g, "")}`
  }, [dataTableId, internalId])

  const tableColumns: ColumnConfig<ProductListItem>[] = React.useMemo(
    () => [
      {
        key: "imageUrl",
        label: t("productListBlock.table.columns.image", { defaultValue: "Image" }),
        type: "image",
        sortable: false,
        searchable: false,
        minWidth: 70,
        maxWidth: 90,
      },
      {
        key: "name",
        label: t("productListBlock.table.columns.name", { defaultValue: "Name" }),
        type: "custom",
        sortable: true,
        searchable: true,
        minWidth: 220,
        render: (_value, row) => (
          <button
            type="button"
            onClick={() => onItemClick?.(row)}
            className={cn(
              "text-left font-medium",
              onItemClick
                ? "hover:underline text-foreground"
                : "cursor-default text-foreground"
            )}
          >
            {row.name}
          </button>
        ),
      },
      {
        key: "subtitle",
        label: t("productListBlock.table.columns.subtitle", { defaultValue: "Subtitle" }),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 200,
        render: (value) => (
          <span className="text-muted-foreground">{String(value ?? "—")}</span>
        ),
      },
      {
        key: "price",
        label: t("productListBlock.table.columns.price", { defaultValue: "Price" }),
        type: "custom",
        sortable: true,
        searchable: false,
        minWidth: 130,
        align: "right",
        render: (_value, row) => {
          const currency = row.currency ?? "$"
          const current = Number.isFinite(row.price) ? row.price : 0
          const old = row.oldPrice
          return (
            <div className="text-right">
              <div className="font-medium">
                {currency} {current.toLocaleString()}
              </div>
              {typeof old === "number" && old > current && (
                <div className="text-xs text-muted-foreground line-through">
                  {currency} {old.toLocaleString()}
                </div>
              )}
            </div>
          )
        },
      },
      {
        key: "badge",
        label: t("productListBlock.table.columns.badge", { defaultValue: "Badge" }),
        type: "badge",
        sortable: true,
        searchable: true,
        minWidth: 120,
        render: (value) => (value ? String(value) : "—"),
      },
      {
        key: "id",
        label: t("productListBlock.table.columns.action", { defaultValue: "Action" }),
        type: "custom",
        sortable: false,
        searchable: false,
        hideable: false,
        minWidth: 120,
        align: "right",
        render: (_value, row) => (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onItemAction?.(row)}
              className={cn(
                "text-xs font-medium px-3 py-1 rounded-md border border-input",
                onItemAction
                  ? "hover:bg-accent hover:text-accent-foreground"
                  : "opacity-50 cursor-not-allowed"
              )}
              disabled={!onItemAction}
            >
              {resolvedItemActionLabel}
            </button>
          </div>
        ),
      },
    ],
    [onItemClick, onItemAction, resolvedItemActionLabel, t]
  )

  return (
    <section className={cn("w-full h-full", className)}>
      {/* Header */}
      <PageHeader title={resolvedTitle} className="mb-4">
        <ButtonGroup className="rounded-md overflow-hidden border border-input">
          <button
            type="button"
            onClick={() => changeView("grid")}
            aria-label={t("productListBlock.views.grid", { defaultValue: "Grid" })}
            title={t("productListBlock.views.grid", { defaultValue: "Grid" })}
            className={cn(
              "inline-flex items-center justify-center bg-background px-3 py-1 text-xs font-medium border-r border-input rounded-none!",
              currentView === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Grid2X2 className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => changeView("list")}
            aria-label={t("productListBlock.views.list", { defaultValue: "List" })}
            title={t("productListBlock.views.list", { defaultValue: "List" })}
            className={cn(
              "inline-flex items-center justify-center bg-background px-3 py-1 text-xs font-medium border-r border-input rounded-none!",
              currentView === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <ListIcon className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={() => changeView("table")}
            aria-label={t("productListBlock.views.table", { defaultValue: "Table" })}
            title={t("productListBlock.views.table", { defaultValue: "Table" })}
            className={cn(
              "inline-flex items-center justify-center bg-background px-3 py-1 text-xs font-medium rounded-none!",
              currentView === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Table2 className="h-3 w-3" />
          </button>
        </ButtonGroup>
      </PageHeader>

      {/* Content */}
      <DataStateGate
        isLoading={loading}
        isError={error}
        data={items}
        loadingText={resolvedLoadingText}
        errorText={resolvedErrorText}
        showEmpty
        emptyText={resolvedEmptyText}
      >
        {currentView === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-3 gap-2">
            {items.map((item) => (
              <ProductGridItem
                key={item.id}
                item={item}
                onClick={onItemClick}
                onAction={onItemAction}
                actionLabel={resolvedItemActionLabel}
              />
            ))}
          </div>
        ) : currentView === "list" ? (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <ProductListItemRow
                key={item.id}
                item={item}
                onClick={onItemClick}
                onAction={onItemAction}
                actionLabel={resolvedItemActionLabel}
              />
            ))}
          </div>
        ) : (
          <DataTable<ProductListItem>
            tableId={tableId}
            data={items}
            columns={tableColumns}
            loading={loading}
            emptyMessage={resolvedEmptyText}
            className="shadow-none"
            features={{
              search: {
                mode: "local",
                placeholder: t("productListBlock.table.searchPlaceholder", {
                  defaultValue: "Search products...",
                }),
                searchColumns: ["name", "subtitle", "badge"],
                showClearButton: true,
                showResultsCount: true,
                debounceMs: 250,
              },
              sorting: true,
              hideableColumns: true,
            }}
          />
        )}
      </DataStateGate>

      {/* Pagination */}
      {!loading && !error && items.length > 0 && (
        <div className="mt-6 pb-3 flex justify-center">
          <Pagination
            total={totalPages}
            current={page}
            onChange={onPageChange}
            siblingCount={1}
            boundaryCount={1}
            size="md"
            showPrevNext={true}
            showFirstLast={false}
          />
        </div>
      )}
    </section>
  )
}
