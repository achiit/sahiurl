"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { AlertTriangle, Search, Download, AlertOctagon, XCircle, Info, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"

// Types for future integration
interface ErrorLog {
  id: string
  level: "error" | "warning" | "info"
  message: string
  stack?: string
  path?: string
  timestamp: Date
  count: number
  lastOccurrence: Date
  resolved: boolean
  metadata?: {
    userId?: string
    browser?: string
    os?: string
    ip?: string
  }
}

// Dummy data - Replace with API call
const errorLogs: ErrorLog[] = [
  {
    id: "1",
    level: "error",
    message: "Failed to process payment transaction",
    stack: "Error: Payment failed\n    at processPayment (/app/api/payment.ts:25:7)",
    path: "/api/payment",
    timestamp: new Date("2024-01-20T15:30:00"),
    count: 5,
    lastOccurrence: new Date("2024-01-20T15:45:00"),
    resolved: false,
    metadata: {
      userId: "user123",
      browser: "Chrome 120",
      os: "Windows 11",
      ip: "192.168.1.1",
    },
  },
  {
    id: "2",
    level: "warning",
    message: "High memory usage detected",
    path: "system",
    timestamp: new Date("2024-01-20T14:20:00"),
    count: 3,
    lastOccurrence: new Date("2024-01-20T14:35:00"),
    resolved: false,
    metadata: {
      os: "Ubuntu 22.04",
      ip: "10.0.0.1",
    },
  },
]

export default function ErrorLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const { toast } = useToast()

  const handleExport = async () => {
    try {
      // Implement export functionality
      // const response = await fetch('/api/monitoring/errors/export', {
      //   method: 'POST',
      //   body: JSON.stringify({ dateRange, searchQuery })
      // })
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'error-logs.csv'
      // a.click()

      toast({
        title: "Export Started",
        description: "Your error logs export will be ready shortly.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export error logs.",
      })
    }
  }

  const handleResolve = async (id: string) => {
    try {
      // Implement error resolution
      // await fetch(`/api/monitoring/errors/${id}/resolve`, {
      //   method: 'POST'
      // })

      toast({
        title: "Error Resolved",
        description: "The error has been marked as resolved.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Failed to resolve the error.",
      })
    }
  }

  const getLevelIcon = (level: ErrorLog["level"]) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLevelBadge = (level: ErrorLog["level"]) => {
    switch (level) {
      case "error":
        return <Badge className="bg-red-100 text-red-700">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-700">Info</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Error Logs</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Auto-refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12 unresolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <AlertOctagon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">API Error</div>
            <p className="text-xs text-muted-foreground">15 occurrences</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Error Log History</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search errors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DatePickerWithRange
                value={dateRange}
                onValueChange={(value: DateRange | undefined) => setDateRange(value)}
              />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Last Occurrence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.message}</TableCell>
                  <TableCell className="text-muted-foreground">{log.path}</TableCell>
                  <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                  <TableCell>{log.count}</TableCell>
                  <TableCell>{log.lastOccurrence.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Error Details</DialogTitle>
                            <DialogDescription>Here are the details for the selected error.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="level" className="text-right">
                                Level
                              </label>
                              <Input id="level" value={log.level} className="col-span-3" disabled />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="message" className="text-right">
                                Message
                              </label>
                              <Input id="message" value={log.message} className="col-span-3" disabled />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="path" className="text-right">
                                Path
                              </label>
                              <Input id="path" value={log.path || "N/A"} className="col-span-3" disabled />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="timestamp" className="text-right">
                                Timestamp
                              </label>
                              <Input
                                id="timestamp"
                                value={log.timestamp.toLocaleString()}
                                className="col-span-3"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="count" className="text-right">
                                Count
                              </label>
                              <Input id="count" value={log.count.toString()} className="col-span-3" disabled />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="lastOccurrence" className="text-right">
                                Last Occurrence
                              </label>
                              <Input
                                id="lastOccurrence"
                                value={log.lastOccurrence.toLocaleString()}
                                className="col-span-3"
                                disabled
                              />
                            </div>
                            {log.metadata && (
                              <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="userId" className="text-right">
                                    User ID
                                  </label>
                                  <Input
                                    id="userId"
                                    value={log.metadata.userId || "N/A"}
                                    className="col-span-3"
                                    disabled
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="browser" className="text-right">
                                    Browser
                                  </label>
                                  <Input
                                    id="browser"
                                    value={log.metadata.browser || "N/A"}
                                    className="col-span-3"
                                    disabled
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="os" className="text-right">
                                    OS
                                  </label>
                                  <Input id="os" value={log.metadata.os || "N/A"} className="col-span-3" disabled />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="ip" className="text-right">
                                    IP Address
                                  </label>
                                  <Input id="ip" value={log.metadata.ip || "N/A"} className="col-span-3" disabled />
                                </div>
                              </>
                            )}
                            {log.stack && (
                              <div className="grid grid-cols-4 items-start gap-4">
                                <label htmlFor="stack" className="text-right mt-1">
                                  Stack Trace
                                </label>
                                <Input id="stack" value={log.stack} className="col-span-3" disabled />
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => handleResolve(log.id)}>
                        Resolve
                      </Button>
                    </div>
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

