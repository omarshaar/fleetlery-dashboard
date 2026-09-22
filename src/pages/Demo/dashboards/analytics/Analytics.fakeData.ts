import { faker } from "@faker-js/faker";
import { createElement } from "react";
import {
  AlertTriangle,
  BadgePercent,
  PackageMinus,
  Star,
} from "lucide-react";
import type { ColumnConfig } from "@/eano/data-table-builder";

export type TFunction = (key: string) => string;

export function buildKpiCards(t: TFunction) {
  const revenue = faker.number.int({ min: 45000, max: 210000 });
  const orders = faker.number.int({ min: 420, max: 1900 });
  const conversion = faker.number.int({ min: 18, max: 62 }) / 10; // 1.8% - 6.2%
  const aov = faker.number.int({ min: 28, max: 140 });

  const randomGrowth = (min: number, max: number) =>
    faker.number.int({ min: Math.round(min * 10), max: Math.round(max * 10) }) /
    10;

  return [
    {
      title: t("ecommerce.analytics.kpis.revenue.title"),
      value: `$${revenue.toLocaleString()}`,
      growth: randomGrowth(-6, 22),
      subtitle: t("ecommerce.analytics.kpis.revenue.subtitle"),
    },
    {
      title: t("ecommerce.analytics.kpis.orders.title"),
      value: orders,
      growth: randomGrowth(-10, 18),
      subtitle: t("ecommerce.analytics.kpis.orders.subtitle"),
    },
    {
      title: t("ecommerce.analytics.kpis.conversion.title"),
      value: `${conversion.toFixed(1)}%`,
      growth: randomGrowth(-1.8, 3.8),
      subtitle: t("ecommerce.analytics.kpis.conversion.subtitle"),
    },
    {
      title: t("ecommerce.analytics.kpis.aov.title"),
      value: `$${aov.toLocaleString()}`,
      growth: randomGrowth(-3, 11),
      subtitle: t("ecommerce.analytics.kpis.aov.subtitle"),
    },
  ];
}

export function buildConversionProgress(t: TFunction) {
  return {
    title: t("ecommerce.analytics.progress.checkoutCompletion.title"),
    growth: faker.number.int({ min: -25, max: 25 }) / 10,
    growthLabel: t("ecommerce.analytics.progress.checkoutCompletion.growthLabel"),
    progress: faker.number.int({ min: 48, max: 92 }),
  };
}

export type RevenueTrendPoint = {
  month: string;
  revenue: number;
  orders: number;
};

export function buildRevenueTrendData(): RevenueTrendPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return months.map((month) => ({
    month,
    revenue: faker.number.int({ min: 18000, max: 62000 }),
    orders: faker.number.int({ min: 320, max: 1200 }),
  }));
}

export function buildRevenueTrendConfig(t: TFunction) {
  return {
    revenue: {
      label: t("ecommerce.analytics.charts.revenueTrend.series.revenue"),
      color: "var(--chart-1)",
    },
    orders: {
      label: t("ecommerce.analytics.charts.revenueTrend.series.orders"),
      color: "var(--chart-2)",
    },
  };
}

export type ChannelPoint = {
  month: string;
  organic: number;
  paid: number;
  social: number;
};

export function buildChannelStackedData(): ChannelPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return months.map((month) => ({
    month,
    organic: faker.number.int({ min: 140, max: 520 }),
    paid: faker.number.int({ min: 90, max: 420 }),
    social: faker.number.int({ min: 40, max: 220 }),
  }));
}

export function buildChannelStackedConfig(t: TFunction) {
  return {
    organic: {
      label: t("ecommerce.analytics.charts.channels.series.organic"),
      color: "var(--chart-3)",
    },
    paid: {
      label: t("ecommerce.analytics.charts.channels.series.paid"),
      color: "var(--chart-4)",
    },
    social: {
      label: t("ecommerce.analytics.charts.channels.series.social"),
      color: "var(--chart-5)",
    },
  };
}

