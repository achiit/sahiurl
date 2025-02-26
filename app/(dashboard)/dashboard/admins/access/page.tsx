"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield, AlertTriangle } from "lucide-react"

// Dummy access control data
const accessControlData = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    role: "Senior Admin",
    permissions: {
      createLinks: true,
      manageUsers: true,
      viewAnalytics: true,
      managePayments: false,
    },
    lastActive: "2024-01-20",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Admin",
    permissions: {
      createLinks: true,
      manageUsers: false,
      viewAnalytics: true,
      managePayments: false,
    },
    lastActive: "2024-01-19",
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "Junior Admin",
    permissions: {
      createLinks: true,
      manageUsers: false,
      viewAnalytics: false,
      managePayments: false,
    },
    lastActive: "2024-01-18",
    status: "Inactive",
  },
]

export default function AccessControlPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handlePermissionChange = (adminId: string, permission: string) => {
    toast({
      title: "Permission Updated",
      description: `Permission ${permission} has been updated.`,
    })
  }

  const handleRoleChange = (adminId: string, role: string) => {
    toast({
      title: "Role Updated",
      description: `Admin role has been updated to ${role}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Access Control</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Shield className="mr-2 h-4 w-4" />
          Update Security Policy
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-lg border p-4 bg-yellow-50">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-600">Security Policy Update Required</h4>
              <p className="text-sm text-yellow-600">
                Please review and update the security policies for all admin accounts. Last update was 30 days ago.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Review Now
            </Button>
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Admin Access Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessControlData.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={admin.role} onValueChange={(value) => handleRoleChange(admin.id, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Senior Admin">Senior Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Junior Admin">Junior Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Create Links</span>
                        <Switch
                          checked={admin.permissions.createLinks}
                          onCheckedChange={() => handlePermissionChange(admin.id, "createLinks")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Manage Users</span>
                        <Switch
                          checked={admin.permissions.manageUsers}
                          onCheckedChange={() => handlePermissionChange(admin.id, "manageUsers")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View Analytics</span>
                        <Switch
                          checked={admin.permissions.viewAnalytics}
                          onCheckedChange={() => handlePermissionChange(admin.id, "viewAnalytics")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Manage Payments</span>
                        <Switch
                          checked={admin.permissions.managePayments}
                          onCheckedChange={() => handlePermissionChange(admin.id, "managePayments")}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{admin.lastActive}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        admin.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {admin.status}
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

