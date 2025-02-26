"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  originalUrl: z.string().url({ message: "Please enter a valid URL" }),
  title: z.string().optional(),
  customCode: z.string().min(3, { message: "Custom code must be at least 3 characters" }).optional().or(z.literal("")),
  redirectDelay: z.coerce.number().min(0).max(60).default(5),
  password: z.string().optional().or(z.literal("")),
  adEnabled: z.boolean().default(true),
  expiresAt: z.string().optional().or(z.literal("")),
})

type LinkFormValues = z.infer<typeof formSchema>

interface CreateLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateLinkDialog({ open, onOpenChange, onSuccess }: CreateLinkDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalUrl: "",
      title: "",
      customCode: "",
      redirectDelay: 5,
      password: "",
      adEnabled: true,
      expiresAt: "",
    },
  })

  async function onSubmit(values: LinkFormValues) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create links",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = await user.getIdToken()

      const response = await fetch("/api/links/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          originalUrl: values.originalUrl,
          title: values.title,
          customCode: values.customCode || undefined,
          expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
          redirectDelay: values.redirectDelay,
          password: values.password || undefined,
          settings: {
            adEnabled: values.adEnabled,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create link")
      }

      const data = await response.json()

      toast({
        title: "Success!",
        description: "Your link has been created successfully",
      })

      form.reset()
      onOpenChange(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error creating link:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>
            Shorten a URL and customize how it works
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="originalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/long-url" {...field} />
                  </FormControl>
                  <FormDescription>
                    The destination URL where users will be redirected
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="My awesome link" {...field} />
                  </FormControl>
                  <FormDescription>
                    A name to help you remember what this link is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                  </Button>
                </div>

            {showAdvanced && (
              <>
                <FormField
                  control={form.control}
                  name="customCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Code (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="my-custom-link" {...field} />
                      </FormControl>
                      <FormDescription>
                        Create a custom short link code instead of a random one
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="redirectDelay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirect Delay (seconds)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={60} {...field} />
                      </FormControl>
                      <FormDescription>
                        How long to show the monetization page before redirecting
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
                      <FormLabel>Password Protection (Optional)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="secret password" {...field} />
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
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the link should expire
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
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Link"
                )}
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

