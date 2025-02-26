"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Search, Users, MessageSquare, Clock, BarChart2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types for future API integration
interface SupportAgent {
  id: string
  name: string
  email: string
  avatar?: string
  status: "online" | "busy" | "offline"
  role: "senior" | "junior" | "lead"
  department: string
  activeTickets: number
  resolvedToday: number
  averageResponse: string
  satisfactionRate: number
  lastActive: string
}

// Dummy data - Replace with API call
const supportAgents: SupportAgent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg",
    status: "online",
    role: "senior",
    department: "Technical Support",
    activeTickets: 5,
    resolvedToday: 12,
    averageResponse: "15m",
    satisfactionRate: 98,
    lastActive: "2 minutes ago",
  },
  {
    id: "2",
    name: "Mike Wilson",
    email: "mike@example.com",
    avatar: "/placeholder.svg",
    status: "busy",
    role: "lead",
    department: "Billing Support",
    activeTickets: 3,
    resolvedToday: 8,
    averageResponse: "22m",
    satisfactionRate: 95,
    lastActive: "5 minutes ago",
  },
  {
    id: "3",
    name: "Emily Brown",
    email: "emily@example.com",
    avatar: "/placeholder.svg",
    status: "offline",
    role: "junior",
    department: "General Support",
    activeTickets: 0,
    resolvedToday: 5,
    averageResponse: "18m",
    satisfactionRate: 92,
    lastActive: "2 hours ago",
  },
]

export default function AdminSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [autoAssign, setAutoAssign] = useState(true)
  const { toast } = useToast()

  const getStatusBadge = (status: SupportAgent["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-700">Online</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-700">Busy</Badge>
      case "offline":
        return <Badge variant="outline">Offline</Badge>
      default:
        return null
    }
  }

  const getRoleBadge = (role: SupportAgent["role"]) => {
    switch (role) {
      case "lead":
        return <Badge className="bg-purple-100 text-purple-700">Team Lead</Badge>
      case "senior":
        return <Badge className="bg-blue-100 text-blue-700">Senior</Badge>
      case "junior":
        return <Badge className="bg-gray-100 text-gray-700">Junior</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Support</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
            <span className="text-sm">Auto-assign tickets</span>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Users className="mr-2 h-4 w-4" />
            Add Support Agent
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Out of 12 total agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">8 unassigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18m</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Based on feedback</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Active Tickets</TableHead>
                <TableHead>Resolved Today</TableHead>
                <TableHead>Satisfaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={agent.avatar} />
                        <AvatarFallback>{agent.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(agent.status)}</TableCell>
                  <TableCell>{getRoleBadge(agent.role)}</TableCell>
                  <TableCell>{agent.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{agent.activeTickets}</span>
                      {agent.activeTickets > 0 && <Badge variant="outline">View</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{agent.resolvedToday}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          agent.satisfactionRate >= 95
                            ? "text-green-600"
                            : agent.satisfactionRate >= 90
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {agent.satisfactionRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Profile
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

