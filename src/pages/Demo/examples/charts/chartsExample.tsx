"use client";

import { lazy, Suspense } from "react";
import { PersonStanding } from "lucide-react";
import { Card, CardHeader } from "@/components";
// charts (lazy loaded)
const BarChart = lazy(() => import("@/eano/components/charts/BarChart"));
const BarChartHorizontal = lazy(() => import("@/eano/components/charts/BarChartHorizontal"));
const BarChartNegative = lazy(() => import("@/eano/components/charts/BarChartNegative"));
const BarChartStacked = lazy(() => import("@/eano/components/charts/BarChartStacked"));
const PieChartLabel = lazy(() => import("@/eano/components/charts/PieChartLabel"));
const PieChartLabelList = lazy(() => import("@/eano/components/charts/PieChartLabelList"));
const PieChartSimple = lazy(() => import("@/eano/components/charts/PieChartSimple"));
const RadarChartDefault = lazy(() => import("@/eano/components/charts/RadarChartDefault"));
const RadarChartDots = lazy(() => import("@/eano/components/charts/RadarChartDots"));
const RadarChartGridCircle = lazy(() => import("@/eano/components/charts/RadarChartGridCircle"));
const RadarChartGridCircleFill = lazy(() => import("@/eano/components/charts/RadarChartGridCircleFill"));
const RadarChartLinesOnly = lazy(() => import("@/eano/components/charts/RadarChartLinesOnly"));
const RadarChartMultiple = lazy(() => import("@/eano/components/charts/RadarChartMultiple"));
const AreaChart = lazy(() => import("@/eano/components/charts/AreaChart"));
const AreaChartLinear = lazy(() => import("@/eano/components/charts/AreaChartLinear"));
const AreaChartStep = lazy(() => import("@/eano/components/charts/AreaChartStep"));

