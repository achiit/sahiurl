"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { LineChart } from "@/components/dashboard/line-chart"
import { BarChart } from "@/components/dashboard/bar-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IndianRupee, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Download, Users, Globe } from "lucide-react"
import type { DateRange } from "react-day-picker"

// Types for future API integration
interface RevenueStats {
  totalRevenue: number
  monthlyGrowth: number
  averageOrderValue: number
  projectedRevenue: number
  paymentMethods: Array<{
    method: string
    amount: number
    percentage: number
    trend: number
  }>
  topCountries: Array<{
    country: string
    revenue: number
    users: number
    trend: number
  }>
}

// Dummy data - Replace with API call
const revenueStats: RevenueStats = {
  totalRevenue: 2500000,
  monthlyGrowth: 15.5,
  averageOrderValue: 12500,
  projectedRevenue: 3000000,
  paymentMethods: [
    { method: "Bank Transfer", amount: 1200000, percentage: 48, trend: 12.3 },
    { method: "UPI", amount: 800000, percentage: 32, trend: 18.7 },
    { method: "PayPal", amount: 500000, percentage: 20, trend: -2.4 },
  ],
  topCountries: [
    { country: "India", revenue: 1500000, users: 5000, trend: 15.2 },
    { country: "United States", revenue: 500000, users: 1200, trend: 8.7 },
    { country: "United Kingdom", revenue: 250000, users: 800, trend: 12.1 },
    { country: "Germany", revenue: 150000, users: 400, trend: -3.2 },
    { country: "Canada", revenue: 100000, users: 300, trend: 5.8 },
  ],
}

export default function RevenueReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)
      // Implement export functionality
      // const response = await fetch('/api/analytics/revenue/export', {
      //   method: 'POST',
      //   body: JSON.stringify({ dateRange }),
      // })
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'revenue-report.csv'
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
        <h1 className="text-2xl font-bold">Revenue Reports</h1>
        <div className="flex items-center gap-4">
          <DatePickerWithRange value={dateRange} onValueChange={setDateRange} />
          <Select defaultValue="daily">
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />+{revenueStats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueStats.averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-red-600 flex items-center">
              <ArrowDownRight className="h-4 w-4" />
              -2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenueStats.projectedRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="h-4 w-4" />
              +20% projected growth
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart />
            <div className="space-y-4 mt-4">
              {revenueStats.paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{method.method}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">₹{method.amount.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                    <span className={`text-sm ${method.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {method.trend >= 0 ? "+" : ""}
                      {method.trend}%
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
          <CardTitle>Revenue by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Avg. Revenue/User</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueStats.topCountries.map((country) => (
                <TableRow key={country.country}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {country.country}
                    </div>
                  </TableCell>
                  <TableCell>₹{country.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {country.users.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>₹{Math.round(country.revenue / country.users).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`flex items-center ${country.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {country.trend >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(country.trend)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

