"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Search, Filter, MessageSquare, Clock, Users, BarChart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Types for future API integration
interface Ticket {
  id: string
  subject: string
  userId: string
  userName: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  assignedTo?: string
  createdAt: string
  lastUpdated: string
  messages: TicketMessage[]
}

interface TicketMessage {
  id: string
  content: string
  sender: string
  timestamp: string
  isStaff: boolean
}

// Dummy data - Replace with API call
const tickets: Ticket[] = [
  {
    id: "TICKET-001",
    subject: "Payment not received",
    userId: "USER123",
    userName: "John Smith",
    status: "open",
    priority: "high",
    category: "Payment",
    assignedTo: "Sarah Support",
    createdAt: "2024-01-20 10:30:00",
    lastUpdated: "2024-01-20 11:45:00",
    messages: [
      {
        id: "1",
        content: "I haven't received my payment for last week's earnings.",
        sender: "John Smith",
        timestamp: "2024-01-20 10:30:00",
        isStaff: false,
      },
      {
        id: "2",
        content: "I'll look into this right away for you.",
        sender: "Sarah Support",
        timestamp: "2024-01-20 11:45:00",
        isStaff: true,
      },
    ],
  },
  {
    id: "TICKET-002",
    subject: "API Integration Issue",
    userId: "USER456",
    userName: "Mike Johnson",
    status: "in_progress",
    priority: "medium",
    category: "Technical",
    assignedTo: "Tech Support Team",
    createdAt: "2024-01-20 09:15:00",
    lastUpdated: "2024-01-20 10:30:00",
    messages: [
      {
        id: "1",
        content: "Having issues with the API endpoint.",
        sender: "Mike Johnson",
        timestamp: "2024-01-20 09:15:00",
        isStaff: false,
      },
    ],
  },
]

export default function TicketManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const { toast } = useToast()

  const handleAssign = async (ticketId: string, agentId: string) => {
    try {
      // const response = await fetch('/api/tickets/assign', {
      //   method: 'POST',
      //   body: JSON.stringify({ ticketId, agentId }),
      // })
      // const data = await response.json()

      toast({
        title: "Ticket Assigned",
        description: "The ticket has been assigned successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign ticket.",
      })
    }
  }

  const handleReply = async (ticketId: string) => {
    if (!replyContent.trim()) return

    try {
      // const response = await fetch('/api/tickets/reply', {
      //   method: 'POST',
      //   body: JSON.stringify({ ticketId, content: replyContent }),
      // })
      // const data = await response.json()

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      })
      setReplyContent("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reply.",
      })
    }
  }

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-700">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-700">Low</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-700">Open</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolved</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ticket Management</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">-30min from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Out of 12 total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
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
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.userName}</p>
                      <p className="text-sm text-muted-foreground">{ticket.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{ticket.lastUpdated}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedTicket(ticket)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Ticket Details</DialogTitle>
                          <DialogDescription>View and respond to ticket</DialogDescription>
                        </DialogHeader>
                        {selectedTicket && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Ticket Information</h4>
                                <div className="space-y-1">
                                  <p>
                                    <span className="text-muted-foreground">ID:</span> {selectedTicket.id}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Status:</span>{" "}
                                    {getStatusBadge(selectedTicket.status)}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Priority:</span>{" "}
                                    {getPriorityBadge(selectedTicket.priority)}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Category:</span> {selectedTicket.category}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">User Information</h4>
                                <div className="space-y-1">
                                  <p>
                                    <span className="text-muted-foreground">Name:</span> {selectedTicket.userName}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">ID:</span> {selectedTicket.userId}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Created:</span> {selectedTicket.createdAt}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-medium">Conversation</h4>
                              <div className="space-y-4">
                                {selectedTicket.messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.isStaff ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                        message.isStaff ? "bg-emerald-100 text-emerald-700" : "bg-gray-100"
                                      }`}
                                    >
                                      <p className="text-sm font-medium mb-1">{message.sender}</p>
                                      <p className="text-sm">{message.content}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-medium">Reply</h4>
                              <Textarea
                                placeholder="Type your reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                                  Close
                                </Button>
                                <Button
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => handleReply(selectedTicket.id)}
                                >
                                  Send Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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

