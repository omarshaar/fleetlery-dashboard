"use client"

import * as React from "react"
import { Bar, BarChart as ReBarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/eano/design-system/shadcn/chart"

type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
  }
}

interface BarChartStackedProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys: string[]          // e.g. ["desktop", "mobile"]
  chartHeight?: number
  showLegend?: boolean
}

const BarChartStacked: React.FC<BarChartStackedProps> = ({
  data = [],
  config = {},
  xKey = "month",
  seriesKeys = [],
  chartHeight = 250,
  showLegend = true,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height: `${chartHeight}px` }}
    >
      <ReBarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey={xKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            typeof value === "string" ? value.slice(0, 3) : value
          }
        />

        <ChartTooltip content={<ChartTooltipContent hideLabel />} />

        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}

        {/* Render stacked bars dynamically */}
        {seriesKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={config[key]?.color || "var(--chart-1)"}
            radius={
              index === 0
                ? [0, 0, 4, 4]   // bottom stack
                : [4, 4, 0, 0]   // top stack
            }
          />
        ))}
      </ReBarChart>
    </ChartContainer>
  )
}

export default BarChartStacked
