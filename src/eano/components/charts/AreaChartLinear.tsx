"use client"

import * as React from "react"
import { Area, AreaChart as ReAreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/eano/design-system/shadcn/chart"

type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
  }
}

interface AreaChartLinearProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys: string[]
  chartHeight?: number
  type?: "linear" | "natural"
  showLegend?: boolean
}

const AreaChartLinear: React.FC<AreaChartLinearProps> = ({
  data = [],
  config = {},
  xKey = "month",
  seriesKeys = [],
  chartHeight = 250,
  type = "linear",
  showLegend = false,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height: `${chartHeight}px` }}
    >
      <ReAreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) =>
            typeof value === "string" && value.length > 3
              ? value.slice(0, 3)
              : value
          }
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />

        {/* One area per series */}
        {seriesKeys.map((key) => (
          <Area
            key={key}
            dataKey={key}
            type={type}
            fill={config[key]?.color || "var(--chart-1)"}
            fillOpacity={0.4}
            stroke={config[key]?.color || "var(--chart-1)"}
          />
        ))}

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReAreaChart>
    </ChartContainer>
  )
}

export default AreaChartLinear