export function buildPaymentDistributionData(t: TFunction) {
  return {
    title: t("ecommerce.analytics.charts.payments.title"),
    valueKey: "value",
    nameKey: "method",
    series: [
      {
        key: "visa",
        label: t("ecommerce.analytics.charts.payments.methods.visa"),
        color: "var(--chart-1)",
      },
      {
        key: "mastercard",
        label: t("ecommerce.analytics.charts.payments.methods.mastercard"),
        color: "var(--chart-2)",
      },
      {
        key: "paypal",
        label: t("ecommerce.analytics.charts.payments.methods.paypal"),
        color: "var(--chart-3)",
      },
      {
        key: "cod",
        label: t("ecommerce.analytics.charts.payments.methods.cod"),
        color: "var(--chart-4)",
      },
    ],
    data: [
      { method: "visa", value: faker.number.int({ min: 260, max: 480 }) },
      {
        method: "mastercard",
        value: faker.number.int({ min: 170, max: 340 }),
      },
      { method: "paypal", value: faker.number.int({ min: 120, max: 260 }) },
      { method: "cod", value: faker.number.int({ min: 60, max: 170 }) },
    ],
  };
}

export type RefundsTrendPoint = {
  month: string;
  refunds: number;
};

export function buildRefundsTrendData(): RefundsTrendPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // keep short for axis formatter

  return months.map((month) => ({
    month,
    refunds: faker.number.int({ min: 20, max: 220 }),
  }));
}

export function buildRefundsTrendConfig(t: TFunction) {
  return {
    refunds: {
      label: t("ecommerce.analytics.charts.refunds.series.refunds"),
      color: "var(--chart-4)",
    },
  };
}

export type CategoryRevenuePoint = {
  category: string;
  revenue: number;
};

export function buildCategoryRevenueData(t: TFunction): CategoryRevenuePoint[] {
  const categories = [
    t("ecommerce.analytics.charts.categories.labels.electronics"),
    t("ecommerce.analytics.charts.categories.labels.fashion"),
    t("ecommerce.analytics.charts.categories.labels.home"),
    t("ecommerce.analytics.charts.categories.labels.beauty"),
    t("ecommerce.analytics.charts.categories.labels.sports"),
  ];

  return categories.map((category) => ({
    category,
    revenue: faker.number.int({ min: 12000, max: 88000 }),
  }));
}

export function buildCategoryRevenueConfig(t: TFunction) {
  return {
    revenue: {
      label: t("ecommerce.analytics.charts.categories.series.revenue"),
      color: "var(--chart-2)",
    },
  };
}

export type DeviceSharePoint = {
  device: "desktop" | "mobile" | "tablet";
  visitors: number;
};

export function buildDeviceShareData(): DeviceSharePoint[] {
  return [
    { device: "desktop", visitors: faker.number.int({ min: 280, max: 620 }) },
    { device: "mobile", visitors: faker.number.int({ min: 360, max: 880 }) },
    { device: "tablet", visitors: faker.number.int({ min: 80, max: 240 }) },
  ];
}

export function buildDeviceShareConfig(t: TFunction) {
  return {
    desktop: {
      label: t("ecommerce.analytics.charts.devices.segments.desktop"),
      color: "var(--chart-1)",
    },
    mobile: {
      label: t("ecommerce.analytics.charts.devices.segments.mobile"),
      color: "var(--chart-3)",
    },
    tablet: {
      label: t("ecommerce.analytics.charts.devices.segments.tablet"),
      color: "var(--chart-5)",
    },
  };
}

export function buildCustomerSegmentsRadarData(t: TFunction) {
  return {
    title: t("ecommerce.analytics.charts.segments.title"),
    xKey: "segment",
    series: [
      {
        key: "thisMonth",
        label: t("ecommerce.analytics.charts.segments.series.thisMonth"),
        color: "var(--chart-1)",
      },
      {
        key: "lastMonth",
        label: t("ecommerce.analytics.charts.segments.series.lastMonth"),
        color: "var(--chart-2)",
      },
    ],
    data: [
      {
        segment: t("ecommerce.analytics.charts.segments.axes.new"),
        thisMonth: faker.number.int({ min: 35, max: 95 }),
        lastMonth: faker.number.int({ min: 35, max: 95 }),
      },
      {
        segment: t("ecommerce.analytics.charts.segments.axes.returning"),
        thisMonth: faker.number.int({ min: 35, max: 95 }),
        lastMonth: faker.number.int({ min: 35, max: 95 }),
      },
      {
        segment: t("ecommerce.analytics.charts.segments.axes.vip"),
        thisMonth: faker.number.int({ min: 35, max: 95 }),
        lastMonth: faker.number.int({ min: 35, max: 95 }),
      },
      {
        segment: t("ecommerce.analytics.charts.segments.axes.wholesale"),
        thisMonth: faker.number.int({ min: 35, max: 95 }),
        lastMonth: faker.number.int({ min: 35, max: 95 }),
      },
      {
        segment: t("ecommerce.analytics.charts.segments.axes.guest"),
        thisMonth: faker.number.int({ min: 35, max: 95 }),
        lastMonth: faker.number.int({ min: 35, max: 95 }),
      },
    ],
  };
}

