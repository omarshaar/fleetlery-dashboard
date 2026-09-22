"use client"

import * as React from "react"
import { Pie, PieChart as RePieChart, Cell } from "recharts"

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
    icon?: React.ComponentType<any>
  }
}

interface PieChartSimpleProps {
  data: any[]
  config: ChartConfig
  valueKey?: string        // numeric key (e.g. "visitors")
  nameKey?: string         // category key (e.g. "browser")
  chartSize?: number
  showLegend?: boolean
}

const PieChartSimple: React.FC<PieChartSimpleProps> = ({
  data = [],
  config = {},
  valueKey = "visitors",
  nameKey = "browser",
  chartSize = 260,
  showLegend = false,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full flex items-center justify-center"
      style={{ width: chartSize, height: chartSize }}
    >
      <RePieChart width={chartSize} height={chartSize}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={chartSize / 2.4}
        >
          {data.map((entry, index) => {
            const key = entry[nameKey]
            const color =
              config[key]?.color || "var(--chart-1)"

            return <Cell key={index} fill={color} />
          })}
        </Pie>

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RePieChart>
    </ChartContainer>
  )
}

export default PieChartSimple
