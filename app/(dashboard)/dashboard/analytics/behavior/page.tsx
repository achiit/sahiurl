"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { LineChart } from "@/components/dashboard/line-chart"
import { BarChart } from "@/components/dashboard/bar-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, MousePointerClick, Clock, ArrowUpRight, Download, BarChart2, Activity } from "lucide-react"

// Types for future API integration
interface UserBehaviorStats {
  activeUsers: number
  averageSessionTime: string
  bounceRate: number
  retentionRate: number
  topEvents: Array<{
    name: string
    count: number
    trend: number
  }>
  userFlow: Array<{
    step: string
    users: number
    dropoff: number
  }>
}

// Dummy data - Replace with API call
const behaviorStats: UserBehaviorStats = {
  activeUsers: 12500,
  averageSessionTime: "4m 32s",
  bounceRate: 32.5,
  retentionRate: 68.2,
  topEvents: [
    { name: "Link Click", count: 45000, trend: 12.3 },
    { name: "Page View", count: 38000, trend: 8.7 },
    { name: "Sign Up", count: 2800, trend: 15.2 },
    { name: "Payment", count: 1500, trend: -2.4 },
  ],
  userFlow: [
    { step: "Landing", users: 10000, dropoff: 20 },
    { step: "Registration", users: 8000, dropoff: 30 },
    { step: "Link Creation", users: 5600, dropoff: 15 },
    { step: "First Payout", users: 4760, dropoff: 25 },
  ],
}

export default function UserBehaviorPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)
      // Implement export functionality
      // const response = await fetch('/api/analytics/behavior/export', {
      //   method: 'POST',
      //   body: JSON.stringify({ dateRange }),
      // })
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'user-behavior-report.csv'
      // a.click()
    } catch (error) {
      console.error("Failed to export data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Behavior Analytics</h1>
        <div className="flex items-center gap-4">
          <DatePickerWithRange value={dateRange} onValueChange={setDateRange} />
          <Select defaultValue="hourly">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{behaviorStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              +12.3% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{behaviorStats.averageSessionTime}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              +8.7% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{behaviorStats.bounceRate}%</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              -2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{behaviorStats.retentionRate}%</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              +5.4% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart />
            <div className="space-y-4 mt-4">
              {behaviorStats.topEvents.map((event) => (
                <div key={event.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    <span>{event.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{event.count.toLocaleString()}</span>
                    <span className={`text-sm ${event.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {event.trend >= 0 ? "+" : ""}
                      {event.trend}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex justify-between items-center mb-8">
              {behaviorStats.userFlow.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center gap-2">
                  <div className="text-sm font-medium">{step.step}</div>
                  <div className="text-2xl font-bold">{step.users.toLocaleString()}</div>
                  <div className="text-sm text-red-600">-{step.dropoff}%</div>
                  {index < behaviorStats.userFlow.length - 1 && (
                    <div className="absolute w-full h-1 bg-gray-200 top-[45px] -z-10">
                      <div
                        className="h-full bg-emerald-600"
                        style={{
                          width: `${100 - step.dropoff}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