export function buildCheckoutFunnelProgressData(t: TFunction) {
  const addToCart = faker.number.int({ min: 18, max: 42 });
  const checkout = faker.number.int({ min: 10, max: Math.max(12, addToCart - 6) });
  const purchase = faker.number.int({ min: 4, max: Math.max(6, checkout - 4) });

  return {
    title: t("ecommerce.analytics.widgets.funnel.title"),
    subtitle: t("ecommerce.analytics.widgets.funnel.subtitle"),
    items: [
      {
        label: t("ecommerce.analytics.widgets.funnel.steps.visits"),
        value: 100,
        color: "bg-sky-500",
      },
      {
        label: t("ecommerce.analytics.widgets.funnel.steps.addToCart"),
        value: addToCart,
        color: "bg-indigo-500",
      },
      {
        label: t("ecommerce.analytics.widgets.funnel.steps.checkout"),
        value: checkout,
        color: "bg-amber-500",
      },
      {
        label: t("ecommerce.analytics.widgets.funnel.steps.purchase"),
        value: purchase,
        color: "bg-emerald-500",
      },
    ],
  };
}

export function buildInsightsListData(t: TFunction) {
  return {
    title: t("ecommerce.analytics.widgets.insights.title"),
    subtitle: t("ecommerce.analytics.widgets.insights.subtitle"),
    items: [
      {
        id: "best-seller",
        title: t("ecommerce.analytics.widgets.insights.items.bestSeller"),
        meta: t("ecommerce.analytics.widgets.insights.meta.last24h"),
        icon: createElement(Star, { className: "h-4 w-4" }),
      },
      {
        id: "coupon-usage",
        title: t("ecommerce.analytics.widgets.insights.items.coupons"),
        meta: t("ecommerce.analytics.widgets.insights.meta.last7d"),
        icon: createElement(BadgePercent, { className: "h-4 w-4" }),
      },
      {
        id: "low-stock",
        title: t("ecommerce.analytics.widgets.insights.items.lowStock"),
        meta: t("ecommerce.analytics.widgets.insights.meta.today"),
        icon: createElement(AlertTriangle, { className: "h-4 w-4" }),
      },
      {
        id: "refunds",
        title: t("ecommerce.analytics.widgets.insights.items.refunds"),
        meta: t("ecommerce.analytics.widgets.insights.meta.thisWeek"),
        icon: createElement(PackageMinus, { className: "h-4 w-4" }),
      },
    ],
  };
}

export interface TopProductRow {
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: string;
  stock: number;
}

export function buildTopProductsColumns(t: TFunction): ColumnConfig<TopProductRow>[] {
  return [
    {
      key: "sku",
      label: t("ecommerce.analytics.table.topProducts.columns.sku"),
      type: "text",
      sortable: true,
    },
    {
      key: "name",
      label: t("ecommerce.analytics.table.topProducts.columns.product"),
      type: "text",
      sortable: true,
    },
    {
      key: "category",
      label: t("ecommerce.analytics.table.topProducts.columns.category"),
      type: "text",
    },
    {
      key: "unitsSold",
      label: t("ecommerce.analytics.table.topProducts.columns.units"),
      type: "text",
      sortable: true,
    },
    {
      key: "revenue",
      label: t("ecommerce.analytics.table.topProducts.columns.revenue"),
      type: "text",
      sortable: true,
    },
    {
      key: "stock",
      label: t("ecommerce.analytics.table.topProducts.columns.stock"),
      type: "text",
    },
  ];
}

export function buildTopProductsData(): TopProductRow[] {
  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];

  return Array.from({ length: 10 }).map(() => {
    const unitsSold = faker.number.int({ min: 40, max: 620 });
    const price = faker.number.int({ min: 18, max: 240 });
    const revenue = unitsSold * price;

    return {
      sku: `SKU-${faker.number.int({ min: 10000, max: 99999 })}`,
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      unitsSold,
      revenue: `$${revenue.toLocaleString()}`,
      stock: faker.number.int({ min: 0, max: 220 }),
    } satisfies TopProductRow;
  });
}
