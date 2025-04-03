import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

// Component for Clocking Events Card
function ClockingEventsCard() {
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

export default function ObservabilityDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="relative overflow-hidden p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-2xs before:absolute before:top-0 before:end-0 before:size-full before:bg-linear-to-br before:from-purple-100 before:via-transparent before:blur-xl dark:bg-neutral-800 dark:border-neutral-700 dark:before:from-purple-800/30 dark:before:via-transparent">
        <div className="relative z-10">
          <div className="flex justify-between gap-x-3">
        <span className="mb-3 inline-flex justify-center items-center size-8 md:size-10 rounded-lg bg-white text-gray-700 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
          <svg className="shrink-0 size-4 md:size-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </span>
        <div>
        </div>
      </div>
      <h2 className="text-sm md:text-base text-gray-800 dark:text-neutral-200">
        Total Users
      </h2>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          356
        </h3>
        
      </div>
    </div>
  </div>
  <div className="relative overflow-hidden p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-2xs before:absolute before:top-0 before:end-0 before:size-full before:bg-linear-to-br before:from-purple-100 before:via-transparent before:blur-xl dark:bg-neutral-800 dark:border-neutral-700 dark:before:from-purple-800/30 dark:before:via-transparent">
    <div className="relative z-10">
      <div className="flex justify-between gap-x-3">
        <span className="mb-3 inline-flex justify-center items-center size-8 md:size-10 rounded-lg bg-white text-gray-700 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
          <svg className="shrink-0 size-4 md:size-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </span>
        <div>
        </div>
      </div>
      <h2 className="text-sm md:text-base text-gray-800 dark:text-neutral-200">
        Total Users
      </h2>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          356
        </h3>
        <div className="flex items-center -space-x-2">
          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <img className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2.5&amp;w=320&amp;h=320&amp;q=80" alt="Avatar"/>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700 hidden" role="tooltip" style={{position: 'fixed', left: '183.906px', top: '66px'}}>
              Lewis Clarke
            </span>
          </div>
          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <span className="hs-tooltip-toggle flex shrink-0 justify-center items-center size-7 bg-gray-200 border-2 border-white text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
              L
            </span>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700" role="tooltip" style={{position: 'fixed', left: '207.934px', top: '66px'}}>
              Lori Hunter
            </span>
          </div>

          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <img className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2.5&amp;w=320&amp;h=320&amp;q=80" alt="Avatar"/>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700" role="tooltip" style={{position: 'fixed', left: '230.676px', top: '66px'}}>
              Ella Lauda
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="relative overflow-hidden p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-2xs before:absolute before:top-0 before:end-0 before:size-full before:bg-linear-to-br before:from-purple-100 before:via-transparent before:blur-xl dark:bg-neutral-800 dark:border-neutral-700 dark:before:from-purple-800/30 dark:before:via-transparent">
    <div className="relative z-10">
      <div className="flex justify-between gap-x-3">
        <span className="mb-3 inline-flex justify-center items-center size-8 md:size-10 rounded-lg bg-white text-gray-700 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
          <svg className="shrink-0 size-4 md:size-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </span>
        <div>
        </div>
      </div>
      <h2 className="text-sm md:text-base text-gray-800 dark:text-neutral-200">
        Total Users
      </h2>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          356
        </h3>
        <div className="flex items-center -space-x-2">
          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <img className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2.5&amp;w=320&amp;h=320&amp;q=80" alt="Avatar"/>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700 hidden" role="tooltip" style={{position: 'fixed', left: '183.906px', top: '66px'}}>
              Lewis Clarke
            </span>
          </div>
          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <span className="hs-tooltip-toggle flex shrink-0 justify-center items-center size-7 bg-gray-200 border-2 border-white text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
              L
            </span>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700" role="tooltip" style={{position: 'fixed', left: '207.934px', top: '66px'}}>
              Lori Hunter
            </span>
          </div>

          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <img className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2.5&amp;w=320&amp;h=320&amp;q=80" alt="Avatar"/>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700" role="tooltip" style={{position: 'fixed', left: '230.676px', top: '66px'}}>
              Ella Lauda
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="relative overflow-hidden p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-2xs before:absolute before:top-0 before:end-0 before:size-full before:bg-linear-to-br before:from-purple-100 before:via-transparent before:blur-xl dark:bg-neutral-800 dark:border-neutral-700 dark:before:from-purple-800/30 dark:before:via-transparent">
    <div className="relative z-10">
      <div className="flex justify-between gap-x-3">
        <span className="mb-3 inline-flex justify-center items-center size-8 md:size-10 rounded-lg bg-white text-gray-700 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
          <svg className="shrink-0 size-4 md:size-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </span>
        <div>
        </div>
      </div>
      <h2 className="text-sm md:text-base text-gray-800 dark:text-neutral-200">
        Total Users
      </h2>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          356
        </h3>
        <div className="flex items-center -space-x-2">
          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <img className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2.5&amp;w=320&amp;h=320&amp;q=80" alt="Avatar"/>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700 hidden" role="tooltip" style={{position: 'fixed', left: '183.906px', top: '66px'}}>
              Lewis Clarke
            </span>
          </div>
          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <span className="hs-tooltip-toggle flex shrink-0 justify-center items-center size-7 bg-gray-200 border-2 border-white text-gray-700 text-xs font-medium uppercase rounded-full dark:bg-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
              L
            </span>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700" role="tooltip" style={{position: 'fixed', left: '207.934px', top: '66px'}}>
              Lori Hunter
            </span>
          </div>

          <div className="hs-tooltip hidden sm:inline-block hover:z-10">
            <img className="hs-tooltip-toggle shrink-0 size-7 border-2 border-white rounded-full dark:border-neutral-800" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2.5&amp;w=320&amp;h=320&amp;q=80" alt="Avatar"/>
            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700" role="tooltip" style={{position: 'fixed', left: '230.676px', top: '66px'}}>
              Ella Lauda
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ClockingEventsCard />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-auto">
                  {activityLogs.slice(0, 6).map((log, index) => (
                    <div key={index} className="border-b last:border-0 p-3 text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant={getBadgeVariant(log.type)} className="text-xs">
                          {log.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{log.time.split(" ")[1]}</span>
                      </div>
                      <p className="text-xs mt-1">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{log.terminal}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Incoming Connections</CardTitle>
                <CardDescription>New terminal connections per hour</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    connections: {
                      label: "Connections",
                      color: "var(--chart-1)",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={generateConnectionData(24)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="hour"
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(hour) => `${hour}:00`}
                      />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="connections"
                        stroke="var(--color-connections)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>SaaS Platform Sync</CardTitle>
                <CardDescription>Clocking events sent to SaaS platform</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    sent: {
                      label: "Sent",
                      color: "hsl(var(--chart-1))",
                    },
                    failed: {
                      label: "Failed",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={generateSyncData(24)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="hour"
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(hour) => `${hour}:00`}
                      />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="sent"
                        stroke="var(--color-sent)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="failed"
                        stroke="var(--color-failed)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Current connection health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">Active</span>
                    </div>
                    <span className="font-medium text-sm">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-sm">Intermittent</span>
                    </div>
                    <span className="font-medium text-sm">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm">Disconnected</span>
                    </div>
                    <span className="font-medium text-sm">32</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span className="text-sm">Inactive</span>
                    </div>
                    <span className="font-medium text-sm">15</span>
                  </div>
                  <div className="pt-2">
                    <ChartContainer
                      config={{
                        active: {
                          label: "Active",
                          color: "hsl(142.1 76.2% 36.3%)",
                        },
                        intermittent: {
                          label: "Intermittent",
                          color: "hsl(47.9 95.8% 53.1%)",
                        },
                        disconnected: {
                          label: "Disconnected",
                          color: "hsl(0 84.2% 60.2%)",
                        },
                        inactive: {
                          label: "Inactive",
                          color: "hsl(0 0% 80%)",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart
                          data={[
                            {
                              name: "Status",
                              active: 247,
                              intermittent: 18,
                              disconnected: 32,
                              inactive: 15,
                            },
                          ]}
                        >
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="active" fill="var(--color-active)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="intermittent" fill="var(--color-intermittent)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="disconnected" fill="var(--color-disconnected)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="inactive" fill="var(--color-inactive)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Details</CardTitle>
              <CardDescription>Detailed view of all connections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Connection details would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Detailed view of all events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Event details would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

// Helper functions to generate sample data
function generateHourlyData(hours: number) {
  const data = []
  const now = new Date()
  const currentHour = now.getHours()

  for (let i = 0; i < hours; i++) {
    const hour = (currentHour - i + 24) % 24
    const received = Math.floor(Math.random() * 500) + 200
    const sent = Math.floor(received * (0.95 + Math.random() * 0.05))

    data.unshift({
      hour,
      received,
      sent,
    })
  }

  return data
}

function generateConnectionData(hours: number) {
  const data = []
  const now = new Date()
  const currentHour = now.getHours()

  for (let i = 0; i < hours; i++) {
    const hour = (currentHour - i + 24) % 24
    const connections = Math.floor(Math.random() * 30) + 5

    data.unshift({
      hour,
      connections,
    })
  }

  return data
}

function generateSyncData(hours: number) {
  const data = []
  const now = new Date()
  const currentHour = now.getHours()

  for (let i = 0; i < hours; i++) {
    const hour = (currentHour - i + 24) % 24
    const sent = Math.floor(Math.random() * 450) + 150
    const failed = Math.floor(Math.random() * 10)

    data.unshift({
      hour,
      sent,
      failed,
    })
  }

  return data
}

function getBadgeVariant(type: string) {
  switch (type) {
    case "Terminal Connected":
      return "default"
    case "Terminal Disconnected":
      return "destructive"
    case "Clocking Received":
      return "secondary"
    case "Clocking Sent":
      return "outline"
    case "Sync Error":
      return "destructive"
    default:
      return "default"
  }
}

// Sample activity logs
const activityLogs = [
  {
    time: "2023-04-03 15:42:09",
    type: "Terminal Connected",
    message: "Terminal established new websocket connection",
    terminal: "Terminal-A1245",
  },
  {
    time: "2023-04-03 15:41:52",
    type: "Clocking Received",
    message: "Received clocking data for employee #12458",
    terminal: "Terminal-B7890",
  },
  {
    time: "2023-04-03 15:40:31",
    type: "Clocking Sent",
    message: "Successfully sent clocking data to SaaS platform",
    terminal: "Terminal-B7890",
  },
  {
    time: "2023-04-03 15:38:17",
    type: "Terminal Disconnected",
    message: "Terminal connection lost unexpectedly",
    terminal: "Terminal-C4567",
  },
  {
    time: "2023-04-03 15:37:05",
    type: "Sync Error",
    message: "Failed to sync data with SaaS platform. Retrying...",
    terminal: "Terminal-D9012",
  },
  {
    time: "2023-04-03 15:35:42",
    type: "Clocking Received",
    message: "Received clocking data for employee #78901",
    terminal: "Terminal-E3456",
  },
  {
    time: "2023-04-03 15:34:19",
    type: "Terminal Connected",
    message: "Terminal reconnected after network interruption",
    terminal: "Terminal-F7890",
  },
  {
    time: "2023-04-03 15:32:57",
    type: "Clocking Sent",
    message: "Successfully sent clocking data to SaaS platform",
    terminal: "Terminal-E3456",
  },
]

