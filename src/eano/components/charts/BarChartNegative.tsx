"use client"

import * as React from "react"
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/eano/design-system/shadcn/chart"

type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
    icon?: React.ComponentType<any>
  }
}

interface BarChartNegativeProps {
  data: any[]
  config: ChartConfig
  seriesKey: string
  xKey?: string
  chartHeight?: number
}

const BarChartNegative: React.FC<BarChartNegativeProps> = ({
  data = [],
  config = {},
  seriesKey = "visitors",
  xKey = "month",
  chartHeight = 250,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height: `${chartHeight}px` }}
    >
      <ReBarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator />}
        />

        <Bar dataKey={seriesKey}>
          <LabelList position="top" dataKey={xKey} fillOpacity={1} />

          {data.map((item, index) => (
            <Cell
              key={index}
              fill={
                item[seriesKey] >= 0
                  ? config[seriesKey]?.color || "var(--chart-1)"
                  : "var(--chart-2)"
              }
            />
          ))}
        </Bar>
      </ReBarChart>
    </ChartContainer>
  )
}

export default BarChartNegative
