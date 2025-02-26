"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart } from "@/components/dashboard/bar-chart"
import { Search, Download, ExternalLink, TrendingUp, Link2, Users, MousePointerClick } from "lucide-react"

// Types for future API integration
interface LinkPerformance {
  id: string
  title: string
  url: string
  shortUrl: string
  clicks: number
  uniqueVisitors: number
  conversionRate: number
  averageTime: string
  trend: number
}

// Dummy data - Replace with API call
const linkPerformanceData: LinkPerformance[] = [
  {
    id: "1",
    title: "Marketing Campaign 2024",
    url: "https://example.com/marketing-2024",
    shortUrl: "sahiurl.in/mkt24",
    clicks: 15000,
    uniqueVisitors: 12000,
    conversionRate: 8.5,
    averageTime: "45s",
    trend: 12.5,
  },
  {
    id: "2",
    title: "Product Launch",
    url: "https://example.com/new-product",
    shortUrl: "sahiurl.in/launch",
    clicks: 8500,
    uniqueVisitors: 7200,
    conversionRate: 6.8,
    averageTime: "32s",
    trend: -2.3,
  },
  {
    id: "3",
    title: "Holiday Sale",
    url: "https://example.com/holiday-sale",
    shortUrl: "sahiurl.in/sale",
    clicks: 12000,
    uniqueVisitors: 9800,
    conversionRate: 7.2,
    averageTime: "38s",
    trend: 8.7,
  },
]

export default function LinkPerformancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("clicks")
  const [isLoading, setIsLoading] = useState(false)

  // Function for future API integration
  const fetchLinkData = async () => {
    try {
      setIsLoading(true)
      // const response = await fetch('/api/analytics/links', {
      //   method: 'POST',
      //   body: JSON.stringify({ search: searchQuery, sort: sortBy }),
      // })
      // const data = await response.json()
      // Update state with the fetched data
    } catch (error) {
      console.error("Failed to fetch link data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Link Performance</h1>
        <Button variant="outline" onClick={() => {}}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35.5K</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4" />
              +15.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">Out of 280 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29K</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4" />
              +8.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5%</div>
            <p className="text-xs text-muted-foreground">Conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clicks">Most Clicks</SelectItem>
                <SelectItem value="conversion">Highest Conversion</SelectItem>
                <SelectItem value="visitors">Most Visitors</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link Details</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Unique Visitors</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Avg. Time</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkPerformanceData.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.shortUrl}</p>
                    </div>
                  </TableCell>
                  <TableCell>{link.clicks.toLocaleString()}</TableCell>
                  <TableCell>{link.uniqueVisitors.toLocaleString()}</TableCell>
                  <TableCell>{link.conversionRate}%</TableCell>
                  <TableCell>{link.averageTime}</TableCell>
                  <TableCell>
                    <span className={`flex items-center ${link.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {link.trend >= 0 ? "+" : ""}
                      {link.trend}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => window.open(link.url, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
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

