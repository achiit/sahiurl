"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Copy, ExternalLink, Loader2, LinkIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/lib/firebase/database-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { format } from "date-fns"
import { getAuthToken, createAuthHeader } from "@/lib/auth-helpers"

const formSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["active", "disabled"]),
  redirectDelay: z.coerce.number().min(0).max(60),
  password: z.string().optional().or(z.literal("")),
  adEnabled: z.boolean(),
  expiresAt: z.string().optional().or(z.literal("")),
})

type LinkFormValues = z.infer<typeof formSchema>

export default function EditLinkPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [link, setLink] = useState<Link | null>(null)

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "active",
      redirectDelay: 5,
      password: "",
      adEnabled: true,
      expiresAt: "",
    },
  })

  // Fetch the link data when the component mounts
  useEffect(() => {
    if (user) {
      fetchLink()
    }
  }, [user, params.id])

  const fetchLink = async () => {
    setIsLoading(true)
    try {
      const token = await getAuthToken(user)
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch(`/api/links/${params.id}`, {
        headers: createAuthHeader(token)
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch link")
      }
      
      const data = await response.json()
      setLink(data.link)
      
      // Set form values
      form.reset({
        title: data.link.title || "",
        status: data.link.status || "active",
        redirectDelay: data.link.settings?.redirectDelay || 5,
        password: data.link.settings?.password || "",
        adEnabled: data.link.settings?.adEnabled !== false,
        expiresAt: data.link.expiresAt ? format(new Date(data.link.expiresAt), "yyyy-MM-dd'T'HH:mm") : "",
      })
    } catch (error: any) {
      console.error("Error fetching link:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load link. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (link?.shortUrl) {
      navigator.clipboard.writeText(link.shortUrl)
      toast({
        title: "Link copied",
        description: "The short URL has been copied to your clipboard.",
      })
    }
  }

  async function onSubmit(values: LinkFormValues) {
    if (!user || !link) {
      return
    }

    setIsSaving(true)

    try {
      const token = await getAuthToken(user)

      const response = await fetch(`/api/links/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: values.title,
          status: values.status,
          expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
          settings: {
            redirectDelay: values.redirectDelay,
            password: values.password || undefined,
            adEnabled: values.adEnabled,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update link")
      }

      toast({
        title: "Link updated",
        description: "Your link has been updated successfully.",
      })

      // Refresh the link data
      fetchLink()
    } catch (error: any) {
      console.error("Error updating link:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update link. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/dashboard/links">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Edit Link</h2>
        </div>
        <div className="flex space-x-2">
          {!isLoading && link && (
            <>
              <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="outline" asChild>
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit
                </a>
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-12 w-48" />
        </div>
      ) : link ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Link Details</CardTitle>
                  <CardDescription>
                    Basic information about your shortened link.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 py-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={link.shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {link.shortUrl}
                    </a>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Link" {...field} />
                        </FormControl>
                        <FormDescription>
                          A friendly name to identify your link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control whether your link is accessible
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the link will expire (leave empty for no expiration)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure how your link behaves
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="redirectDelay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Redirect Delay (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          How long to wait before redirecting visitors
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Protection</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Optional password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Require a password to access the link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="adEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Monetization</FormLabel>
                          <FormDescription>
                            Show ads to earn money from your links
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">Link not found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/dashboard/links')}
          >
            Go back to links
          </Button>
        </div>
      )}
    </DashboardShell>
  )
} 