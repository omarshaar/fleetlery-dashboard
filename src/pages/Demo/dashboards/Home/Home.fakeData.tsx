import { faker } from "@faker-js/faker";
import type { ColumnDef } from "@tanstack/react-table";

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface EcommerceOrder {
  orderId: string;
  customer: string;
  date: string;
  total: string;
  status: OrderStatus;
  paymentMethod: string;
}

// Simple alias for translation function type
export type TFunction = (key: string) => string;

export function buildKpiCards(t: TFunction) {
  const todayRevenue = faker.number.int({ min: 12000, max: 42000 });
  const ordersCount = faker.number.int({ min: 350, max: 1100 });
  const newCustomers = faker.number.int({ min: 120, max: 520 });
  const conversionRate = faker.number.int({ min: 18, max: 54 }) / 10; // 1.8 - 5.4

  const formatNumber = (value: number) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const randomGrowth = (min: number, max: number) =>
    faker.number.int({
      min: Math.round(min * 10),
      max: Math.round(max * 10),
    }) / 10;

  return [
    {
      title: t("ecommerce.dashboard.kpis.revenue.title"),
      value: `$${formatNumber(todayRevenue)}`,
      growth: randomGrowth(-4, 26),
      subtitle: t("ecommerce.dashboard.kpis.revenue.subtitle"),
    },
    {
      title: t("ecommerce.dashboard.kpis.orders.title"),
      value: ordersCount,
      growth: randomGrowth(-10, 18),
      subtitle: t("ecommerce.dashboard.kpis.orders.subtitle"),
    },
    {
      title: t("ecommerce.dashboard.kpis.customers.title"),
      value: newCustomers,
      growth: randomGrowth(-3, 12),
      subtitle: t("ecommerce.dashboard.kpis.customers.subtitle"),
    },
    {
      title: t("ecommerce.dashboard.kpis.conversion.title"),
      value: `${conversionRate.toFixed(1)}%`,
      growth: randomGrowth(-1.5, 4.5),
      subtitle: t("ecommerce.dashboard.kpis.conversion.subtitle"),
    },
  ];
}

export function buildProgressWidgetData(t: TFunction) {
  return {
    title: t("ecommerce.dashboard.progress.ordersFulfilled.title"),
    growth:
      faker.number.int({
        min: Math.round(-5 * 10),
        max: Math.round(24 * 10),
      }) / 10,
    growthLabel: t(
      "ecommerce.dashboard.progress.ordersFulfilled.growthLabel",
    ),
    progress: faker.number.int({ min: 35, max: 95 }),
  };
}

export function buildTrafficDistributionData(t: TFunction) {
  return {
    title: t("ecommerce.dashboard.charts.traffic.title"),
    data: [
      {
        source: t("ecommerce.dashboard.charts.traffic.sources.organic"),
        value: 42,
      },
      {
        source: t("ecommerce.dashboard.charts.traffic.sources.paid"),
        value: 27,
      },
      {
        source: t("ecommerce.dashboard.charts.traffic.sources.social"),
        value: 18,
      },
      {
        source: t("ecommerce.dashboard.charts.traffic.sources.referral"),
        value: 13,
      },
    ],
    valueKey: "value",
    nameKey: "source",
    series: [
      {
        key: "value",
        label: t("ecommerce.dashboard.charts.traffic.legend.label"),
        color: "#4f46e5",
      },
    ],
  };
}

