"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { AuthUser } from "@/lib/auth-context"

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  photoURL: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal(""))
})

const settingsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  defaultRedirectDelay: z.coerce.number().min(0).max(60).default(5)
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type SettingsFormValues = z.infer<typeof settingsFormSchema>

export default function SettingsPage() {
  const { user } = useAuth() as { user: AuthUser | null }
  const { toast } = useToast()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [userSettings, setUserSettings] = useState<any>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      photoURL: ""
    },
  })

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      emailNotifications: true,
      defaultRedirectDelay: 5
    },
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchUserSettings()
    }
  }, [user])

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const token = await user?.getIdToken()
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch("/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }
      
      const data = await response.json()
      setUserData(data.user)
      
      // Set form values
      profileForm.reset({
        displayName: data.user.displayName || "",
        photoURL: data.user.photoURL || ""
      })
    } catch (error: any) {
      console.error("Error fetching user profile:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const fetchUserSettings = async () => {
    setIsLoadingSettings(true)
    try {
      const token = await user?.getIdToken()
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch("/api/user/settings", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch user settings")
      }
      
      const data = await response.json()
      setUserSettings(data.settings)
      
      // Set form values
      settingsForm.reset({
        emailNotifications: data.settings.emailNotifications !== false,
        defaultRedirectDelay: data.settings.defaultRedirectDelay || 5
      })
    } catch (error: any) {
      console.error("Error fetching user settings:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingSettings(false)
    }
  }

  async function onProfileSubmit(values: ProfileFormValues) {
    setIsSavingProfile(true)
    try {
      const token = await user?.getIdToken()
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName: values.displayName,
          photoURL: values.photoURL || undefined
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })
      
      // Refresh user profile
      fetchUserProfile()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function onSettingsSubmit(values: SettingsFormValues) {
    setIsSavingSettings(true)
    try {
      const token = await user?.getIdToken()
      
      if (!token) {
        throw new Error("Authentication required")
      }
      
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          emailNotifications: values.emailNotifications,
          defaultRedirectDelay: values.defaultRedirectDelay
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update settings")
      }

      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully."
      })
      
      // Refresh user settings
      fetchUserSettings()
    } catch (error: any) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <DashboardShell>
    <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
      </div>

        <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your public profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingProfile ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={userData?.photoURL || ""} />
                          <AvatarFallback>
                            {userData?.displayName ? getInitials(userData.displayName) : userData?.email?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="text-lg font-medium">{userData?.displayName || "User"}</h3>
                          <p className="text-sm text-muted-foreground">{userData?.email}</p>
                  </div>
                </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="photoURL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Picture URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/avatar.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a URL to your profile picture.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isSavingProfile}>
                        {isSavingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Configure how your links behave by default.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingSettings ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="defaultRedirectDelay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Redirect Delay (seconds)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              The default time to wait before redirecting visitors.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isSavingSettings}>
                        {isSavingSettings ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Settings"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
        </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingSettings ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive email notifications about your links and account.
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
                      
                      <Button type="submit" disabled={isSavingSettings}>
                        {isSavingSettings ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Notification Settings"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
      </div>
    </DashboardShell>
  )
}

