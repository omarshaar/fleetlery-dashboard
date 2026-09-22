import { useMemo } from "react";
import { useLanguage } from "@/i18n/hooks";
import PageHeader from "@/eano/components/widgets/PageHeader";
import { Button } from "@/eano/design-system/shadcn/button";
import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget";
import { ChartWidgetContainer } from "@/eano/components/widgets/ChartWidgetContainer";
import { SummaryListWidget } from "@/eano/components/widgets/SummaryListWidget";
import { WeeklyTasksWidget } from "@/eano/components/widgets/WeeklyTasksWidget";
import { DataTable } from "@/eano/data-table-builder";
import AreaChartLinear from "@/eano/components/charts/AreaChartLinear";
import {
  buildKpiCards,
  buildRecentOrdersColumns,
  buildRecentOrdersData,
  buildRecentActivityData,
  buildWeeklyTasksData,
  buildLinearChartData,
  buildLinearChartConfig,
} from "./Home.fakeData";
import { Page } from "@/eano/components/page/Page";

export default function HomeDashboardPage() {
  const { t } = useLanguage();

  const kpiCards = useMemo(() => buildKpiCards(t), [t]);

  const chartDataLinear = useMemo(() => buildLinearChartData(), []);

  const chartConfigLinear = useMemo(() => buildLinearChartConfig(t), [t]);

  const recentOrdersColumns = useMemo(() => buildRecentOrdersColumns(t), [t]);

  const recentOrdersData = useMemo(() => buildRecentOrdersData(), []);

  const recentActivityData = useMemo(() => buildRecentActivityData(t), [t]);

  const weeklyTasksData = useMemo(() => buildWeeklyTasksData(t), [t]);

  return (
    <Page>
      <PageHeader
        className="mb-4"
        title={t("ecommerce.dashboard.pageTitle")}
        subtitle={t("ecommerce.dashboard.pageSubtitle")}
      >
        <Button variant="outline" size="sm">
          {t("ecommerce.dashboard.actions.export")}
        </Button>
        <Button size="sm" className="ml-2">
          {t("ecommerce.dashboard.actions.newProduct")}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-3 auto-rows-[140px] md:auto-rows-[140px]">
        {kpiCards.map((card, index) => (
          <StatMiniWidget
            key={card.title}
            data={card}
            animated
            className="h-full"
            navigateTo={index === 0 ? "/orders" : undefined}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 auto-rows-[140px] md:auto-rows-[140px]">
        <div className="row-span-2">
          <ChartWidgetContainer
            title={t("ecommerce.dashboard.charts.revenue.title")}
            description={t("ecommerce.dashboard.charts.revenue.subtitle")}
          >
            <AreaChartLinear
              data={chartDataLinear}
              config={chartConfigLinear}
              seriesKeys={["desktop"]}
              xKey="month"
              chartHeight={200}
              type="linear"
              showLegend={false}
            />
          </ChartWidgetContainer>
        </div>
      </div>

      <div className="w-full h-max mt-3 grid grid-cols-1 auto-rows-[380px]">
        <DataTable
          tableId="home-recent-orders"
          title={t("ecommerce.dashboard.table.orders.title")}
          description={t("ecommerce.dashboard.table.orders.caption")}
          data={recentOrdersData}
          columns={recentOrdersColumns}
          preset="standard"
          className="h-full"
        />
      </div>

      <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[160px]">
        <div className="col-span-1 md:col-span-2 row-span-2">
          <WeeklyTasksWidget data={weeklyTasksData} />
        </div>
        <div className="col-span-1 row-span-2">
          <SummaryListWidget data={recentActivityData} />
        </div>
      </div>
    </Page>
  );
}
