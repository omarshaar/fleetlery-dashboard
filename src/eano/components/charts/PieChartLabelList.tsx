"use client"

import * as React from "react"
import { Pie, PieChart as RePieChart, Cell, LabelList } from "recharts"

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

interface PieChartLabelListProps {
  data: any[]
  config: ChartConfig
  valueKey?: string        // numeric key e.g. "visitors"
  nameKey?: string         // category key e.g. "browser"
  chartSize?: number
  showLegend?: boolean
}

const PieChartLabelList: React.FC<PieChartLabelListProps> = ({
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
      className="w-full flex items-center justify-center [&_.recharts-text]:fill-foreground"
      style={{ width: chartSize, height: chartSize }}
    >
      <RePieChart width={chartSize} height={chartSize}>
        <ChartTooltip
          content={<ChartTooltipContent nameKey={valueKey} hideLabel />}
          cursor={false}
        />

        <Pie data={data} dataKey={valueKey} nameKey={nameKey}>
          {/* Dynamic color for each slice */}
          {data.map((entry, index) => {
            const key = entry[nameKey] // chrome, safari...
            const fillColor = config[key]?.color || "var(--chart-1)"
            return <Cell key={index} fill={fillColor} />
          })}

          {/* LabelList that shows the text of each slice */}
          <LabelList
            dataKey={nameKey}
            stroke="none"
            fontSize={12}
            formatter={(value: string) =>
              config[value]?.label ?? value
            }
          />
        </Pie>

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RePieChart>
    </ChartContainer>
  )
}

export default PieChartLabelList
