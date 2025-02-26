"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Database, Download, HardDrive, Clock, AlertTriangle, Search } from "lucide-react"

// Types for future integration
interface BackupConfig {
  frequency: string
  retention: number
  storageType: string
  compression: boolean
  encrypted: boolean
}

interface BackupHistory {
  id: string
  timestamp: Date
  size: number
  status: "completed" | "failed" | "in_progress"
  type: "automatic" | "manual"
  location: string
}

interface SystemLog {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error"
  category: string
  message: string
  details?: any
}

// Dummy data - Replace with API call
const backupHistory: BackupHistory[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-20"),
    size: 256000000, // 256MB
    status: "completed",
    type: "automatic",
    location: "s3://backups/2024-01-20/",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-19"),
    size: 248000000, // 248MB
    status: "completed",
    type: "manual",
    location: "s3://backups/2024-01-19/",
  },
]

const systemLogs: SystemLog[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-20T15:30:00"),
    level: "info",
    category: "backup",
    message: "Automated backup completed successfully",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-20T14:25:00"),
    level: "warning",
    category: "system",
    message: "High CPU usage detected",
  },
]

export default function BackupLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [backupInProgress, setBackupInProgress] = useState(false)
  const { toast } = useToast()

  const handleBackup = async () => {
    try {
      setBackupInProgress(true)
      // Implement backup creation
      // await fetch('/api/settings/backup/create', {
      //   method: 'POST'
      // })

      toast({
        title: "Backup Started",
        description: "System backup has been initiated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create backup.",
      })
    } finally {
      setBackupInProgress(false)
    }
  }

  const formatSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 Byte"
    const i = Number.parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Backup & Logs</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleBackup} disabled={backupInProgress}>
          {backupInProgress ? (
            <>Creating Backup...</>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Create Backup
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 GB</div>
            <Progress value={60} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">60% of 2 GB quota</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 hours ago</div>
            <p className="text-xs text-muted-foreground">Next backup in 22 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backup Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Storage Location</Label>
                  <Select defaultValue="s3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="local">Local Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compression</Label>
                    <p className="text-sm text-muted-foreground">Compress backups to save storage</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt backups for security</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 rounded-lg border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            log.level === "error"
                              ? "bg-red-100 text-red-700"
                              : log.level === "warning"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }
                        >
                          {log.level}
                        </Badge>
                        <span className="text-sm font-medium">{log.category}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        backup.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : backup.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {backup.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {backup.type === "automatic" ? "Automated Backup" : "Manual Backup"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{backup.location}</p>
                  <p className="text-xs text-muted-foreground">{backup.timestamp.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatSize(backup.size)}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
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

