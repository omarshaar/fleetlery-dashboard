import { Badge, Popover } from "@/components";
import { Button } from "@/eano/components/base-ui/Button";
import { cn } from "@/eano/lib/utils";
import { DynamicForm } from "@/eano/form-builder/DynamicForm";
import { fillFormValues } from "@/eano/form-builder/core/formApi";
import { makeSelectFormValues } from "@/eano/form-builder/core/selectors";
import type { FormConfig, FormField } from "@/eano/form-builder/types/form.types";
import { useLanguage } from "@/i18n/hooks";
import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

export type StatusVariant = "active" | "processing" | "shipped" | "delivered" | "overdue" | "cancelled";
export type ChannelType = "website" | "in_store" | "marketplace" | "delivery" | "pickup";

export type OrdersFiltersState = {
    query: string;
    statuses: StatusVariant[];
    channels: ChannelType[];
    minTotal: string;
    maxTotal: string;
};

export const DEFAULT_ORDERS_FILTERS: OrdersFiltersState = {
    query: "",
    statuses: [],
    channels: [],
    minTotal: "",
    maxTotal: "",
};

const STATUS_VALUES: StatusVariant[] = ["active", "processing", "shipped", "delivered", "overdue", "cancelled"];

const CHANNEL_VALUES: ChannelType[] = ["website", "marketplace", "in_store", "delivery", "pickup"];

function countActiveFilters(filters: OrdersFiltersState) {
    let count = 0;
    if (filters.query.trim()) count += 1;
    if (filters.statuses.length > 0) count += 1;
    if (filters.channels.length > 0) count += 1;
    if (filters.minTotal.trim() || filters.maxTotal.trim()) count += 1;
    return count;
}

export type OrderLikeForFiltering = {
    id: string | number;
    status: { variant: StatusVariant };
    customer: { name?: string; channel?: { type?: ChannelType } };
    items: Array<{ name?: string }>;
    total?: { amount?: number };
};

export function filterOrders<TOrder extends OrderLikeForFiltering>(
    orders: TOrder[],
    filters: OrdersFiltersState
) {
    const query = filters.query.trim().toLowerCase();
    const minTotal = filters.minTotal.trim() ? Number(filters.minTotal) : null;
    const maxTotal = filters.maxTotal.trim() ? Number(filters.maxTotal) : null;
    const hasMin = typeof minTotal === "number" && Number.isFinite(minTotal);
    const hasMax = typeof maxTotal === "number" && Number.isFinite(maxTotal);

    return orders.filter((order) => {
        if (filters.statuses.length > 0) {
            const variant = String(order.status.variant) as StatusVariant;
            if (!filters.statuses.includes(variant)) return false;
        }

        if (filters.channels.length > 0) {
            const channel = (order.customer.channel?.type ? String(order.customer.channel.type) : "") as ChannelType;
            if (!channel || !filters.channels.includes(channel)) return false;
        }

        if (hasMin || hasMax) {
            const amount = Number(order.total?.amount ?? 0);
            if (hasMin && amount < (minTotal as number)) return false;
            if (hasMax && amount > (maxTotal as number)) return false;
        }

        if (query) {
            const idMatch = String(order.id).toLowerCase().includes(query);
            const customerMatch = String(order.customer?.name ?? "").toLowerCase().includes(query);
            const itemsMatch = (order.items ?? []).some((it) => String(it.name ?? "").toLowerCase().includes(query));
            if (!idMatch && !customerMatch && !itemsMatch) return false;
        }

        return true;
    });
}

export type OrdersFiltersProps = {
    value: OrdersFiltersState;
    onChange: (next: OrdersFiltersState) => void;
    className?: string;
};

