"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Download, Search, Filter, Eye, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Types for future API integration
interface PaymentTransaction {
  id: string
  adminId: string
  adminName: string
  amount: number
  status: "Completed" | "Pending" | "Failed"
  method: string
  date: string
  reference: string
}

// Dummy data - Replace with API call
const transactions: PaymentTransaction[] = [
  {
    id: "1",
    adminId: "ADM001",
    adminName: "John Smith",
    amount: 25000,
    status: "Completed",
    method: "Bank Transfer",
    date: "2024-01-20",
    reference: "TRX123456",
  },
  {
    id: "2",
    adminId: "ADM002",
    adminName: "Sarah Johnson",
    amount: 18500,
    status: "Pending",
    method: "UPI",
    date: "2024-01-19",
    reference: "TRX123457",
  },
  {
    id: "3",
    adminId: "ADM003",
    adminName: "Mike Wilson",
    amount: 32000,
    status: "Failed",
    method: "Bank Transfer",
    date: "2024-01-18",
    reference: "TRX123458",
  },
]

export default function PaymentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)
  const { toast } = useToast()

  // Function for future API integration
  const downloadReport = async () => {
    try {
      // const response = await fetch('/api/payments/report', {
      //   method: 'POST',
      //   body: JSON.stringify({ filter: statusFilter, search: searchQuery }),
      // })
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'payment-history.csv'
      // a.click()

      toast({
        title: "Report Downloaded",
        description: "Payment history report has been downloaded.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download payment history report.",
      })
    }
  }

  const getStatusColor = (status: PaymentTransaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700"
      case "Pending":
        return "bg-yellow-50 text-yellow-700"
      case "Failed":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by admin name or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.adminName}</p>
                      <p className="text-sm text-muted-foreground">ID: {transaction.adminId}</p>
                    </div>
                  </TableCell>
                  <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        transaction.status,
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(transaction)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                          <DialogDescription>Complete information about this transaction</DialogDescription>
                        </DialogHeader>
                        {selectedTransaction && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Transaction ID</p>
                                <p className="font-medium">{selectedTransaction.reference}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                    selectedTransaction.status,
                                  )}`}
                                >
                                  {selectedTransaction.status}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Payment Method</p>
                                <p className="font-medium">{selectedTransaction.method}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Admin Information</p>
                              <p className="font-medium">{selectedTransaction.adminName}</p>
                              <p className="text-sm text-muted-foreground">ID: {selectedTransaction.adminId}</p>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Download Receipt</Button>
                              {selectedTransaction.status === "Failed" && (
                                <Button className="bg-emerald-600 hover:bg-emerald-700">Retry Payment</Button>
                              )}
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

