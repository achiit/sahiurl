"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminCreateDialog } from "@/components/admin/admin-create-dialog"
import { AdminDetailsDialog } from "@/components/admin/admin-details-dialog"

// Dummy admin data
const admins = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    totalEarnings: 25000,
    activeLinks: 150,
    joinDate: "2024-01-01",
    lastActive: "2024-01-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    totalEarnings: 18000,
    activeLinks: 120,
    joinDate: "2024-01-05",
    lastActive: "2024-01-19",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Suspended",
    totalEarnings: 12000,
    activeLinks: 80,
    joinDate: "2024-01-10",
    lastActive: "2024-01-15",
  },
]

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<(typeof admins)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Admin
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Earnings</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Active Links</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      admin.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell>₹{admin.totalEarnings.toLocaleString()}</TableCell>
                <TableCell>{admin.activeLinks}</TableCell>
                <TableCell>{admin.joinDate}</TableCell>
                <TableCell>{admin.lastActive}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedAdmin(admin)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Admin</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Suspend Admin</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminCreateDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      <AdminDetailsDialog admin={selectedAdmin} open={!!selectedAdmin} onOpenChange={() => setSelectedAdmin(null)} />
    </div>
  )
}