export default function ExampleChartPage() {
  
  const chartDataInteractive = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
    { date: "2024-04-06", desktop: 301, mobile: 340 },
    { date: "2024-04-07", desktop: 245, mobile: 180 },
    { date: "2024-04-08", desktop: 409, mobile: 320 },
    { date: "2024-04-09", desktop: 59, mobile: 110 },
    { date: "2024-04-10", desktop: 261, mobile: 190 },
  ];
  const chartConfigInteractive = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  };

  const chartDataLinear = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfigLinear = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  const chartDataStep = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfigStep = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  const barData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
  ];
  const barConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  };

  const stackedData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const stackedConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  };

  const negativeData = [
    { month: "January", visitors: 186 },
    { month: "February", visitors: 205 },
    { month: "March", visitors: -207 },
    { month: "April", visitors: 173 },
    { month: "May", visitors: -209 },
    { month: "June", visitors: 214 },
  ];
  const negativeConfig = {
    visitors: {
      label: "Visitors",
      color: "var(--chart-1)",
      icon: PersonStanding,
    },
  };

  const pieData = [
    { browser: "chrome", visitors: 275 },
    { browser: "safari", visitors: 200 },
    { browser: "firefox", visitors: 187 },
    { browser: "edge", visitors: 173 },
    { browser: "other", visitors: 90 },
  ];
  const pieConfig = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" },
    firefox: { label: "Firefox", color: "var(--chart-3)" },
    edge: { label: "Edge", color: "var(--chart-4)" },
    other: { label: "Other", color: "var(--chart-5)" },
  };

  const pieLabelData = [
    { browser: "chrome", visitors: 275 },
    { browser: "safari", visitors: 200 },
    { browser: "firefox", visitors: 187 },
    { browser: "edge", visitors: 173 },
    { browser: "other", visitors: 90 },
  ];
  const pieLabelConfig = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" },
    firefox: { label: "Firefox", color: "var(--chart-3)" },
    edge: { label: "Edge", color: "var(--chart-4)" },
    other: { label: "Other", color: "var(--chart-5)" },
  };

  const pieLabelListData = [
    { browser: "chrome", visitors: 275 },
    { browser: "safari", visitors: 200 },
    { browser: "firefox", visitors: 187 },
    { browser: "edge", visitors: 173 },
    { browser: "other", visitors: 90 },
  ];
  const pieLabelListConfig = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" },
    firefox: { label: "Firefox", color: "var(--chart-3)" },
    edge: { label: "Edge", color: "var(--chart-4)" },
    other: { label: "Other", color: "var(--chart-5)" },
  };

  const radarData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 273 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const radarConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  const radarDotsData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 273 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const radarDotsConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  const radarLinesOnlyData = [
    { month: "January", desktop: 186, mobile: 160 },
    { month: "February", desktop: 185, mobile: 170 },
    { month: "March", desktop: 207, mobile: 180 },
    { month: "April", desktop: 173, mobile: 160 },
    { month: "May", desktop: 160, mobile: 190 },
    { month: "June", desktop: 174, mobile: 204 },
  ];
  const radarLinesOnlyConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  };

  const radarGridCircleData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 273 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const radarGridCircleConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  const radarCircleFillData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 285 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 203 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 264 },
  ];
  const radarCircleFillConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  const radarMultipleData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const radarMultipleConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  };

  return (
    <Suspense fallback={<div>Loading charts...</div>}>
      <div className="flex flex-col gap-8 w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="flex justify-center items-center">
          <CardHeader className="w-full">Simple Pie Chart</CardHeader>
          <PieChartSimple
            data={pieData}
            config={pieConfig}
            valueKey="visitors"
            nameKey="browser"
            chartSize={280}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Labele Pie Chart </CardHeader>
          <PieChartLabel
            data={pieLabelData}
            config={pieLabelConfig}
            valueKey="visitors"
            nameKey="browser"
            chartSize={300}
            showLegend={false}
            showLabels={true}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Labele List Pie Chart </CardHeader>
          <PieChartLabelList
            data={pieLabelListData}
            config={pieLabelListConfig}
            valueKey="visitors"
            nameKey="browser"
            chartSize={300}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Radar Chart Default </CardHeader>
          <RadarChartDefault
            data={radarData}
            config={radarConfig}
            xKey="month"
            seriesKey="desktop"
            chartSize={300}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Radar Chart Dots </CardHeader>
          <RadarChartDots
            data={radarDotsData}
            config={radarDotsConfig}
            xKey="month"
            seriesKey="desktop"
            chartSize={300}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Radar Chart Lines Only </CardHeader>
          <RadarChartLinesOnly
            data={radarLinesOnlyData}
            config={radarLinesOnlyConfig}
            xKey="month"
            seriesKeys={["desktop", "mobile"]}
            chartSize={300}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Radar Chart Grid Circle </CardHeader>
          <RadarChartGridCircle
            data={radarGridCircleData}
            config={radarGridCircleConfig}
            xKey="month"
            seriesKeys={["desktop"]}
            chartSize={300}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full">
            {" "}
            Radar Chart Grid Circle Fill{" "}
          </CardHeader>
          <RadarChartGridCircleFill
            data={radarCircleFillData}
            config={radarCircleFillConfig}
            xKey="month"
            seriesKeys={["desktop"]}
            chartSize={300}
            showLegend={false}
          />
        </Card>

        <Card className="flex justify-center items-center">
          <CardHeader className="w-full"> Radar Chart Multiple </CardHeader>
          <RadarChartMultiple
            data={radarMultipleData}
            config={radarMultipleConfig}
            xKey="month"
            seriesKeys={["desktop", "mobile"]}
            chartSize={300}
            showLegend={true}
          />
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>Negative Bar Chart</CardHeader>
          <BarChartNegative
            data={negativeData}
            config={negativeConfig}
            seriesKey="visitors"
            xKey="month"
            chartHeight={260}
          />
        </Card>
      </div>

      <div className="w-full">
        <AreaChart
          data={chartDataInteractive}
          config={chartConfigInteractive}
          xKey="date"
          seriesKeys={["desktop", "mobile"]}
          title="Area Chart - Interactive"
          description="Showing total visitors for the last 3 months"
          defaultRange="30d"
          showRangeSelector={true}
        />
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>Linear Area Chart</CardHeader>
          <AreaChartLinear
            data={chartDataLinear}
            config={chartConfigLinear}
            seriesKeys={["desktop"]}
            xKey="month"
            chartHeight={240}
            type="linear"
            showLegend={false}
          />
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>Step Area Chart</CardHeader>
          <AreaChartStep
            data={chartDataStep}
            config={chartConfigStep}
            seriesKeys={["desktop"]}
            xKey="month"
            chartHeight={240}
            showLegend={false}
          />
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>Bar Chart</CardHeader>
          <BarChart
            data={barData}
            config={barConfig}
            xKey="date"
            seriesKeys={["desktop", "mobile"]}
            chartHeight={260}
            showLegend={true}
          />
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>Horizontal Bar Chart</CardHeader>
          <BarChartHorizontal
            data={barData}
            config={barConfig}
            xKey="desktop"
            yKey="date"
            seriesKey="desktop"
            chartHeight={260}
            showLegend={false}
          />
        </Card>
      </div>

      <div className="w-full">
        <Card>
          <CardHeader>Stacked Bar Chart</CardHeader>
          <BarChartStacked
            data={stackedData}
            config={stackedConfig}
            xKey="month"
            seriesKeys={["desktop", "mobile"]}
            chartHeight={260}
            showLegend={true}
          />
        </Card>
      </div>
      </div>
    </Suspense>
  );
}
