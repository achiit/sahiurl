"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link as LucideLink, Globe, BarChart3, DollarSign, ArrowUpRight, Info } from "lucide-react"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { RecentLinks } from "@/components/dashboard/recent-links"
import TopLinks from "@/components/dashboard/top-links"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import type { Link } from "@/lib/firebase/database-schema"
import { getAuthToken, createAuthHeader } from "@/lib/auth-helpers"
import { ErrorBoundary } from "react-error-boundary"

interface DashboardStats {
  totalLinks: number
  totalClicks: number
  earnings: number
  recentLinks: Link[]
  topLinks: Link[]
  analytics: {
    clicksToday: number
    earningsToday: number
    clicksByDate: Array<{ date: string; clicks: number }>
    topCountries: Array<{ country: string; clicks: number }>
  }
  user?: {
    displayName: string
    email: string
    role: string
    subscription?: string
    stats?: any
  }
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-lg">
      <h2 className="font-bold mb-2">Something went wrong:</h2>
      <pre className="mb-4">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    totalClicks: 0,
    earnings: 0,
    recentLinks: [],
    topLinks: [],
    analytics: {
      clicksToday: 0,
      earningsToday: 0,
      clicksByDate: [],
      topCountries: []
    },
    user: undefined
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const token = await getAuthToken(user)
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch("/api/dashboard/stats", {
        headers: createAuthHeader(token)
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      
      const data = await response.json()
      setStats(data.dashboardData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Could not load dashboard data. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={fetchDashboardData} disabled={isLoading}>
              Refresh Data
            </Button>
          </div>
        </div>

        {isLoading ? (
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
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                <LucideLink className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalLinks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(stats.recentLinks && stats.recentLinks.length > 0) 
                    ? `+${stats.recentLinks.length} in the last 30 days` 
                    : 'No new links recently'
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalClicks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.analytics?.clicksToday > 0 ? `+${stats.analytics?.clicksToday} today` : 'No clicks today'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CTR</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalLinks > 0
                    ? `${((stats.totalClicks / stats.totalLinks) || 0).toFixed(2)}`
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">Clicks per link</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats.earnings || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.analytics?.earningsToday > 0 
                    ? `+$${stats.analytics?.earningsToday.toFixed(2)} today` 
                    : 'No earnings today'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Click Traffic</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {isLoading ? (
                    <Skeleton className="h-[240px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={stats.analytics?.clicksByDate || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} clicks`, "Clicks"]}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString();
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="clicks"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[240px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={stats.analytics?.topCountries || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Top Links</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <TopLinks links={stats.topLinks || []} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Links</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <RecentLinks links={stats.recentLinks || []} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* Add more detailed analytics here */}
          </TabsContent>
          <TabsContent value="links" className="space-y-4">
            {/* Add more detailed link management here */}
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </DashboardShell>
  )
}

