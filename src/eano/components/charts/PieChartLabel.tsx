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

interface PieChartLabelProps {
  data: any[]
  config: ChartConfig
  valueKey?: string        // numeric key (e.g. "visitors")
  nameKey?: string         // category key (e.g. "browser")
  chartSize?: number
  showLegend?: boolean
  showLabels?: boolean
}

const PieChartLabel: React.FC<PieChartLabelProps> = ({
  data = [],
  config = {},
  valueKey = "visitors",
  nameKey = "browser",
  chartSize = 260,
  showLegend = false,
  showLabels = true,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full flex items-center justify-center [&_.recharts-pie-label-text]:fill-foreground"
      style={{ width: chartSize, height: chartSize }}
    >
      <RePieChart width={chartSize} height={chartSize}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={chartSize / 2.4}
          label={showLabels}
        >
          {data.map((entry, index) => {
            const key = entry[nameKey]   // مثل chrome / safari / firefox
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

export default PieChartLabel
