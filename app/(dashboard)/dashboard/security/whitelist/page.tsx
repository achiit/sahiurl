"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Globe, Trash, AlertTriangle } from "lucide-react"
import { useSecurity } from "@/lib/hooks/use-security"
import { validateIPAddress } from "@/lib/utils/security"
import type { WhitelistedIP } from "@/types/security"

// Types for future API integration
// interface WhitelistedIP {
//   id: string
//   ip: string
//   description: string
//   status: "active" | "expired"
//   addedBy: string
//   location?: string
//   lastAccess?: Date
//   expiresAt?: Date
//   createdAt: Date
// }

// Dummy data - Replace with API call
const whitelistedIPs: WhitelistedIP[] = [
  {
    id: "1",
    ipAddress: "192.168.1.1",
    description: "Office Network",
    status: "active",
    addedBy: "Admin",
    location: "New Delhi, India",
    lastAccessed: new Date("2024-01-20"),
    addedAt: new Date("2024-01-01"),
    purpose: "Office Access",
  },
  {
    id: "2",
    ipAddress: "10.0.0.1",
    description: "Development Team",
    status: "active",
    addedBy: "System",
    location: "Mumbai, India",
    lastAccessed: new Date("2024-01-19"),
    expiresAt: new Date("2024-02-01"),
    addedAt: new Date("2024-01-15"),
    purpose: "Development Access",
  },
]

export default function IPWhitelistPage() {
  const [ips, setIPs] = useState<WhitelistedIP[]>([])
  const { isLoading, getWhitelistedIPs, addToWhitelist } = useSecurity()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [whitelistEnabled, setWhitelistEnabled] = useState(true)

  useEffect(() => {
    loadWhitelistedIPs()
  }, [])

  const loadWhitelistedIPs = async () => {
    const data = await getWhitelistedIPs()
    setIPs(data)
  }

  // Update the handleAddIP function
  const handleAddIP = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const ip = formData.get("ip") as string
    const description = formData.get("description") as string
    const expiry = formData.get("expiry") as string

    if (!validateIPAddress(ip)) {
      toast({
        variant: "destructive",
        title: "Invalid IP",
        description: "Please enter a valid IP address.",
      })
      return
    }

    try {
      // Create a properly structured WhitelistedIP object
      const whitelistData = {
        ipAddress: ip,
        description,
        status: "active" as const,
        addedBy: "Manual Addition",
        expiresAt: expiry ? new Date(expiry) : undefined,
        purpose: "Manual whitelist entry",
      }

      await addToWhitelist(whitelistData)

      toast({
        title: "IP Added",
        description: "IP address has been added to whitelist.",
      })
      setShowAddDialog(false)
      loadWhitelistedIPs()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add IP address.",
      })
    }
  }

  const handleRemoveIP = async (id: string) => {
    try {
      // Implement IP removal
      // await fetch(`/api/security/whitelist/${id}`, {
      //   method: 'DELETE'
      // })

      toast({
        title: "IP Removed",
        description: "IP address has been removed from whitelist.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove IP address.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">IP Whitelist</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add IP Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add IP Address</DialogTitle>
              <DialogDescription>Add a new IP address to the whitelist</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddIP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input id="ip" name="ip" placeholder="Enter IP address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Enter description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                <Input id="expiry" name="expiry" type="date" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Add IP
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Whitelist Settings</CardTitle>
            <Switch checked={whitelistEnabled} onCheckedChange={setWhitelistEnabled} aria-label="Toggle whitelist" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">When enabled, only whitelisted IP addresses will be able to access the system.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Default Policy</Label>
              <Select defaultValue="deny">
                <SelectTrigger>
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deny">Deny All</SelectItem>
                  <SelectItem value="allow">Allow All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Auto-Expire After</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Whitelisted IPs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search IP addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whitelistedIPs.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-mono">{ip.ipAddress}</TableCell>
                  <TableCell>{ip.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {ip.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        ip.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {ip.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ip.addedBy}</TableCell>
                  <TableCell>{ip.lastAccessed ? ip.lastAccessed.toLocaleDateString() : "Never"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveIP(ip.id)}>
                        <Trash className="h-4 w-4" />
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

