import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { StatCard } from "@/components/dashboard/stat-card"
import { ClockingEventsCard } from "@/components/dashboard/clocking-events-card"
import { LucideLink, LucideScanFace } from "lucide-react"

export default function ObservabilityDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Connected Terminals" 
          icon={<LucideScanFace />} 
          statValue="247" 
          variant="purple" 
        />
        <StatCard 
          title="Total Websocket Sessions" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} 
          statValue="251" 
          variant="blue" 
        />
        <StatCard 
          title="Clocking Events Today" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} 
          statValue="512" 
          variant="green" 
        />
        <StatCard 
          title="Evotime Sync Status" 
          icon={<LucideLink/>} 
          statValue="Healthy" 
          variant="orange" 
          avatars={true}
        />
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
function generateConnectionData(hours: number) {
  const data = []
  const now = new Date()
  const currentHour = now.getHours()

  for (let i = 0; i < hours; i++) {
    const hour = (currentHour - i + 24) % 24
    const connections = Math.floor(Math.random() * 15) + 5

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
    const sent = Math.floor(Math.random() * 10) + 15
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
      return "secondary"
    case "Terminal Disconnected":
      return "destructive"
    case "Clocking Received":
      return "secondary"
    case "Clocking Sent":
      return "success"
    case "Sync Error":
      return "destructive"
    default:
      return "default"
  }
}

// Sample activity logs
const activityLogs = [
  {
    time: "03/04/2025 05:42:09",
    type: "Terminal Connected",
    message: "Terminal: AYTA05001866 established new websocket connection",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:41:53",
    type: "Clocking Sent",
    message: "Successfully sent clocking data to Evotime",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:41:52",
    type: "Clocking Received",
    message: "Received clocking | Employee: 51 | Time: 03/04/2025 05:41:52",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:40:31",
    type: "Clocking Sent",
    message: "Successfully sent clocking data to Evotime",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:38:44",
    type: "Terminal Connected",
    message: "Terminal reconnected after network interruption",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:38:17",
    type: "Terminal Disconnected",
    message: "Terminal: AYTA05001866 connection lost unexpectedly",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:37:05",
    type: "Sync Error",
    message: "Failed to sync data with SaaS platform. Retrying...",
    terminal: "Terminal-D9012",
  },
  {
    time: "03/04/2025 05:35:42",
    type: "Clocking Received",
    message: "Received clocking | Employee: 52 | Time: 03/04/2025 05:35:41",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:34:19",
    type: "Terminal Connected",
    message: "Terminal reconnected after network interruption",
    terminal: "Terminal: AYTA05001866",
  },
  {
    time: "03/04/2025 05:32:57",
    type: "Clocking Sent",
    message: "Successfully sent clocking data to SaaS platform",
    terminal: "Terminal: AYTA05001866",
  },
]

