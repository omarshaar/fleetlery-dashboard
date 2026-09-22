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

interface RadarChartGridCircleFillProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys?: string[]
  chartSize?: number
  showLegend?: boolean
}

const RadarChartGridCircleFill: React.FC<RadarChartGridCircleFillProps> = ({
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        {/* Filled Circle Grid */}
        <PolarGrid
          gridType="circle"
          className={`opacity-20`}
          fill="var(--chart-1)"
        />

        <PolarAngleAxis dataKey={xKey} />

        {/* Series */}
        {seriesKeys.map((key) => (
          <Radar
            key={key}
            dataKey={key}
            fill={config[key]?.color || "var(--chart-1)"}
            fillOpacity={0.5}
          />
        ))}

        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </ReRadarChart>
    </ChartContainer>
  )
}

export default RadarChartGridCircleFill
