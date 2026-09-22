import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/i18n/hooks";
import { Page } from "@/eano/components/page/Page";
import { ProductListBlock } from "@/components";
import { useGetMockiProductsQuery } from "@/services/api/eanoApi";

export default function ProductsPage() {
  const { t } = useLanguage();
  const [view, setView] = useState<"table" | "grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const pageSize = 18;

  const {
    data: products,
    isLoading,
    isError,
  } = useGetMockiProductsQuery();

  const totalPages = useMemo(() => {
    const count = products?.length ?? 0;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [products, pageSize]);

  const pageItems = useMemo(() => {
    const list = products ?? [];
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [products, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <Page>
      <ProductListBlock
        title={t("navigation.products")}
        items={pageItems}
        loading={isLoading}
        error={isError}
        loadingText={t("ecommerce.products.loading")}
        errorText={t("ecommerce.products.error")}
        emptyText={t("ecommerce.products.empty")}
        viewType={view}
        onViewTypeChange={setView}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onItemClick={(item) => console.log("Clicked:", item)}
      />
    </Page>
  );
}
