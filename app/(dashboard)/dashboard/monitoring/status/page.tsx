"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Server,
  Globe,
  Database,
  Cloud,
  Cpu,
  MemoryStickIcon as Memory,
  HardDrive,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

// Dummy system status data
const systemStatus = {
  uptime: "99.99%",
  responseTime: "120ms",
  activeUsers: 1250,
  cpuUsage: 45,
  memoryUsage: 68,
  diskUsage: 72,
  incidents: [
    {
      id: 1,
      title: "High CPU Usage",
      severity: "warning",
      time: "10 minutes ago",
    },
    {
      id: 2,
      title: "Database Slow Queries",
      severity: "warning",
      time: "25 minutes ago",
    },
  ],
  services: [
    {
      name: "API Server",
      status: "operational",
      uptime: "99.99%",
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.95%",
    },
    {
      name: "CDN",
      status: "operational",
      uptime: "100%",
    },
    {
      name: "Payment Gateway",
      status: "operational",
      uptime: "99.98%",
    },
  ],
}

export default function SystemStatusPage() {
  const { toast } = useToast()

  const handleRunDiagnostics = () => {
    toast({
      title: "Running System Diagnostics",
      description: "This may take a few minutes...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Status</h1>
        <div className="flex gap-2">
          <Button onClick={handleRunDiagnostics} variant="outline">
            Run Diagnostics
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">View Detailed Logs</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.responseTime}</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Current</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.incidents.length}</div>
            <p className="text-xs text-muted-foreground">Open issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span className="text-sm">{systemStatus.cpuUsage}%</span>
              </div>
              <Progress value={systemStatus.cpuUsage} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Memory className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span className="text-sm">{systemStatus.memoryUsage}%</span>
              </div>
              <Progress value={systemStatus.memoryUsage} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Disk Usage</span>
                </div>
                <span className="text-sm">{systemStatus.diskUsage}%</span>
              </div>
              <Progress value={systemStatus.diskUsage} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.services.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {service.name === "API Server" && <Cloud className="h-4 w-4" />}
                    {service.name === "Database" && <Database className="h-4 w-4" />}
                    {service.name === "CDN" && <Globe className="h-4 w-4" />}
                    {service.name === "Payment Gateway" && <Server className="h-4 w-4" />}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{service.uptime}</span>
                    <Badge
                      className={
                        service.status === "operational" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.incidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={incident.severity === "critical" ? "h-4 w-4 text-red-500" : "h-4 w-4 text-yellow-500"}
                  />
                  <div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-muted-foreground">{incident.time}</p>
                  </div>
                </div>
                <Badge
                  className={
                    incident.severity === "critical" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {incident.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

