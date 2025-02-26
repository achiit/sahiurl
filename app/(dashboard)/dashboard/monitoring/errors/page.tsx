"use client"

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
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
              <DatePickerWithRange value={dateRange} onValueChange={setDateRange} />
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
          <div className="space-y-4">
            {errorLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-4 rounded-lg border">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {getLevelIcon(log.level)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.message}</span>
                        {getLevelBadge(log.level)}
                      </div>
                      <p className="text-sm text-muted-foreground">{log.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>First seen: {log.timestamp.toLocaleString()}</span>
                    <span>Last seen: {log.lastOccurrence.toLocaleString()}</span>
                    <span>Count: {log.count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedError(log)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Error Details</DialogTitle>
                        <DialogDescription>Detailed information about the error</DialogDescription>
                      </DialogHeader>
                      {selectedError && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Error Message</h4>
                            <p className="text-sm">{selectedError.message}</p>
                          </div>
                          {selectedError.stack && (
                            <div>
                              <h4 className="font-medium mb-2">Stack Trace</h4>
                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">{selectedError.stack}</pre>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium mb-2">Metadata</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {selectedError.metadata &&
                                Object.entries(selectedError.metadata).map(([key, value]) => (
                                  <div key={key}>
                                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                                    <p className="text-sm font-medium">{value}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={() => handleResolve(log.id)}>
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

