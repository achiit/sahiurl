"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, FileText, Copy, Pencil, Trash, Layout, Plus, Eye } from "lucide-react"
import { format } from "date-fns"

// Types for future API integration
interface BlogTemplate {
  id: string
  name: string
  description: string
  category: string
  type: "standard" | "premium" | "custom"
  status: "active" | "draft" | "archived"
  layout: string
  usageCount: number
  lastUsed?: Date
  createdAt: Date
  updatedAt: Date
  previewImage?: string
}

// Dummy data - Replace with API call
const blogTemplates: BlogTemplate[] = [
  {
    id: "1",
    name: "Tech News Template",
    description: "Perfect for technology news and updates",
    category: "Technology",
    type: "standard",
    status: "active",
    layout: "sidebar-right",
    usageCount: 1250,
    lastUsed: new Date("2024-01-20"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-15"),
    previewImage: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Product Review",
    description: "Detailed product review layout with pros and cons",
    category: "Reviews",
    type: "premium",
    status: "active",
    layout: "full-width",
    usageCount: 850,
    lastUsed: new Date("2024-01-19"),
    createdAt: new Date("2023-12-15"),
    updatedAt: new Date("2024-01-10"),
    previewImage: "/placeholder.svg",
  },
]

export default function BlogTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // const response = await fetch('/api/templates', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     // form data
      //   }),
      // })
      // const data = await response.json()

      toast({
        title: "Template Created",
        description: "Your template has been created successfully.",
      })
      setShowCreateDialog(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create template.",
      })
    }
  }

  const getTypeBadge = (type: BlogTemplate["type"]) => {
    switch (type) {
      case "standard":
        return <Badge className="bg-blue-100 text-blue-700">Standard</Badge>
      case "premium":
        return <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      case "custom":
        return <Badge className="bg-orange-100 text-orange-700">Custom</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Templates</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Blog Template</DialogTitle>
              <DialogDescription>Create a new blog template for your content</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTemplate} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" placeholder="Enter template name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="reviews">Reviews</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter template description" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Template Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-width">Full Width</SelectItem>
                        <SelectItem value="sidebar-right">Right Sidebar</SelectItem>
                        <SelectItem value="sidebar-left">Left Sidebar</SelectItem>
                        <SelectItem value="two-column">Two Column</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Template
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 active templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1K</div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tech News</div>
            <p className="text-xs text-muted-foreground">1.2K uses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Templates</CardTitle>
            <Badge className="bg-purple-100 text-purple-700">PRO</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Recently Used</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={template.previewImage || "/placeholder.svg"}
                      alt={template.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">{getTypeBadge(template.type)}</div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Used {template.usageCount} times</span>
                      <span>Last used {format(template.lastUsed!, "MMM d")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="flex-1" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

