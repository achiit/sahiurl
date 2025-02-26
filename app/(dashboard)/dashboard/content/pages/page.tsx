"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Search, Plus, Globe, Eye, Trash, Layout, FileText, BarChart2, Copy } from "lucide-react"

// Types for future API integration
interface LandingPage {
  id: string
  name: string
  slug: string
  template: string
  status: "published" | "draft" | "archived"
  views: number
  conversions: number
  conversionRate: number
  lastModified: Date
  thumbnail?: string
  seoScore?: number
}

// Dummy data - Replace with API call
const landingPages: LandingPage[] = [
  {
    id: "1",
    name: "Summer Sale Landing Page",
    slug: "summer-sale-2024",
    template: "sales-template",
    status: "published",
    views: 12500,
    conversions: 750,
    conversionRate: 6,
    lastModified: new Date("2024-01-20"),
    thumbnail: "/placeholder.svg",
    seoScore: 92,
  },
  {
    id: "2",
    name: "Product Launch Page",
    slug: "new-product-launch",
    template: "product-template",
    status: "draft",
    views: 0,
    conversions: 0,
    conversionRate: 0,
    lastModified: new Date("2024-01-19"),
    thumbnail: "/placeholder.svg",
    seoScore: 85,
  },
]

export default function LandingPagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Implement page creation
      // const response = await fetch('/api/pages', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()

      toast({
        title: "Page Created",
        description: "Your landing page has been created successfully.",
      })
      setShowCreateDialog(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create landing page.",
      })
    }
  }

  const getStatusBadge = (status: LandingPage["status"]) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-700">Published</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-700">Archived</Badge>
      default:
        return null
    }
  }

  const getSEOScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-700">SEO {score}</Badge>
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-700">SEO {score}</Badge>
    return <Badge className="bg-red-100 text-red-700">SEO {score}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Landing Page</DialogTitle>
              <DialogDescription>Create a new landing page from scratch or using a template</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePage} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Page Name</Label>
                    <Input id="name" placeholder="Enter page name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input id="slug" placeholder="Enter URL slug" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blank">Blank Page</SelectItem>
                      <SelectItem value="sales">Sales Page</SelectItem>
                      <SelectItem value="product">Product Launch</SelectItem>
                      <SelectItem value="webinar">Webinar Registration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Page Settings</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SEO Optimization</Label>
                        <p className="text-sm text-muted-foreground">Automatically optimize for search engines</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">Enable conversion tracking</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>A/B Testing</Label>
                        <p className="text-sm text-muted-foreground">Create multiple variants</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Page
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">8 published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.8%</div>
            <p className="text-xs text-muted-foreground">Industry avg. 3.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. SEO Score</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Landing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Pages</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                    <SelectItem value="conversions">Best Converting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {landingPages.map((page) => (
                <Card key={page.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{page.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {page.slug}
                          <Button variant="ghost" size="icon" className="h-4 w-4">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(page.status)}
                        {page.seoScore && getSEOScoreBadge(page.seoScore)}
                      </div>
                    </div>

                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                      <img
                        src={page.thumbnail || "/placeholder.svg"}
                        alt={page.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="text-lg font-semibold">{page.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                        <p className="text-lg font-semibold">{page.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rate</p>
                        <p className="text-lg font-semibold">{page.conversionRate}%</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="outline">
                        <Layout className="mr-2 h-4 w-4" />
                        Edit
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

