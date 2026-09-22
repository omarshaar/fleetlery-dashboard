import { cn } from "@/eano/lib/utils";
import { Button } from "@/eano/components/base-ui/Button";
import {
    ORDER_STATUS_STYLES,
    getOrderStatusLabel,
    type OrderStatusVariant,
} from "@/eano/components/cards/order-status";
import orderDetailsMock from "../mock.data/orderDetails.mock.json";
import {
    ChevronDown,
    MapPin,
    Pencil,
    Printer,
    ShoppingBag,
    User,
} from "lucide-react";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/hooks";

export type OrderDetailsProps = {
    orderId?: string | number | null;
    status?: {
        variant: OrderStatusVariant;
        label?: string;
    } | null;
    className?: string;
};

type OrderDetailsItem = {
    id: string;
    name: string;
    category: string;
    color: string;
    price: number;
    qty: number;
    imageUrl?: string;
};

type OrderDetailsSummary = {
    subtotal: number;
    shipping: number;
    taxes: number;
    discount: number;
    total: number;
};

type OrderDetailsCustomer = {
    name: string;
    email: string;
    phone: string;
    ordersCount: number;
};

type OrderDetailsAddress = {
    name: string;
    line1: string;
    line2: string;
    country: string;
};

type OrderDetailsRecord = {
    orderId: string | number;
    status: {
        variant: OrderStatusVariant;
        label?: string;
    };
    currency: string;
    items: OrderDetailsItem[];
    summary: OrderDetailsSummary;
    customer: OrderDetailsCustomer;
    shippingAddress: OrderDetailsAddress;
    billingAddress: { sameAsShipping: boolean };
};

function formatMoney(amount: number, currency = "$") {
    const fixed = amount.toFixed(2);
    return `${currency}${fixed}`;
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
    return (
        <div className={cn("flex items-center justify-between text-sm", strong && "font-semibold")}> 
            <span className={cn("text-muted-foreground", strong && "text-foreground")}>{label}</span>
            <span className="tabular-nums">{value}</span>
        </div>
    );
}

