"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Globe, Link2 } from "lucide-react"

export default function CreateLinkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Link has been created successfully.",
      })
      router.push("/dashboard/links")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create link. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Link</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList>
          <TabsTrigger value="single">Single Link</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Creation</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Link Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination URL</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="destination" placeholder="https://your-url.com" className="pl-9" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-path">Custom Back-Half (Optional)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="custom-path" placeholder="custom-name" className="pl-9" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">sahiurl.in/your-custom-path</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monetization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Number of Blog Pages</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Pages</SelectItem>
                        <SelectItem value="3">3 Pages</SelectItem>
                        <SelectItem value="4">4 Pages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timer Duration (seconds)</Label>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 Seconds</SelectItem>
                        <SelectItem value="15">15 Seconds</SelectItem>
                        <SelectItem value="20">20 Seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blog Content Template</Label>
                  <Select defaultValue="template1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template1">Technology News</SelectItem>
                      <SelectItem value="template2">Entertainment</SelectItem>
                      <SelectItem value="template3">Health & Fitness</SelectItem>
                      <SelectItem value="custom">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Custom Blog Content (Optional)</Label>
                  <Textarea placeholder="Enter your custom blog content here..." className="min-h-[100px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Campaign</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign1">Q1 Marketing</SelectItem>
                        <SelectItem value="campaign2">Social Media</SelectItem>
                        <SelectItem value="campaign3">Email Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Link Expiry</Label>
                    <Select defaultValue="never">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Link"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Link Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Paste URLs (One per line)</Label>
                <Textarea
                  placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Settings</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue placeholder="Number of blog pages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Pages</SelectItem>
                      <SelectItem value="3">3 Pages</SelectItem>
                      <SelectItem value="4">4 Pages</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="template1">
                    <SelectTrigger>
                      <SelectValue placeholder="Blog template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template1">Technology News</SelectItem>
                      <SelectItem value="template2">Entertainment</SelectItem>
                      <SelectItem value="template3">Health & Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Bulk Links"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

