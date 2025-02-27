"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Copy, ExternalLink, MoreHorizontal, Trash, Edit, ChartBar } from "lucide-react"
import { CreateLinkDialog } from "@/components/links/create-link-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { formatDistanceToNow } from "date-fns"
import { Link } from "@/lib/firebase/database-schema"
import { getAuthToken, createAuthHeader } from "@/lib/auth-helpers"

export default function LinksPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  // Fetch links on component load and when user changes
  useEffect(() => {
    if (user) {
      fetchLinks()
    }
  }, [user])

  // Function to fetch links from API
  const fetchLinks = async () => {
    setIsLoading(true)
    try {
      const token = await getAuthToken(user)
      
      if (!token) {
        throw new Error("You must be logged in to view links")
      }
      
      const response = await fetch("/api/links", {
        headers: createAuthHeader(token)
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch links")
      }
      
      const data = await response.json()
      setLinks(data.links || [])
    } catch (error) {
      console.error("Error fetching links:", error)
      toast({
        title: "Error",
        description: "Failed to load your links. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle link deletion
  const handleDeleteLink = async (linkId: string) => {
    try {
      const token = await getAuthToken(user)
      
      if (!token) {
        throw new Error("You must be logged in to delete links")
      }
      
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
        headers: createAuthHeader(token)
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete link")
      }
      
      // Remove the deleted link from state
      setLinks(links.filter(link => link.id !== linkId))
      
      toast({
        title: "Success",
        description: "Link deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting link:", error)
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle copying link to clipboard
  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl)
    toast({
      description: "Link copied to clipboard",
    })
  }
  
  // Filter links based on search query
  const filteredLinks = links.filter(link => 
    link.shortUrl.includes(searchQuery) || 
    link.originalUrl.includes(searchQuery) ||
    (link.title && link.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Add this status normalization near the top of your component
  const normalizeStatus = (status: string) => {
    return status === 'disabled' ? 'inactive' : status
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Links</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Link
          </Button>
        </div>
      </div>
      
      <div className="flex items-center py-4">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Link</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="w-[100px]">Clicks</TableHead>
              <TableHead className="w-[150px]">Created</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-9 w-9 rounded-md ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery ? "No links matching your search" : "No links yet. Create your first link!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium">{link.shortUrl}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-1"
                          onClick={() => handleCopyLink(link.shortUrl)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {link.title || 'Untitled Link'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="truncate max-w-[300px] text-muted-foreground">
                        {link.originalUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-1"
                        asChild
                      >
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Visit</span>
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{link.analytics?.clicks || 0}</TableCell>
                  <TableCell>
                    {link.createdAt ? formatDistanceToNow(new Date(link.createdAt), { addSuffix: true }) : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        link.status === "active" ? "default" :
                        ['inactive', 'disabled'].includes(link.status) ? "secondary" :
                        "destructive"
                      }
                    >
                      {normalizeStatus(link.status).toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => handleCopyLink(link.shortUrl)}
                          className="cursor-pointer"
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/dashboard/links/${link.id}`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/dashboard/links/${link.id}/analytics`} className="cursor-pointer">
                            <ChartBar className="mr-2 h-4 w-4" /> Analytics
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteLink(link.id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateLinkDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        onSuccess={() => {
          fetchLinks()
          setShowCreateDialog(false)
        }}
      />
    </DashboardShell>
  )
}

