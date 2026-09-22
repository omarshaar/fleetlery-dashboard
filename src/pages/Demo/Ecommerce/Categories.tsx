import * as React from "react";
import { Page } from "@/eano/components/page/Page";
import { useLanguage } from "@/i18n/hooks";
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder";
import { CellBadge } from "@/eano/data-table-builder/components/cells";

import categoriesMock from "./mock.data/categories.mock.json";

type CategoryStatusVariant = "active" | "inactive" | string;

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productsCount: number;
  status?: {
    variant: CategoryStatusVariant;
    label?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  parentId?: string | null;
};

export default function CategoriesPage() {
  const { t } = useLanguage();

  const data = categoriesMock as unknown as Category[];

  const columns = React.useMemo<ColumnConfig<Category>[]>(
    () => [
      {
        key: "name",
        label: t("ecommerce.categories.columns.name"),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 180,
      },
      {
        key: "slug",
        label: t("ecommerce.categories.columns.slug"),
        type: "text",
        sortable: true,
        searchable: true,
        minWidth: 160,
        hideable: true,
      },
      {
        key: "productsCount",
        label: t("ecommerce.categories.columns.productsCount"),
        type: "number",
        sortable: true,
        minWidth: 140,
      },
      {
        key: "status.variant",
        label: t("ecommerce.categories.columns.status"),
        type: "custom",
        sortable: true,
        minWidth: 10,
        render: (_value, row) => {
          const variant = row.status?.variant ?? "";
          const label = t(`common.status.${variant}`, {
            defaultValue: String(variant || ""),
          });

          const badgeVariant =
            variant === "active"
              ? "default"
              : variant === "inactive"
                ? "secondary"
                : "outline";

          return <CellBadge text={label} variant={badgeVariant} />;
        },
      },
      {
        key: "updatedAt",
        label: t("ecommerce.categories.columns.updatedAt"),
        type: "text",
        sortable: true,
        minWidth: 120,
        hideable: true,
        render: (value) => String(value ?? ""),
      },
    ],
    [t]
  );

  return (
    <Page>
      <div className="w-full h-full"> 
        <DataTable<Category>
          tableId="ecommerce-categories"
          data={data}
          columns={columns}
          emptyMessage={t("ecommerce.categories.table.empty")}
          className="h-full"
          features={{
            search: {
              mode: "local",
              placeholder: t("ecommerce.categories.table.searchPlaceholder"),
              searchColumns: ["name", "slug", "description"],
              showClearButton: true,
              showResultsCount: true,
              debounceMs: 250,
            },
            sorting: true,
            pagination: {
              type: "client",
              pageSize: 15,
            },
            hideableColumns: true,
          }}
        />
      </div>
    </Page>
  );
}
