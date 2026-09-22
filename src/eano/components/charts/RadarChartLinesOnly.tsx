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

interface RadarChartLinesOnlyProps {
  data: any[]
  config: ChartConfig
  xKey?: string                // example: "month"
  seriesKeys?: string[]        // example: ["desktop", "mobile"]
  chartSize?: number
  showLegend?: boolean
}

const RadarChartLinesOnly: React.FC<RadarChartLinesOnlyProps> = ({
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
          content={<ChartTooltipContent indicator="line" />}
        />

        <PolarAngleAxis dataKey={xKey} />
        <PolarGrid radialLines={false} />

        {/* Render each series as a stroke-only radar */}
        {seriesKeys.map((key) => (
          <Radar
            key={key}
            dataKey={key}
            fill={config[key]?.color || "var(--chart-1)"}
            fillOpacity={0}
            stroke={config[key]?.color || "var(--chart-1)"}
            strokeWidth={2}
          />
        ))}

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReRadarChart>
    </ChartContainer>
  )
}

export default RadarChartLinesOnly
