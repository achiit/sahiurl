"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { LineChart } from "@/components/dashboard/line-chart"
import { Download, Cpu, HardDrive, MemoryStickIcon as Memory, Network } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { DateRange } from "react-day-picker"

// Types for future integration
interface ServerResources {
  cpu: {
    usage: number
    cores: number
    temperature: number
    processes: {
      total: number
      high: number
    }
  }
  memory: {
    total: number
    used: number
    cached: number
    buffers: number
  }
  disk: {
    total: number
    used: number
    read: number
    write: number
  }
  network: {
    incoming: number
    outgoing: number
    latency: number
    connections: number
  }
}

interface Process {
  id: string
  name: string
  cpu: number
  memory: number
  status: "running" | "sleeping" | "stopped"
  uptime: string
}

// Dummy data - Replace with API call
const serverResources: ServerResources = {
  cpu: {
    usage: 45,
    cores: 8,
    temperature: 65,
    processes: {
      total: 124,
      high: 3,
    },
  },
  memory: {
    total: 32 * 1024 * 1024 * 1024, // 32GB in bytes
    used: 18 * 1024 * 1024 * 1024, // 18GB in bytes
    cached: 8 * 1024 * 1024 * 1024, // 8GB in bytes
    buffers: 2 * 1024 * 1024 * 1024, // 2GB in bytes
  },
  disk: {
    total: 500 * 1024 * 1024 * 1024, // 500GB in bytes
    used: 320 * 1024 * 1024 * 1024, // 320GB in bytes
    read: 25 * 1024 * 1024, // 25MB/s
    write: 15 * 1024 * 1024, // 15MB/s
  },
  network: {
    incoming: 50 * 1024 * 1024, // 50MB/s
    outgoing: 30 * 1024 * 1024, // 30MB/s
    latency: 25, // 25ms
    connections: 850,
  },
}

const processes: Process[] = [
  {
    id: "1",
    name: "node",
    cpu: 25.5,
    memory: 1.2 * 1024 * 1024 * 1024, // 1.2GB
    status: "running",
    uptime: "2d 5h",
  },
  {
    id: "2",
    name: "nginx",
    cpu: 12.3,
    memory: 512 * 1024 * 1024, // 512MB
    status: "running",
    uptime: "15d 2h",
  },
]

export default function ServerResourcesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const getStatusBadge = (status: Process["status"]) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-700">Running</Badge>
      case "sleeping":
        return <Badge className="bg-yellow-100 text-yellow-700">Sleeping</Badge>
      case "stopped":
        return <Badge className="bg-red-100 text-red-700">Stopped</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Server Resources</h1>
        <div className="flex items-center gap-4">
          <DatePickerWithRange value={dateRange} onValueChange={setDateRange} />
          <Select defaultValue="1m">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{serverResources.cpu.usage}%</div>
              <Progress value={serverResources.cpu.usage} />
              <div className="text-xs text-muted-foreground">
                {serverResources.cpu.cores} cores @ {serverResources.cpu.temperature}°C
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Memory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatBytes(serverResources.memory.used)} / {formatBytes(serverResources.memory.total)}
              </div>
              <Progress value={(serverResources.memory.used / serverResources.memory.total) * 100} />
              <div className="text-xs text-muted-foreground">{formatBytes(serverResources.memory.cached)} cached</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatBytes(serverResources.disk.used)} / {formatBytes(serverResources.disk.total)}
              </div>
              <Progress value={(serverResources.disk.used / serverResources.disk.total) * 100} />
              <div className="text-xs text-muted-foreground">
                {formatBytes(serverResources.disk.read)}/s read, {formatBytes(serverResources.disk.write)}/s write
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{serverResources.network.connections}</div>
              <div className="text-xs text-muted-foreground">
                ↓ {formatBytes(serverResources.network.incoming)}/s
                <br />↑ {formatBytes(serverResources.network.outgoing)}/s
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CPU & Memory History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processes.map((process) => (
              <div key={process.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{process.name}</span>
                    {getStatusBadge(process.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">PID: {process.id}</p>
                </div>
                <div className="grid grid-cols-3 gap-8 text-right">
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="font-medium">{process.cpu}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Memory</p>
                    <p className="font-medium">{formatBytes(process.memory)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="font-medium">{process.uptime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

