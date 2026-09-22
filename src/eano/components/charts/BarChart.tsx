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

interface BarChartProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys: string[]
  chartHeight?: number
  showLegend?: boolean
}

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  config = {},
  xKey = "date",
  seriesKeys = [],
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
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            if (typeof value === "string") {
              const date = new Date(value)
              if (!isNaN(date.valueOf())) {
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            }
            return value
          }}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
          }
        />

        {seriesKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={config[key]?.color || "var(--chart-1)"}
            radius={[4, 4, 0, 0]}
          />
        ))}

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReBarChart>
    </ChartContainer>
  )
}

export default BarChart