export function buildRecentOrdersColumns(
  t: TFunction,
): ColumnDef<EcommerceOrder>[] {
  return [
    {
      accessorKey: "orderId",
      header: t("ecommerce.dashboard.table.orders.columns.orderId"),
    },
    {
      accessorKey: "customer",
      header: t("ecommerce.dashboard.table.orders.columns.customer"),
    },
    {
      accessorKey: "date",
      header: t("ecommerce.dashboard.table.orders.columns.date"),
    },
    {
      accessorKey: "total",
      header: t("ecommerce.dashboard.table.orders.columns.total"),
    },
    {
      accessorKey: "status",
      header: t("ecommerce.dashboard.table.orders.columns.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as OrderStatus;

        const labelMap: Record<OrderStatus, string> = {
          pending: t("ecommerce.dashboard.table.orders.status.pending"),
          paid: t("ecommerce.dashboard.table.orders.status.paid"),
          shipped: t("ecommerce.dashboard.table.orders.status.shipped"),
          cancelled: t("ecommerce.dashboard.table.orders.status.cancelled"),
        };

        const colorMap: Record<OrderStatus, string> = {
          pending:
            "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
          paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
          shipped:
            "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
          cancelled:
            "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
        };

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorMap[status]}`}
          >
            {labelMap[status]}
          </span>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: t("ecommerce.dashboard.table.orders.columns.payment"),
    },
  ];
}

export function buildRecentOrdersData(): EcommerceOrder[] {
  const statuses: OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

  return Array.from({ length: 12 }).map(() => {
    const status = faker.helpers.arrayElement(statuses);
    const amount = faker.number.int({ min: 29, max: 1299 });
    const paymentLabel = faker.helpers.arrayElement([
      "Visa",
      "Mastercard",
      "PayPal",
      "Apple Pay",
      "Amex",
    ]);

    return {
      orderId: `#INV-${faker.number.int({ min: 1000, max: 9999 })}`,
      customer: faker.person.fullName(),
      date: faker.date.recent().toISOString().slice(0, 10),
      total: `$${amount.toLocaleString()}`,
      status,
      paymentMethod: `${paymentLabel} ••${faker.number.int({ min: 10, max: 99 })}`,
    } satisfies EcommerceOrder;
  });
}

export function buildRecentActivityData(t: TFunction) {
  return {
    title: t("ecommerce.dashboard.activity.title"),
    subtitle: t("ecommerce.dashboard.activity.subtitle"),
    items: [
      {
        id: 1,
        title: t("ecommerce.dashboard.activity.items.orderCreated"),
        meta: t("ecommerce.dashboard.activity.meta.fewMinutesAgo"),
      },
      {
        id: 2,
        title: t("ecommerce.dashboard.activity.items.paymentReceived"),
        meta: t("ecommerce.dashboard.activity.meta.fewMinutesAgo"),
      },
      {
        id: 3,
        title: t("ecommerce.dashboard.activity.items.orderShipped"),
        meta: t("ecommerce.dashboard.activity.meta.aboutHourAgo"),
      },
      {
        id: 4,
        title: t("ecommerce.dashboard.activity.items.lowStock"),
        meta: t("ecommerce.dashboard.activity.meta.oneHourAgo"),
      },
    ],
  };
}

export function buildWeeklyTasksData(t: TFunction) {
  return {
    mainTitle: t("ecommerce.dashboard.tasks.mainTitle"),
    title: t("ecommerce.dashboard.tasks.subtitle"),
    stats: [
      {
        value: 18,
        label: t("ecommerce.dashboard.tasks.stats.pending"),
        animated: true,
      },
      {
        value: 46,
        label: t("ecommerce.dashboard.tasks.stats.completed"),
        animated: true,
      },
      {
        value: 6,
        label: t("ecommerce.dashboard.tasks.stats.overdue"),
        animated: true,
      },
    ],
    tasks: [
      {
        id: 1,
        title: t("ecommerce.dashboard.tasks.items.reviewNewProducts"),
        desc: t("ecommerce.dashboard.tasks.items.reviewNewProductsDesc"),
      },
      {
        id: 2,
        title: t("ecommerce.dashboard.tasks.items.checkAbandonedCarts"),
        desc: t("ecommerce.dashboard.tasks.items.checkAbandonedCartsDesc"),
      },
      {
        id: 3,
        title: t("ecommerce.dashboard.tasks.items.prepareCampaign"),
        desc: t("ecommerce.dashboard.tasks.items.prepareCampaignDesc"),
      },
      {
        id: 4,
        title: t("ecommerce.dashboard.tasks.items.updateInventory"),
        desc: t("ecommerce.dashboard.tasks.items.updateInventoryDesc"),
      },
    ],
  };
}

export type LinearChartPoint = { month: string; desktop: number };

export type LinearChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
  };
};

export function buildLinearChartData(): LinearChartPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return months.map((month) => ({
    month,
    desktop: faker.number.int({ min: 120, max: 420 }),
  }));
}

export function buildLinearChartConfig(t: TFunction): LinearChartConfig {
  return {
    desktop: {
      label: t("ecommerce.dashboard.charts.revenue.series.revenue"),
      color: "var(--chart-1)",
    },
  };
}
