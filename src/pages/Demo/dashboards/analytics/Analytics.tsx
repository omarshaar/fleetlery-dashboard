import { useMemo } from "react";
import { Download, SlidersHorizontal } from "lucide-react";

import { useLanguage } from "@/i18n/hooks";

import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";
import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget";
import { StatProgressWidget } from "@/eano/components/widgets/StatProgressWidget";
import { ChartWidgetContainer } from "@/eano/components/widgets/ChartWidgetContainer";
import { PieDistributionWidget } from "@/eano/components/widgets/PieDistributionWidget";
import { RadarWidget } from "@/eano/components/widgets/RadarWidget";
import { ProgressSummaryWidget } from "@/eano/components/widgets/ProgressSummaryWidget";
import { SummaryListWidget } from "@/eano/components/widgets/SummaryListWidget";

import { Button } from "@/eano/design-system/shadcn/button";

import AreaChartLinear from "@/eano/components/charts/AreaChartLinear";
import BarChartStacked from "@/eano/components/charts/BarChartStacked";
import AreaChartStep from "@/eano/components/charts/AreaChartStep";
import BarChartHorizontal from "@/eano/components/charts/BarChartHorizontal";
import PieChartLabelList from "@/eano/components/charts/PieChartLabelList";

import { DataTable } from "@/eano/data-table-builder";

import {
  buildKpiCards,
  buildConversionProgress,
  buildRevenueTrendConfig,
  buildRevenueTrendData,
  buildChannelStackedConfig,
  buildChannelStackedData,
  buildPaymentDistributionData,
  buildRefundsTrendConfig,
  buildRefundsTrendData,
  buildCategoryRevenueConfig,
  buildCategoryRevenueData,
  buildDeviceShareConfig,
  buildDeviceShareData,
  buildCustomerSegmentsRadarData,
  buildCheckoutFunnelProgressData,
  buildInsightsListData,
  buildTopProductsColumns,
  buildTopProductsData,
} from "./Analytics.fakeData";

export default function AnalyticsDashboardPage() {
  const { t } = useLanguage();

  const kpis = useMemo(() => buildKpiCards(t), [t]);

  const conversionProgress = useMemo(() => buildConversionProgress(t), [t]);

  const revenueTrendData = useMemo(() => buildRevenueTrendData(), []);
  const revenueTrendConfig = useMemo(() => buildRevenueTrendConfig(t), [t]);

  const channelData = useMemo(() => buildChannelStackedData(), []);
  const channelConfig = useMemo(() => buildChannelStackedConfig(t), [t]);

  const paymentDistribution = useMemo(
    () => buildPaymentDistributionData(t),
    [t]
  );

  const refundsTrendData = useMemo(() => buildRefundsTrendData(), []);
  const refundsTrendConfig = useMemo(() => buildRefundsTrendConfig(t), [t]);

  const categoryRevenueData = useMemo(() => buildCategoryRevenueData(t), [t]);
  const categoryRevenueConfig = useMemo(
    () => buildCategoryRevenueConfig(t),
    [t]
  );

  const deviceShareData = useMemo(() => buildDeviceShareData(), []);
  const deviceShareConfig = useMemo(() => buildDeviceShareConfig(t), [t]);

  const segmentsRadarData = useMemo(
    () => buildCustomerSegmentsRadarData(t),
    [t]
  );

  const funnelProgress = useMemo(() => buildCheckoutFunnelProgressData(t), [t]);
  const insightsList = useMemo(() => buildInsightsListData(t), [t]);

  const topProductsColumns = useMemo(() => buildTopProductsColumns(t), [t]);
  const topProductsData = useMemo(() => buildTopProductsData(), []);

  return (
    <Page>
      <PageHeader
        className="mb-4"
        title={t("ecommerce.analytics.pageTitle")}
        subtitle={t("ecommerce.analytics.pageSubtitle")}
      >
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          {t("ecommerce.analytics.actions.filters")}
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          {t("ecommerce.analytics.actions.export")}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 auto-rows-[120px] md:auto-rows-[140px]">
        {kpis.map((card) => (
          <StatMiniWidget key={card.title} data={card} animated className="h-full" />
        ))}

        <StatProgressWidget data={conversionProgress} animated className="h-full" />
      </div>

      <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3 auto-rows-[320px]">
        <div className="lg:col-span-2">
          <ChartWidgetContainer
            title={t("ecommerce.analytics.charts.revenueTrend.title")}
            description={t("ecommerce.analytics.charts.revenueTrend.subtitle")}
          >
            <AreaChartLinear
              data={revenueTrendData}
              config={revenueTrendConfig}
              seriesKeys={["revenue", "orders"]}
              xKey="month"
              chartHeight={220}
              type="linear"
              showLegend={false}
            />
          </ChartWidgetContainer>
        </div>

        <PieDistributionWidget
          data={paymentDistribution}
          chartSize={220}
          className="lg:col-span-1"
        />

        <div className="lg:col-span-3">
          <ChartWidgetContainer
            title={t("ecommerce.analytics.charts.channels.title")}
            description={t("ecommerce.analytics.charts.channels.subtitle")}
            footer={t("ecommerce.analytics.charts.channels.footer")}
          >
            <BarChartStacked
              data={channelData}
              config={channelConfig}
              seriesKeys={["organic", "paid", "social"]}
              xKey="month"
              chartHeight={210}
              showLegend
            />
          </ChartWidgetContainer>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3 auto-rows-[320px]">
        <ChartWidgetContainer
          title={t("ecommerce.analytics.charts.refunds.title")}
          description={t("ecommerce.analytics.charts.refunds.subtitle")}
        >
          <AreaChartStep
            data={refundsTrendData}
            config={refundsTrendConfig}
            seriesKeys={["refunds"]}
            xKey="month"
            chartHeight={220}
            showLegend={false}
          />
        </ChartWidgetContainer>

        <ChartWidgetContainer
          title={t("ecommerce.analytics.charts.categories.title")}
          description={t("ecommerce.analytics.charts.categories.subtitle")}
        >
          <BarChartHorizontal
            data={categoryRevenueData}
            config={categoryRevenueConfig}
            xKey="revenue"
            yKey="category"
            seriesKey="revenue"
            chartHeight={220}
            showLegend={false}
          />
        </ChartWidgetContainer>

        <ChartWidgetContainer
          title={t("ecommerce.analytics.charts.devices.title")}
          description={t("ecommerce.analytics.charts.devices.subtitle")}
        >
          <PieChartLabelList
            data={deviceShareData}
            config={deviceShareConfig}
            valueKey="visitors"
            nameKey="device"
            chartSize={220}
            showLegend={false}
          />
        </ChartWidgetContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3 auto-rows-[320px]">
        <RadarWidget data={segmentsRadarData} />
        <ProgressSummaryWidget data={funnelProgress} />
        <SummaryListWidget data={insightsList} />
      </div>

      <div className="w-full h-max mt-3 grid grid-cols-1 auto-rows-[380px]">
        <DataTable
          tableId="analytics-top-products"
          title={t("ecommerce.analytics.table.topProducts.title")}
          description={t("ecommerce.analytics.table.topProducts.caption")}
          data={topProductsData}
          columns={topProductsColumns}
          preset="standard"
          className="h-full"
        />
      </div>
    </Page>
  );
}