export function OrderDetails({ orderId, status, className }: OrderDetailsProps) {
    const { t } = useLanguage();

    const params = useParams();
    const [searchParams] = useSearchParams();

    const effectiveOrderId =
        orderId ?? searchParams.get("order_id") ?? params.order_id ?? params.id ?? null;

    const details = useMemo(() => {
        const list = orderDetailsMock as unknown as OrderDetailsRecord[];
        if (!effectiveOrderId) return null;
        return list.find((d) => String(d.orderId) === String(effectiveOrderId)) ?? null;
    }, [effectiveOrderId]);

    const displayStatus = details?.status ?? status ?? null;
    const currency = details?.currency ?? "$";
    const items = details?.items ?? [];
    const summary = details?.summary;
    const customer = details?.customer;
    const shippingAddress = details?.shippingAddress;
    const billingAddress = details?.billingAddress;

    return (
        <section className={cn("w-full", className)} aria-label={t("ecommerce.orderDetails.ariaLabel")}> 
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{t("ecommerce.orderDetails.title")}</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span>
                        {t("ecommerce.orderDetails.orderIdLabel")} :{" "}
                        <span className="font-medium text-foreground">{effectiveOrderId ?? "—"}</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="text-muted-foreground">{t("ecommerce.orderDetails.statusLabel")}:</span>
                        {displayStatus ? (
                            (() => {
                                const styles = ORDER_STATUS_STYLES[displayStatus.variant];
                                const StatusIcon = styles.icon;
                                const statusLabel = getOrderStatusLabel(displayStatus.variant, displayStatus.label);

                                return (
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0",
                                            styles.badge
                                        )}
                                    >
                                        <StatusIcon className="h-3.5 w-3.5" />
                                        <span>{statusLabel}</span>
                                    </span>
                                );
                            })()
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                                —
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {!details ? (
                <div className="mt-5 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    {t("ecommerce.orderDetails.empty")}
                </div>
            ) : null}

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Left */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Items */}
                    <div className="rounded-md border p-3 bg-(--background-page) max-h-96 overflow-y-auto">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold">{t("ecommerce.orderDetails.items.title")}</h3>
                            </div>
                        </div>

                        <div className="w-full mt-1 h-px border-border border border-dashed"></div>

                        <div className="mt-4 space-y-3">
                            {items.map((it) => (
                                <div key={it.id} className="rounded-lg border bg-background p-3">
                                    <div className="flex items-center gap-3">
                                        {it.imageUrl ? (
                                            <img
                                                src={it.imageUrl}
                                                alt={it.name}
                                                className="h-14 w-14 shrink-0 rounded-md border object-cover bg-muted"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 shrink-0 rounded-md border bg-muted" />
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs text-muted-foreground">{it.category}</div>
                                            <div className="truncate font-medium">{it.name}</div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>
                                                    {t("ecommerce.orderDetails.items.colorLabel")} : {it.color}
                                                </span>
                                                <span className="text-muted-foreground/60">•</span>
                                                <span>
                                                    {t("ecommerce.orderDetails.items.qtyLabel")} : {it.qty}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-semibold tabular-nums">{formatMoney(it.price * it.qty, currency)}</div>
                                            <div className="text-xs text-muted-foreground tabular-nums">
                                                {formatMoney(it.price, currency)} {t("ecommerce.orderDetails.items.each")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-md border p-3 bg-(--background-page)">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold">{t("ecommerce.orderDetails.summary.title")}</h3>
                            <Printer className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="w-full mt-1 h-px border-border border border-dashed"></div>

                        <div className="mt-3 space-y-1">
                            <SummaryRow label={t("ecommerce.orderDetails.summary.subtotal")} value={formatMoney(summary?.subtotal ?? 0, currency)} />
                            <SummaryRow label={t("ecommerce.orderDetails.summary.shipping")} value={formatMoney(summary?.shipping ?? 0, currency)} />
                            <SummaryRow label={t("ecommerce.orderDetails.summary.taxes")} value={formatMoney(summary?.taxes ?? 0, currency)} />
                            <SummaryRow label={t("ecommerce.orderDetails.summary.discount")} value={formatMoney(summary?.discount ?? 0, currency)} />
                            <div className="my-2 h-px border-border border border-dashed" />
                            <SummaryRow label={t("ecommerce.orderDetails.summary.total")} value={formatMoney(summary?.total ?? 0, currency)} strong />
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="space-y-4">
                    {/* Customer */}
                    <div className="rounded-md border p-3 bg-(--background-page)">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{t("ecommerce.orderDetails.customer.title")}</h3>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="w-full mt-1 h-px border-border border border-dashed"></div>
                        <div className="mt-3 space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="text-foreground">{customer?.name ?? "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ShoppingBag className="h-4 w-4" />
                                <span>
                                    {t("ecommerce.orderDetails.customer.ordersCount", {
                                        count: customer?.ordersCount ?? 0,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="rounded-md border p-3 bg-(--background-page)">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{t("ecommerce.orderDetails.contact.title")}</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-foreground p-0! h-max! w-max!"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="w-full mt-1 h-px border-border border border-dashed"></div>
                        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <div>{customer?.email ?? "—"}</div>
                            <div>{customer?.phone ?? "—"}</div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-md border p-3 bg-(--background-page)">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{t("ecommerce.orderDetails.shipping.title")}</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-foreground h-max! p-0! w-max!"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="w-full mt-1 h-px border-border border border-dashed"></div>
                        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                            <div className="text-foreground">{shippingAddress?.name ?? "—"}</div>
                            <div>{shippingAddress?.line1 ?? "—"}</div>
                            <div>{shippingAddress?.line2 ?? "—"}</div>
                            <div>{shippingAddress?.country ?? "—"}</div>
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="mt-2 h-auto justify-start px-0 py-0"
                            >
                                <MapPin className="h-4 w-4" />
                                {t("ecommerce.orderDetails.shipping.viewOnMap")}
                            </Button>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="rounded-md border p-3 bg-(--background-page)">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{t("ecommerce.orderDetails.billing.title")}</h3>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="w-full mt-1 h-px border-border border border-dashed "></div>
                        <div className="mt-3 text-sm text-muted-foreground">
                            {billingAddress?.sameAsShipping ? t("ecommerce.orderDetails.billing.sameAsShipping") : "—"}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
