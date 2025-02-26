"use client"

import { useState } from "react"
import { Search, Plus, Pencil, Globe, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Dummy data for microsites
const microsites = [
  {
    id: "1",
    name: "Company Profile",
    url: "sahiurl.in/company",
    thumbnail: "/placeholder.svg?height=200&width=400",
    status: "Published",
  },
  {
    id: "2",
    name: "Product Showcase",
    url: "sahiurl.in/products",
    thumbnail: "/placeholder.svg?height=200&width=400",
    status: "Draft",
  },
  {
    id: "3",
    name: "Event Landing Page",
    url: "sahiurl.in/event2024",
    thumbnail: "/placeholder.svg?height=200&width=400",
    status: "Published",
  },
]

export default function MicrositePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Microsites</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Microsite
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search microsites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {microsites.map((site) => (
          <Card key={site.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-video">
              <img src={site.thumbnail || "/placeholder.svg"} alt={site.name} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="secondary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{site.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {site.url}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    site.status === "Published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {site.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

