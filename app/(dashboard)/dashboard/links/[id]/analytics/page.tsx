"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Link as LinkIcon, ArrowLeft, Globe, Users, Clock, ExternalLink, Copy, DollarSign } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow, format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/lib/firebase/database-schema"
import { getAuthToken, createAuthHeader } from "@/lib/auth-helpers"

interface LinkStatus {
  status: 'active' | 'inactive' | 'expired'
}

export default function LinkAnalyticsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [linkData, setLinkData] = useState<Link | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeframe, setTimeframe] = useState("all")

  useEffect(() => {
    if (user) {
      fetchLinkAnalytics()
    }
  }, [user, timeframe, params.id])

  const fetchLinkAnalytics = async () => {
    setIsLoading(true)
    try {
      const token = await getAuthToken(user)
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch(`/api/links/${params.id}/analytics?period=${timeframe}`, {
        headers: createAuthHeader(token)
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch link analytics")
      }
      
      const data = await response.json()
      setLinkData(data.link)
      setAnalytics(data.analytics)
    } catch (error: any) {
      console.error("Error fetching link analytics:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load analytics. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (linkData?.shortUrl) {
      navigator.clipboard.writeText(linkData.shortUrl)
      toast({
        title: "Link copied",
        description: "The short URL has been copied to your clipboard.",
      })
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  // Normalize status so that "disabled" is treated as "inactive"
  const normalizedStatus = linkData?.status === 'disabled' ? 'inactive' : linkData?.status;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/dashboard/links">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Link Analytics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchLinkAnalytics} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Skeleton className="h-4 w-24" />
                  </CardTitle>
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Link Info Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{linkData?.title || 'Untitled Link'}</CardTitle>
              <CardDescription className="flex items-center">
                <LinkIcon className="mr-1 h-4 w-4" />
                <span className="mr-2">{linkData?.shortUrl}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1"
                  asChild
                >
                  <a href={linkData?.shortUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Visit</span>
                  </a>
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Original URL</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">{linkData?.originalUrl}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {linkData?.createdAt 
                      ? formatDistanceToNow(new Date(linkData.createdAt), { addSuffix: true })
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      normalizedStatus === "active"
                        ? "default"
                        : normalizedStatus === "inactive"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {normalizedStatus?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
                {linkData?.expiresAt && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Expires</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(linkData.expiresAt), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalClicks || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {timeframe === 'all' ? 'All time' : `Past ${timeframe}`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics?.uniqueVisitors || 0) > 0 
                    ? `${Math.round((analytics?.uniqueVisitors / (analytics?.totalClicks || 1)) * 100)}% of total clicks`
                    : 'No visitors yet'
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time on Page</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.avgTimeOnPage ? `${analytics.avgTimeOnPage}s` : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Before redirection</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(analytics?.earnings || 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {(analytics?.earnings || 0) > 0 
                    ? `$${((analytics?.earnings || 0) / (analytics?.totalClicks || 1)).toFixed(4)} per click`
                    : 'No earnings yet'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Different Analytics */}
          <Tabs defaultValue="traffic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="traffic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.clicksByDate || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return format(d, 'MMM d');
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} clicks`, "Clicks"]}
                        labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.referrers || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(analytics?.referrers || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} clicks`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="geography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clicks by Country</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.countries || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={analytics?.cities || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="city" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Browsers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={analytics?.browsers || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(analytics?.browsers || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} clicks`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Operating Systems</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={analytics?.os || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(analytics?.os || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} clicks`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={analytics?.devices || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(analytics?.devices || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} clicks`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardShell>
  )
} 