export function OrdersFilters({ value, onChange, className }: OrdersFiltersProps) {
    const { t } = useLanguage();

    const [open, setOpen] = useState(false);
    const formId = "ecommerce.orders.filters";

    const selectValues = useMemo(() => makeSelectFormValues(formId), [formId]);
    const formValues = useSelector(selectValues) as Record<string, any>;

    const activeCount = useMemo(() => countActiveFilters(value), [value]);

    const preventEnterSubmit = useMemo(
        () =>
            (e: React.KeyboardEvent) => {
                if (e.key === "Enter") e.preventDefault();
            },
        []
    );

    const toFormValues = useMemo(() => {
        return (filters: OrdersFiltersState) => {
            const result: Record<string, any> = {
                query: filters.query,
                minTotal: filters.minTotal,
                maxTotal: filters.maxTotal,
            };

            for (const variant of STATUS_VALUES) {
                result[`status_${variant}`] = filters.statuses.includes(variant);
            }

            for (const channel of CHANNEL_VALUES) {
                result[`channel_${channel}`] = filters.channels.includes(channel);
            }

            return result;
        };
    }, []);

    const fromFormValues = useMemo(() => {
        return (values: Record<string, any>): OrdersFiltersState => {
            const statuses = STATUS_VALUES.filter((variant) => Boolean(values[`status_${variant}`]));
            const channels = CHANNEL_VALUES.filter((channel) => Boolean(values[`channel_${channel}`]));

            return {
                query: String(values.query ?? ""),
                statuses,
                channels,
                minTotal: String(values.minTotal ?? ""),
                maxTotal: String(values.maxTotal ?? ""),
            };
        };
    }, []);

    const schema = useMemo<FormField[]>(() => {
        const statusFields: FormField[] = STATUS_VALUES.map((variant) => ({
            type: "checkbox",
            name: `status_${variant}`,
            label: t(`ecommerce.orders.filters.status.options.${variant}`),
            grid: "6",
            defaultValue: value.statuses.includes(variant),
        }));

        const channelFields: FormField[] = CHANNEL_VALUES.map((channel) => ({
            type: "checkbox",
            name: `channel_${channel}`,
            label: t(`ecommerce.orders.filters.channel.options.${channel}`),
            grid: "6",
            defaultValue: value.channels.includes(channel),
        }));

        return [
            {
                type: "input",
                name: "query",
                label: t("ecommerce.orders.filters.search.label"),
                grid: "12",
                defaultValue: value.query,
                placeholder: t("ecommerce.orders.filters.search.placeholder"),
                props: {
                    onKeyDown: preventEnterSubmit,
                },
            },
            { component: "divider", name: "divider_1", grid: "12" },

            {
                component: "heading",
                name: "heading_status",
                grid: "12",
                props: { text: t("ecommerce.orders.filters.status.title") },
            },
            {
                type: "container",
                grid: "12",
                className: "bg-transparent! p-0! gap-2!",
                innerGrid: { cols: 12, gap: 2 },
                children: statusFields,
            },
            { component: "divider", name: "divider_2", grid: "12" },

            {
                component: "heading",
                name: "heading_channel",
                grid: "12",
                props: { text: t("ecommerce.orders.filters.channel.title") },
            },
            {
                type: "container",
                grid: "12",
                className: "bg-transparent! p-0! gap-2!",
                innerGrid: { cols: 12, gap: 2 },
                children: channelFields,
            },
            { component: "divider", name: "divider_3", grid: "12" },

            {
                component: "heading",
                name: "heading_total",
                grid: "12",
                props: { text: t("ecommerce.orders.filters.total.title") },
            },
            {
                type: "container",
                grid: "12",
                className: "bg-transparent! p-0!",
                innerGrid: { cols: 12, gap: 2 },
                children: [
                    {
                        type: "input",
                        name: "minTotal",
                        label: t("ecommerce.orders.filters.total.min"),
                        grid: "6",
                        defaultValue: value.minTotal,
                        placeholder: t("ecommerce.orders.filters.total.minPlaceholder"),
                        props: {
                            type: "number",
                            inputMode: "decimal",
                            onKeyDown: preventEnterSubmit,
                        },
                    },
                    {
                        type: "input",
                        name: "maxTotal",
                        label: t("ecommerce.orders.filters.total.max"),
                        grid: "6",
                        defaultValue: value.maxTotal,
                        placeholder: t("ecommerce.orders.filters.total.maxPlaceholder"),
                        props: {
                            type: "number",
                            inputMode: "decimal",
                            onKeyDown: preventEnterSubmit,
                        },
                    },
                ],
            },
        ];
    }, [preventEnterSubmit, t, formId, toFormValues, value]);

    const config = useMemo<FormConfig>(
        () => ({
            formId
        }),
        [formId]
    );

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
            }}
            content={
                <div className={cn("space-y-4", className)}>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{t("ecommerce.orders.filters.title")}</div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground"
                            onClick={() => setOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <DynamicForm config={config} schema={schema} />

                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    fillFormValues(formId, toFormValues(value));
                                    setOpen(false);
                                }}
                            >
                                {t("ecommerce.orders.filters.actions.cancel")}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    onChange(fromFormValues(formValues));
                                    setOpen(false);
                                }}
                            >
                                {t("ecommerce.orders.filters.actions.apply")}
                            </Button>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => fillFormValues(formId, toFormValues(DEFAULT_ORDERS_FILTERS))}
                            className="w-full"
                        >
                            {t("ecommerce.orders.filters.actions.clear")}
                        </Button>
                    </div>
                </div>
            }
        >
            <Button type="button" variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {t("ecommerce.orders.filters.button")}
                {activeCount > 0 ? (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {activeCount}
                    </Badge>
                ) : null}
            </Button>
        </Popover>
    );
}
