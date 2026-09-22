"use client"

import * as React from "react"
import {
  Radar,
  RadarChart as ReRadarChart,
  PolarAngleAxis,
  PolarGrid,
} from "recharts"

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

interface RadarChartGridCircleProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys?: string[]
  chartSize?: number
  showLegend?: boolean
}

const RadarChartGridCircle: React.FC<RadarChartGridCircleProps> = ({
  data = [],
  config = {},
  xKey = "month",
  seriesKeys = [],
  chartSize = 300,
  showLegend = false,
}) => {
  return (
    <ChartContainer
      config={config}
      className="w-full flex items-center justify-center"
      style={{ width: chartSize, height: chartSize }}
    >
      <ReRadarChart width={chartSize} height={chartSize} data={data}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        <PolarGrid gridType="circle" />
        <PolarAngleAxis dataKey={xKey} />

        {seriesKeys.map((key) => (
          <Radar
            key={key}
            dataKey={key}
            fill={config[key]?.color || "var(--chart-1)"}
            fillOpacity={0.6}
            dot={{ r: 4, fillOpacity: 1 }}
          />
        ))}

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReRadarChart>
    </ChartContainer>
  )
}

export default RadarChartGridCircle
