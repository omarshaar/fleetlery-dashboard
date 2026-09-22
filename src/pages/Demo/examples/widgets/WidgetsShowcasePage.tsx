/**
 * WidgetsShowcasePage
 *
 * A dedicated page to display all dashboard widgets
 * in a clean 4-column responsive grid layout.
 *
 * This page represents only the content inside the main layout
 * (without sidebar / header).
 */

import {
  RadarWidget,
  type RadarData,
} from "@/eano/components/widgets/RadarWidget";
import { ClockPreviewWidget } from "@/eano/components/widgets/ClockPreviewWidget";
import { ContributionMatrixWidget } from "@/eano/components/widgets/ContributionMatrixWidget";
import { RotaryDialWidget } from "@/eano/components/widgets/DialControlWidget";
import { ProgressSummaryWidget } from "@/eano/components/widgets/ProgressSummaryWidget";
import { SmartToggleWidget } from "@/eano/components/widgets/SmartToggleWidget";
import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget";
import { StatProgressWidget } from "@/eano/components/widgets/StatProgressWidget";
import { SummaryListWidget } from "@/eano/components/widgets/SummaryListWidget";
import { ValueSummaryWidget } from "@/eano/components/widgets/ValueSummaryWidget";
import { WeeklyTasksWidget } from "@/eano/components/widgets/WeeklyTasksWidget";
import { DollarSign, Lightbulb, PersonStanding, ShoppingCart, Users } from "lucide-react";
import React from "react";
import {
  PieDistributionWidget,
  type PieDistributionData,
} from "@/eano/components/widgets/PieDistributionWidget";
import { ChartWidgetContainer } from "@/eano/components/widgets/ChartWidgetContainer";
import BarChartNegative from "@/eano/components/charts/BarChartNegative";

