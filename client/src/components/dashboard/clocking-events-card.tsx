import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

// Generate sample hourly data for the chart
function generateHourlyData(hours: number) {
  const data = []
  const now = new Date()
  const currentHour = now.getHours()

  for (let i = 0; i < hours; i++) {
    const hour = (currentHour - i + 24) % 24
    const received = Math.floor(Math.random() * 50) + 100
    const sent = Math.floor(received * (0.95 + Math.random() * 0.05))

    data.unshift({
      hour,
      received,
      sent,
    })
  }

  return data
}

// Component for Clocking Events Card
export function ClockingEventsCard() {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Clocking Events (Last 24 Hours)</CardTitle>
        <CardDescription>Hourly breakdown of clocking events received</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer className="h-[300px] w-full"
          config={{
            received: {
              label: "Received",
              color: "var(--chart-1)",
            },
            sent: {
              label: "Sent to SaaS",
              color: "var(--chart-3)",
            },
          }}
        >
            <AreaChart data={generateHourlyData(24)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-received)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-received)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                type="natural"
                dataKey="received"
                stackId="1"
                stroke="var(--color-received)"
                fill="var(--color-received)"
                fillOpacity={0.3}
              />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 