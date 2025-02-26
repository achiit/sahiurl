"use client"

import { useState } from "react"
import { Search, Plus, BarChart2, Users, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dummy data for campaigns
const campaigns = [
  {
    id: "1",
    name: "Q4 Marketing Campaign",
    links: 15,
    clicks: 2345,
    conversions: 123,
    status: "Active",
  },
  {
    id: "2",
    name: "Black Friday Sale",
    links: 8,
    clicks: 1567,
    conversions: 89,
    status: "Active",
  },
  {
    id: "3",
    name: "Summer Promotion",
    links: 12,
    clicks: 890,
    conversions: 45,
    status: "Ended",
  },
]

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">{campaign.name}</CardTitle>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  campaign.status === "Active" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {campaign.status}
              </span>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center">
                  <Link className="h-4 w-4 text-muted-foreground mb-2" />
                  <div className="text-2xl font-bold">{campaign.links}</div>
                  <p className="text-xs text-muted-foreground">Links</p>
                </div>
                <div className="flex flex-col items-center">
                  <BarChart2 className="h-4 w-4 text-muted-foreground mb-2" />
                  <div className="text-2xl font-bold">{campaign.clicks}</div>
                  <p className="text-xs text-muted-foreground">Clicks</p>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-4 w-4 text-muted-foreground mb-2" />
                  <div className="text-2xl font-bold">{campaign.conversions}</div>
                  <p className="text-xs text-muted-foreground">Conversions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