export default function WidgetsShowcasePage() {
  const [lampState, setLampState] = React.useState(true);
  const [currentValue, setCurrentValue] = React.useState(45);
  const avgSalaryRadarData: RadarData = {
    title: "Avg. salary",
    xKey: "role",
    series: [
      { key: "alpha", label: 'Team "Alpha"' },
      { key: "beta", label: 'Team "Beta"' },
    ],
    data: [
      { role: "Development", alpha: 90, beta: 80 },
      { role: "Design", alpha: 70, beta: 75 },
      { role: "SMM", alpha: 65, beta: 85 },
      { role: "Marketing", alpha: 60, beta: 70 },
      { role: "Recruit", alpha: 75, beta: 65 },
    ],
  };

  const pieData: PieDistributionData = {
    title: "Browser Visitors",
    valueKey: "visitors",
    nameKey: "browser",
    series: [
      { key: "chrome", label: "Chrome", color: "var(--chart-1)" },
      { key: "safari", label: "Safari", color: "var(--chart-2)" },
      { key: "firefox", label: "Firefox", color: "var(--chart-3)" },
      { key: "edge", label: "Edge", color: "var(--chart-4)" },
      { key: "other", label: "Other", color: "var(--chart-5)" },
    ],
    data: [
      { browser: "chrome", visitors: 275 },
      { browser: "safari", visitors: 200 },
      { browser: "firefox", visitors: 187 },
      { browser: "edge", visitors: 173 },
      { browser: "other", visitors: 90 },
    ],
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

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-2">Widgets Showcase</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-7 md:gap-3 md:gap-y-8 auto-rows-[140px] md:auto-rows-[145px]">
        {/* Example Widget */}
        <div className="col-span-1 row-span-2 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">RadarWidget</p>
          <RadarWidget
            data={avgSalaryRadarData}
            chartSize={240}
            className="col-span-1 row-span-2"
          />
        </div>

        <div className="col-span-1 md:col-span-2 row-span-2 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ChartWidgetContainer</p>
          <ChartWidgetContainer
            className="col-span-1 md:col-span-2 row-span-2"
            title="Monthly Activity"
            description="Positive vs negative visitor trend"
            footer="Negative values indicate drops in activity"
          >
            <BarChartNegative
              data={negativeData}
              config={negativeConfig}
              seriesKey="visitors"
              xKey="month"
              chartHeight={150}
            />
          </ChartWidgetContainer>
        </div>


        <div className="row-span-2 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">PieDistributionWidget</p>
          <PieDistributionWidget
            className="row-span-2"
            data={pieData}
            chartSize={220}
          />
        </div>

        <div className="col-span-1 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">RotaryDialWidget</p>
          <RotaryDialWidget
            className="col-span-1"
            data={{
              min: 0,
              max: 100,
              value: currentValue,
              step: 1,
              title: "Tuner",
              subtitle: "Generic Rotary Dial",
              unitLabel: "%",
            }}
            onValueChange={(v) => setCurrentValue(v)}
          />
        </div>

        <div className="sm:col-span-1 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ClockPreviewWidget</p>
          <ClockPreviewWidget
            className=" sm:col-span-1"
            data={{
              format: "12",
              timeZone: "Europe/Berlin",
            }}
          />
        </div>

        <div className="row-span-2 sm:col-span-1 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ProgressSummaryWidget</p>
          <ProgressSummaryWidget
            className=" row-span-2 sm:col-span-1"
            data={{
              title: "Order Status",
              subtitle: "Last 30 days",
              items: [
                { label: "Completed", value: 68, color: "bg-blue-500" },
                { label: "Processing", value: 22, color: "bg-blue-400" },
                { label: "Cancelled", value: 10, color: "bg-red-400" },
              ],
            }}
          />
        </div>

        <div className="row-span-2 sm:row-span-3 sm:col-span-1 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">SummaryListWidget</p>
          <SummaryListWidget
            className=" row-span-2 sm:row-span-3 sm:col-span-1"
            data={{
              title: "Activity",
              subtitle: "Latest updates",
              items: [
                {
                  id: 1,
                  title: "Refund issued for #10241",
                  meta: "2m ago",
                  icon: <DollarSign size={16} />,
                },
                {
                  id: 2,
                  title: "New order #10246",
                  meta: "18m ago",
                  icon: <ShoppingCart size={16} />,
                },
                {
                  id: 3,
                  title: "New customer signup",
                  meta: "1h ago",
                  icon: <Users size={16} />,
                },
                {
                  id: 4,
                  title: "Refund issued for #10241",
                  meta: "2m ago",
                  icon: <DollarSign size={16} />,
                },
                {
                  id: 5,
                  title: "New order #10246",
                  meta: "18m ago",
                  icon: <ShoppingCart size={16} />,
                },
                {
                  id: 6,
                  title: "New customer signup",
                  meta: "1h ago",
                  icon: <Users size={16} />,
                },
                {
                  id: 7,
                  title: "Refund issued for #10241",
                  meta: "2m ago",
                  icon: <DollarSign size={16} />,
                },
                {
                  id: 8,
                  title: "New order #10246",
                  meta: "18m ago",
                  icon: <ShoppingCart size={16} />,
                },
              ],
            }}
            onItemClick={(id) => {
              console.log("Item clicked:", id);
            }}
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">StatMiniWidget</p>
          <StatMiniWidget
            className=""
            data={{
              title: "Bounce Rate",
              value: "34%",
              growth: -1.2,
              subtitle: "this week",
            }}
            animated={true}
            navigateTo="/test2"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">StatProgressWidget</p>
          <StatProgressWidget
            className=" "
            data={{
              title: "Community growth",
              growth: 0.9,
              growthLabel: "from last month",
              progress: 30,
            }}
            animated={true}
            onClick={() => console.log("Clicked!")}
          />
        </div>

        <div className="col-span-1 md:col-span-2 row-span-2 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">WeeklyTasksWidget</p>
          <WeeklyTasksWidget
            className="col-span-1 md:col-span-2 row-span-2 "
            data={{
              mainTitle: "Work Overview",
              title: "Weekly tasks",
              stats: [
                { value: 70, label: "Completed", animated: true },
                { value: 32, label: "Better than last month" },
                { value: 4, label: "Failed", animated: true },
              ],
              tasks: [
                {
                  id: 1,
                  title: "Design review",
                  desc: "UI/UX meeting",
                  avatar: "https://i.pravatar.cc/300",
                  onClick: () => console.log("task clicked"),
                  onActionClick: () => console.log("action clicked"),
                },
                { id: 2, title: "Write documentation", desc: "API section" },
              ],
            }}
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">StatProgressWidget</p>
          <StatProgressWidget
            className=""
            data={{
              title: "Community growth",
              growth: 0.9,
              growthLabel: "from last month",
              progress: 30,
            }}
            animated={true}
            onClick={() => console.log("Clicked!")}
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">StatProgressWidget</p>
          <StatProgressWidget
            className=""
            data={{
              title: "Community growth",
              growth: 0.9,
              growthLabel: "from last month",
              progress: 30,
            }}
            animated={true}
            onClick={() => console.log("Clicked!")}
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ValueSummaryWidget</p>
          <ValueSummaryWidget
            className=""
            data={{
              title: "Total sales",
              value: "1,200K",
              animated: true,
              growth: "+2.1%",
              actionLabel: "View chart",
              onActionClick: () => console.log("action clicked"),
            }}
          />
        </div>

        <div className="col-span-1 md:col-span-3 lg:col-span-2 row-span-2 space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ContributionMatrixWidget</p>
          <ContributionMatrixWidget
            className="col-span-1 md:col-span-3 lg:col-span-2 row-span-2"
            data={{
              title: "Activity",
              subtitle: "Last year Activities",
              days: [
                { date: "2024-01-01", value: 8 },
                { date: "2024-06-01", value: 4 },
                { date: "2024-06-02", value: 2 },
                { date: "2024-06-03", value: 4 },
                { date: "2024-06-10", value: 6 },
                { date: "2024-07-05", value: 3 },
                { date: "2024-07-15", value: 5 },
                { date: "2024-08-01", value: 2 },
                { date: "2024-07-01", value: 1 },
                { date: "2024-09-12", value: 4 },
                { date: "2024-10-03", value: 8 },
                { date: "2024-11-20", value: 5 },
              ],
            }}
            onDayClick={(day) => {
              console.log("Clicked day:", day.date, "value:", day.value);
            }}
          />
        </div>

        <div className="w-full space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">SmartToggleWidget</p>
          <SmartToggleWidget
            className=" w-full!"
            data={{
              subtitle: "Bardi",
              title: "Smart Lamp",
              state: lampState,
              icon: <Lightbulb size={18} />,
              onChange: (newState) => {
                console.log("New lamp state:", newState);
                setLampState(newState);
              },
            }}
          />
        </div>
      </div>

      {/* Skeleton Loading Examples Section */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold mb-4">Skeleton Loading States</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          These widgets have null/undefined data and display skeleton loaders:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-7 md:gap-3 md:gap-y-8 auto-rows-[140px] md:auto-rows-[150px]">
          {/* Null data examples */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">StatMiniWidget</p>
            <StatMiniWidget
              className=""
              data={null as any}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">StatProgressWidget</p>
            <StatProgressWidget
              className=""
              data={null as any}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ValueSummaryWidget</p>
            <ValueSummaryWidget
              className=""
              data={null as any}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">SummaryListWidget</p>
            <SummaryListWidget
              className=""
              data={null as any}
            />
          </div>

          <div className="col-span-1 row-span-2 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">RadarWidget</p>
            <RadarWidget
              data={null as any}
              chartSize={240}
              className="col-span-1 row-span-2"
            />
          </div>

          <div className="row-span-2 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">PieDistributionWidget</p>
            <PieDistributionWidget
              className="row-span-2"
              data={null as any}
              chartSize={220}
            />
          </div>

          <div className="col-span-1 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ClockPreviewWidget</p>
            <ClockPreviewWidget
              className="col-span-1"
              data={null as any}
            />
          </div>

          <div className="col-span-1 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">RotaryDialWidget</p>
            <RotaryDialWidget
              className="col-span-1"
              data={null as any}
            />
          </div>

          <div className="row-span-2 sm:col-span-1 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ProgressSummaryWidget</p>
            <ProgressSummaryWidget
              className="row-span-2 sm:col-span-1"
              data={null as any}
            />
          </div>

          <div className="row-span-2 sm:row-span-3 sm:col-span-1 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">SummaryListWidget</p>
            <SummaryListWidget
              className="row-span-2 sm:row-span-3 sm:col-span-1"
              data={null as any}
            />
          </div>

          <div className="col-span-1 md:col-span-2 row-span-2 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">WeeklyTasksWidget</p>
            <WeeklyTasksWidget
              className="col-span-1 md:col-span-2 row-span-2"
              data={null as any}
            />
          </div>

          <div className="w-full space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">SmartToggleWidget</p>
            <SmartToggleWidget
              className="w-full!"
              data={null as any}
            />
          </div>

          <div className="col-span-1 md:col-span-2 row-span-2 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ContributionMatrixWidget</p>
            <ContributionMatrixWidget
              className="col-span-1 md:col-span-2 row-span-2"
              data={null as any}
            />
          </div>

          <div className="col-span-1 md:col-span-2 row-span-2 space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 select-all!">ChartWidgetContainer</p>
            <ChartWidgetContainer
              className="col-span-1 md:col-span-2 row-span-2"
              title={null as any}
            >
              <div />
            </ChartWidgetContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
