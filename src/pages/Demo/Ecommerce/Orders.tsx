import { Page } from "@/eano/components/page/Page";
import { OrderCard, PageHeader } from "@/components";
import { Button } from "@/eano/components/base-ui/Button";
import { DataStateGate } from "@/eano/components/system";
import { useLanguage } from "@/i18n/hooks";
import { useGetMockiOrdersQuery } from "@/services/api/eanoApi";
import { cn } from "@/eano/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OrderDetails } from "./components/OrderDetails";
import { DEFAULT_ORDERS_FILTERS, filterOrders, OrdersFilters, type OrdersFiltersState } from "./components/OrdersFilters";

export default function OrdersPage() {
    const { t } = useLanguage();

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const [filters, setFilters] = useState<OrdersFiltersState>(DEFAULT_ORDERS_FILTERS);

    const {
        data: orders,
        isLoading,
        isError,
    } = useGetMockiOrdersQuery();

    const selectedOrder = useMemo(() => {
        if (!selectedOrderId) return null;
        return (orders ?? []).find((o) => String(o.id) === selectedOrderId) ?? null;
    }, [orders, selectedOrderId]);

    const isDetailsOpen = Boolean(selectedOrder);

    const filteredOrders = useMemo(() => filterOrders(orders ?? [], filters), [orders, filters]);

    useEffect(() => {
        if (!selectedOrderId) return;
        const stillExists = (orders ?? []).some((o) => String(o.id) === selectedOrderId);
        if (!stillExists) setSelectedOrderId(null);
    }, [orders, selectedOrderId]);

    useEffect(() => {
        if (selectedOrderId) return;
        const fromUrl = searchParams.get("order_id");
        if (!fromUrl) return;
        setSelectedOrderId(String(fromUrl));
    }, [searchParams, selectedOrderId]);

    return (
        <Page className="flex flex-col h-full ">
            <PageHeader
                title={t("ecommerce.orders.pageTitle", { defaultValue: "Orders" })}
                subtitle={t("ecommerce.orders.pageSubtitle", {
                    defaultValue:
                        "Manage and track your orders efficiently using the order cards below. Each card provides a snapshot of order details, status, customer info, and total amount. Click on a card to view more details or take action on the order.",
                })}
            >
                <div className="flex items-center gap-2">
                    <OrdersFilters value={filters} onChange={setFilters} />

                    <Button size="sm" onClick={() => console.log("Add order")}>
                        <Plus className="h-4 w-4" />
                        {t("ecommerce.orders.actions.addOrder", { defaultValue: "Add Order" })}
                    </Button>
                </div>
            </PageHeader>

            <DataStateGate isLoading={isLoading} isError={isError} data={orders}>
                {/* Orders Grid */}
                <div className="mt-6 flex flex-1 w-full overflow-auto gap-3 p-1 relative or-hh" >
                    <div
                        className={
                            isDetailsOpen
                                ? "grid w-full max-w-xs grid-cols-1 gap-3"
                                : "grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        }
                    >
                        {filteredOrders.map((order) => {
                            const id = String(order.id);
                            const isSelected = id === selectedOrderId;

                            return (
                                <div
                                    key={id}
                                    aria-selected={isSelected}
                                    className={cn(
                                        "h-full rounded-xl transition-[transform,box-shadow,opacity] duration-200",
                                        isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-background shadow-md",
                                        !isSelected && isDetailsOpen && "opacity-70 hover:opacity-100",
                                        !isSelected && !isDetailsOpen && "hover:shadow-md"
                                    )}
                                >
                                    <OrderCard
                                        data={order}
                                        className="h-full"
                                        onActionClick={(o) => {
                                            const nextId = String(o.id);
                                            setSelectedOrderId((prev) => {
                                                const next = new URLSearchParams(searchParams);
                                                const willSelect = prev !== nextId;

                                                if (willSelect) next.set("order_id", nextId);
                                                else next.delete("order_id");

                                                setSearchParams(next, { replace: true });
                                                return willSelect ? nextId : null;
                                            });
                                        }}
                                        onUserClick={(o) => console.log("Open customer", o.customer)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Details */}
                    {isDetailsOpen ? (
                        <div className="flex-1 h-max rounded-xl border bg-card p-4 sticky top-0 self-start">
                            <OrderDetails orderId={selectedOrderId} />
                        </div>
                    ) : null}
                </div>
            </DataStateGate>
        </Page>
    );
}
