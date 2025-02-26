"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Dummy verification queue data
const verificationQueue = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    documents: ["ID Card", "Business License"],
    status: "Pending",
    submittedAt: "2024-01-20",
    type: "Individual",
  },
  {
    id: "2",
    name: "Sarah Corp",
    email: "sarah@corp.com",
    documents: ["Business Registration", "Tax Documents"],
    status: "Under Review",
    submittedAt: "2024-01-19",
    type: "Business",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    documents: ["ID Card", "Proof of Address"],
    status: "Pending",
    submittedAt: "2024-01-18",
    type: "Individual",
  },
]

export default function VerificationQueuePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVerify = (id: string) => {
    toast({
      title: "Admin Verified",
      description: "The admin has been successfully verified.",
    })
  }

  const handleReject = (id: string) => {
    toast({
      variant: "destructive",
      title: "Admin Rejected",
      description: "The admin verification has been rejected.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Verification Queue</h1>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verificationQueue.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link">View {request.documents.length} Documents</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Verification Documents</DialogTitle>
                          <DialogDescription>Documents submitted by {request.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {request.documents.map((doc, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <span>{doc}</span>
                                  <Button variant="outline">View Document</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        request.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : request.status === "Under Review"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                      }`}
                    >
                      {request.status === "Pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {request.status === "Under Review" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {request.status}
                    </div>
                  </TableCell>
                  <TableCell>{request.submittedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleVerify(request.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Verify
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
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

