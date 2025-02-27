"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { useSecurity } from "@/lib/hooks/use-security"
import type { APIKey } from "@/types/security"
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
import { Search, Plus, Copy, Key, RefreshCw, Trash, Shield, Clock } from "lucide-react"
import { nanoid } from "nanoid"

// Types for future API integration
// interface APIKey {
//   id: string
//   name: string
//   key: string
//   status: "active" | "revoked"
//   permissions: string[]
//   lastUsed?: Date
//   expiresAt?: Date
//   createdAt: Date
//   rateLimits: {
//     requests: number
//     interval: string
//   }
// }

// Dummy data - Replace with API call
// const apiKeys: APIKey[] = [
//   {
//     id: "1",
//     name: "Production API Key",
//     key: "sk_live_example_key_1",
//     status: "active",
//     permissions: ["read", "write"],
//     lastUsed: new Date("2024-01-20"),
//     createdAt: new Date("2024-01-01"),
//     rateLimits: {
//       requests: 1000,
//       interval: "minute",
//     },
//   },
//   {
//     id: "2",
//     name: "Development API Key",
//     key: "sk_test_example_key_2",
//     status: "active",
//     permissions: ["read"],
//     lastUsed: new Date("2024-01-19"),
//     expiresAt: new Date("2024-02-01"),
//     createdAt: new Date("2024-01-15"),
//     rateLimits: {
//       requests: 100,
//       interval: "minute",
//     },
//   },
// ]

export default function APISecurityPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const { isLoading, getAPIKeys, createAPIKey } = useSecurity()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadAPIKeys()
  }, [])

  const loadAPIKeys = async () => {
    const data = await getAPIKeys()
    setApiKeys(data)
  }

  const handleCreateKey = async (formData: FormData) => {
    const name = formData.get("name") as string
    const permissions = formData.getAll("permissions") as string[]

    try {
      const newKey = await createAPIKey({
        name,
        permissions,
        status: "active",
        key: nanoid(),
        scopes: [],
        rateLimits: {
          requests: 1000,
          interval: "minute",
        },
      })

      if (newKey) {
        toast({
          title: "API Key Created",
          description: "Your new API key has been created successfully.",
        })
        await loadAPIKeys()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create API key.",
      })
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    })
  }

  const handleRevokeKey = async (id: string) => {
    try {
      // Implement key revocation
      // await fetch(`/api/security/keys/${id}/revoke`, {
      //   method: 'POST'
      // })

      toast({
        title: "Key Revoked",
        description: "The API key has been revoked.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke API key.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Security</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Create a new API key with specific permissions</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleCreateKey(formData)
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input id="name" name="name" placeholder="Enter key name" required />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="read" name="permissions" value="read" />
                    <Label htmlFor="read">Read Access</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="write" name="permissions" value="write" />
                    <Label htmlFor="write">Write Access</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="delete" name="permissions" value="delete" />
                    <Label htmlFor="delete">Delete Access</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rate Limiting</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input type="number" placeholder="Requests" min="1" />
                  </div>
                  <Select defaultValue="minute">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minute">Per Minute</SelectItem>
                      <SelectItem value="hour">Per Hour</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expiration</Label>
                <Select defaultValue="never">
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Key
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 expiring soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25.3K</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Requests</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5%</div>
            <p className="text-xs text-muted-foreground">Error rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search API keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{apiKey.name}</p>
                      <p className="text-sm text-muted-foreground">Created {apiKey.createdAt.toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{apiKey.key}</code>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyKey(apiKey.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="capitalize">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {apiKey.rateLimits ? `${apiKey.rateLimits.requests} requests/${apiKey.rateLimits.interval}` : 'Unlimited'}
                  </TableCell>
                  <TableCell>
                    {apiKey.lastUsed ? apiKey.lastUsed.toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={apiKey.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                    >
                      {apiKey.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleRevokeKey(apiKey.id)}>
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

