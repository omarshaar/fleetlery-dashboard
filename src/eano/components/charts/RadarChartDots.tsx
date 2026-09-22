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

interface RadarChartDotsProps {
  data: any[]
  config: ChartConfig
  xKey?: string        // e.g. "month"
  seriesKey?: string   // e.g. "desktop"
  chartSize?: number
  showLegend?: boolean
}

const RadarChartDots: React.FC<RadarChartDotsProps> = ({
  data = [],
  config = {},
  xKey = "month",
  seriesKey = "desktop",
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <PolarAngleAxis dataKey={xKey} />
        <PolarGrid />

        <Radar
          dataKey={seriesKey}
          fill={config[seriesKey]?.color || "var(--chart-1)"}
          stroke={config[seriesKey]?.color || "var(--chart-1)"}
          fillOpacity={0.6}
          dot={{
            r: 4,           // حجم النقطة
            fill: config[seriesKey]?.color || "var(--chart-1)",
            fillOpacity: 1, // وضوح النقطة
          }}
        />

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReRadarChart>
    </ChartContainer>
  )
}

export default RadarChartDots
