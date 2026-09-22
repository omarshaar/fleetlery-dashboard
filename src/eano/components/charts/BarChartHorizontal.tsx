"use client"

import * as React from "react"
import { Bar, BarChart as ReBarChart, XAxis, YAxis } from "recharts"

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

interface BarChartHorizontalProps {
  data: any[]
  config: ChartConfig
  /** numeric column key */
  xKey?: string
  /** category text key */
  yKey?: string
  /** single series key */
  seriesKey?: string
  chartHeight?: number
  showLegend?: boolean
}

const BarChartHorizontal: React.FC<BarChartHorizontalProps> = ({
  data = [],
  config = {},
  xKey = "desktop",
  yKey = "month",
  seriesKey = "desktop",
  chartHeight = 250,
  showLegend = false,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height: `${chartHeight}px` }}
    >
      <ReBarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: -20 }}
      >
        {/* Horizontal = numeric axis on X */}
        <XAxis type="number" dataKey={xKey} hide />

        {/* Horizontal = categories on Y */}
        <YAxis
          dataKey={yKey}
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            typeof value === "string" ? value.slice(0, 3) : value
          }
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <Bar
          dataKey={seriesKey}
          fill={config[seriesKey]?.color || "var(--chart-1)"}
          radius={5}
        />

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReBarChart>
    </ChartContainer>
  )
}

export default BarChartHorizontal
