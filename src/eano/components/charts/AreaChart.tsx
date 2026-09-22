"use client"

import * as React from "react"
import { Area, AreaChart as ReAreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/eano/design-system/shadcn/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/eano/design-system/shadcn/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/eano/design-system/shadcn/select"

type ChartConfig = {
  [key: string]: {
    label: string
    color?: string
  }
}

interface AreaChartProps {
  data: any[]
  config: ChartConfig
  xKey?: string
  seriesKeys: string[]
  title?: string
  description?: string
  defaultRange?: "7d" | "30d" | "90d"
  showRangeSelector?: boolean
}

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  config = {},
  xKey = "date",
  seriesKeys = [],
  title = "Area Chart",
  description = "Interactive data visualization",
  defaultRange = "90d",
  showRangeSelector = true,
}) => {
  const [timeRange, setTimeRange] = React.useState(defaultRange)

  // Filter data based on selected time range (assuming date-based data)
  const filteredData = React.useMemo(() => {
    if (!data.length) return []

    const lastDateStr = data[data.length - 1]?.[xKey]
    if (!lastDateStr) return data

    const referenceDate = new Date(lastDateStr)
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return data.filter((item) => {
      const date = new Date(item[xKey])
      return date >= startDate
    })
  }, [data, timeRange, xKey])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        {showRangeSelector && (
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as "7d" | "30d" | "90d")}
          >
            <SelectTrigger
              className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
          <ReAreaChart data={filteredData}>
            {/* gradient fills */}
            <defs>
              {seriesKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config[key]?.color || "var(--chart-1)"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config[key]?.color || "var(--chart-1)"}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            {seriesKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill-${key})`}
                stroke={config[key]?.color || "var(--chart-1)"}
                stackId="a"
              />
            ))}

            <ChartLegend content={<ChartLegendContent />} />
          </ReAreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default AreaChart
