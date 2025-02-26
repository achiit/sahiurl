"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Megaphone, CalendarIcon, Users, Eye, Edit, Trash, Globe } from "lucide-react"
import { format } from "date-fns"

// Types for future API integration
interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  status: "draft" | "scheduled" | "published" | "archived"
  audience: "all" | "admins" | "users" | "specific"
  publishDate?: Date
  expiryDate?: Date
  author: string
  views: number
  createdAt: Date
  updatedAt: Date
}

// Dummy data - Replace with API call
const announcements: Announcement[] = [
  {
    id: "1",
    title: "Platform Maintenance Schedule",
    content: "We will be performing system maintenance on Saturday, February 1st, from 2 AM to 4 AM UTC.",
    type: "warning",
    status: "scheduled",
    audience: "all",
    publishDate: new Date("2024-01-31"),
    expiryDate: new Date("2024-02-02"),
    author: "System Admin",
    views: 0,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "New Feature Release: Enhanced Analytics",
    content: "We're excited to announce our new analytics dashboard with improved insights and reporting capabilities.",
    type: "success",
    status: "published",
    audience: "admins",
    publishDate: new Date("2024-01-19"),
    author: "Product Team",
    views: 245,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
]

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // const response = await fetch('/api/announcements', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     // form data
      //   }),
      // })
      // const data = await response.json()

      toast({
        title: "Announcement Created",
        description: "Your announcement has been created successfully.",
      })
      setShowCreateDialog(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create announcement.",
      })
    }
  }

  const getTypeBadge = (type: Announcement["type"]) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-100 text-blue-700">Info</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
      case "success":
        return <Badge className="bg-green-100 text-green-700">Success</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-700">Error</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: Announcement["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-purple-100 text-purple-700">Scheduled</Badge>
      case "published":
        return <Badge className="bg-green-100 text-green-700">Published</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Megaphone className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>Create and publish announcements to your platform users</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter announcement title" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" placeholder="Enter announcement content" className="min-h-[100px]" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="users">Regular Users</SelectItem>
                        <SelectItem value="specific">Specific Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch id="schedule" />
                        <Label htmlFor="schedule">Schedule for later</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="expiry" />
                        <Label htmlFor="expiry">Set expiry date</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Announcement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12 active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Next: Tomorrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">+256 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Of total users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search announcements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div className="font-medium">{announcement.title}</div>
                      <div className="text-sm text-muted-foreground">By {announcement.author}</div>
                    </TableCell>
                    <TableCell>{getTypeBadge(announcement.type)}</TableCell>
                    <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{announcement.audience}</span>
                      </div>
                    </TableCell>
                    <TableCell>{announcement.views}</TableCell>
                    <TableCell>
                      <div className="text-sm">{format(announcement.createdAt, "MMM d, yyyy")}</div>
                      <div className="text-xs text-muted-foreground">{format(announcement.createdAt, "h:mm a")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

