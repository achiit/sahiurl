"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, Search } from "lucide-react"

// Dummy support tickets
const tickets = [
  {
    id: "1",
    subject: "Payment not received",
    category: "Payment",
    status: "Open",
    priority: "High",
    lastUpdate: "2024-01-20",
    messages: 3,
  },
  {
    id: "2",
    subject: "How to integrate API?",
    category: "Technical",
    status: "In Progress",
    priority: "Medium",
    lastUpdate: "2024-01-19",
    messages: 2,
  },
  {
    id: "3",
    subject: "Account verification",
    category: "Account",
    status: "Closed",
    priority: "Low",
    lastUpdate: "2024-01-18",
    messages: 4,
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Ticket Submitted",
      description: "We'll get back to you as soon as possible.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <MessageCircle className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
            <CardDescription>We typically respond within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="account">Account Related</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{ticket.subject}</CardTitle>
                      <CardDescription>Ticket #{ticket.id}</CardDescription>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.status === "Open"
                          ? "bg-green-50 text-green-700"
                          : ticket.status === "In Progress"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-x-4">
                      <span className="text-muted-foreground">{ticket.category}</span>
                      <span className="text-muted-foreground">Priority: {ticket.priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{ticket.messages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

