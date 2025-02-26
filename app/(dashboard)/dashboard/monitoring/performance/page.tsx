"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { LineChart } from "@/components/dashboard/line-chart"
import { BarChart } from "@/components/dashboard/bar-chart"
import { Download, Gauge, Clock, ArrowUpRight, ArrowDownRight, Activity, Zap } from "lucide-react"
import type { DateRange } from "react-day-picker"

// Types for future integration
interface PerformanceMetrics {
  responseTime: {
    avg: number
    p95: number
    p99: number
  }
  throughput: {
    current: number
    trend: number
  }
  errorRate: {
    current: number
    trend: number
  }
  concurrentUsers: {
    current: number
    peak: number
  }
}

interface EndpointPerformance {
  path: string
  method: string
  avgResponseTime: number
  requests: number
  errorRate: number
  latencyTrend: number
}

// Dummy data - Replace with API call
const performanceMetrics: PerformanceMetrics = {
  responseTime: {
    avg: 120,
    p95: 250,
    p99: 450,
  },
  throughput: {
    current: 850,
    trend: 12.5,
  },
  errorRate: {
    current: 0.5,
    trend: -0.2,
  },
  concurrentUsers: {
    current: 250,
    peak: 380,
  },
}

const endpointPerformance: EndpointPerformance[] = [
  {
    path: "/api/links",
    method: "GET",
    avgResponseTime: 85,
    requests: 12500,
    errorRate: 0.2,
    latencyTrend: -5.3,
  },
  {
    path: "/api/analytics",
    method: "POST",
    avgResponseTime: 150,
    requests: 8500,
    errorRate: 0.8,
    latencyTrend: 2.1,
  },
]

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Performance Monitoring</h1>
        <div className="flex items-center gap-4">
          <DatePickerWithRange value={dateRange} onValueChange={setDateRange} />
          <Select defaultValue="5m">
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

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.responseTime.avg}ms</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowDownRight className="h-4 w-4" />
              -12ms from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.throughput.current}/s</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />+{performanceMetrics.throughput.trend}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.errorRate.current}%</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowDownRight className="h-4 w-4" />
              {performanceMetrics.errorRate.trend}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concurrent Users</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.concurrentUsers.current}</div>
            <p className="text-xs text-muted-foreground">Peak: {performanceMetrics.concurrentUsers.peak}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-bold">{performanceMetrics.responseTime.avg}ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">95th Percentile</p>
                <p className="text-xl font-bold">{performanceMetrics.responseTime.p95}ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">99th Percentile</p>
                <p className="text-xl font-bold">{performanceMetrics.responseTime.p99}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endpoint Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpointPerformance.map((endpoint) => (
              <div key={`${endpoint.method}-${endpoint.path}`} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm px-2 py-1 rounded-md bg-muted">{endpoint.method}</span>
                      <span className="font-medium">{endpoint.path}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{endpoint.avgResponseTime}ms</p>
                      <span className={`text-sm ${endpoint.latencyTrend < 0 ? "text-green-600" : "text-red-600"}`}>
                        {endpoint.latencyTrend > 0 ? "+" : ""}
                        {endpoint.latencyTrend}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requests</p>
                    <p className="text-xl font-bold">{endpoint.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-xl font-bold">{endpoint.errorRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        endpoint.errorRate < 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {endpoint.errorRate < 1 ? "Healthy" : "Degraded"}
                    </span>
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

