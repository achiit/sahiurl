"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Shield, AlertTriangle, Ban, Eye, Globe, Clock } from "lucide-react"
import { useSecurity } from "@/lib/hooks/use-security"
import { formatDate } from "@/lib/utils/security"
import type { SuspiciousActivity } from "@/types/security"
import { securityService } from "@/lib/services/security-service" // Changed from '@/lib/services/security'

export default function SuspiciousActivityPage() {
  const [activities, setActivities] = useState<SuspiciousActivity[]>([])
  const { isLoading, getSuspiciousActivities, resolveSuspiciousActivity } = useSecurity()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [autoBlock, setAutoBlock] = useState(true)
  const [stats, setStats] = useState({
    activeThreats: 0,
    blockedIPs: 0,
    suspiciousIPs: 0,
    avgResponseTime: "5m",
  })

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const data = await getSuspiciousActivities()
      setActivities(data)

      // Update stats
      setStats({
        activeThreats: data.filter((a) => a.status === "investigating").length,
        blockedIPs: data.filter((a) => a.status === "blocked").length,
        suspiciousIPs: data.filter((a) => ["investigating", "blocked"].includes(a.status)).length,
        avgResponseTime: "5m", // This should come from your analytics service
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load suspicious activities.",
      })
    }
  }

  const handleResolve = async (id: string) => {
    try {
      await resolveSuspiciousActivity(id)
      toast({
        title: "Activity Resolved",
        description: "The suspicious activity has been marked as resolved.",
      })
      await loadActivities()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve the activity.",
      })
    }
  }

  const handleBlock = async (ip: string) => {
    try {
      await securityService.blockIP(ip, "Manually blocked by admin")
      toast({
        title: "IP Blocked",
        description: `IP address ${ip} has been blocked.`,
      })
      await loadActivities()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to block IP address.",
      })
    }
  }

  const getSeverityBadge = (severity: SuspiciousActivity["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-700">Low</Badge>
    }
  }

  const getStatusBadge = (status: SuspiciousActivity["status"]) => {
    switch (status) {
      case "investigating":
        return <Badge className="bg-yellow-100 text-yellow-700">Investigating</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolved</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-700">Blocked</Badge>
    }
  }

  const filteredActivities = activities.filter((activity) => {
    if (!searchQuery) return true
    return (
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.source.ip.includes(searchQuery) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suspicious Activity</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={autoBlock} onCheckedChange={setAutoBlock} />
            <span className="text-sm">Auto-block suspicious IPs</span>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Shield className="mr-2 h-4 w-4" />
            Block All Suspicious
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Currently investigating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Total blocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspiciousIPs}</div>
            <p className="text-xs text-muted-foreground">Under monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{formatDate(activity.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      {activity.type}
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(activity.severity)}</TableCell>
                  <TableCell>
                    <div>
                      <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {activity.source.ip}
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">{activity.source.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Activity Details</DialogTitle>
                          <DialogDescription>Detailed information about the suspicious activity</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Type</h4>
                            <p>{activity.type}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Details</h4>
                            <p>{activity.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Source Information</h4>
                            <p>IP: {activity.source.ip}</p>
                            <p>Location: {activity.source.location}</p>
                            <p>User Agent: {activity.source.userAgent}</p>
                          </div>
                          {activity.affectedResource && (
                            <div>
                              <h4 className="font-medium">Affected Resource</h4>
                              <p>{activity.affectedResource}</p>
                            </div>
                          )}
                          {activity.metadata && (
                            <div>
                              <h4 className="font-medium">Additional Information</h4>
                              <pre className="whitespace-pre-wrap text-sm">
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {activity.status !== "resolved" && (
                        <Button variant="outline" size="sm" onClick={() => handleResolve(activity.id)}>
                          Resolve
                        </Button>
                      )}
                      {activity.status !== "blocked" && (
                        <Button variant="destructive" size="sm" onClick={() => handleBlock(activity.source.ip)}>
                          <Ban className="h-4 w-4 mr-2" />
                          Block IP
                        </Button>
                      )}
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

