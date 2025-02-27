"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Mail, Send, Eye, Edit, Trash } from "lucide-react"
import { useEmailTemplates } from "@/lib/hooks/use-email-templates"
import type { EmailTemplate } from "@/types/email"

// Initial templates for development
const initialTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to sahiurl.in!",
    body: "Hi {{name}},\n\nWelcome to sahiurl.in! We're excited to have you on board.",
    type: "transactional",
    status: "published",
    variables: ["name", "email"],
    lastModified: new Date("2024-01-20"),
    lastSent: new Date("2024-01-20"),
    sendCount: 1250,
  },
  {
    id: "2",
    name: "Password Reset",
    subject: "Reset Your Password",
    body: "Hi {{name}},\n\nClick the link below to reset your password:\n{{resetLink}}",
    type: "transactional",
    status: "published",
    variables: ["name", "resetLink"],
    lastModified: new Date("2024-01-15"),
    lastSent: new Date("2024-01-19"),
    sendCount: 450,
  },
]

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const { isLoading, getTemplates, createTemplate, updateTemplate, deleteTemplate, sendTestEmail } = useEmailTemplates()
  const { toast } = useToast()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    const data = await getTemplates()
    if (data.length > 0) {
      setTemplates(data)
    }
  }

  const handleCreateTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newTemplate = {
      name: formData.get("name") as string,
      subject: formData.get("subject") as string,
      body: formData.get("body") as string,
      type: formData.get("type") as EmailTemplate["type"],
      status: "draft" as EmailTemplate["status"],
      variables: [],
      lastModified: new Date(),
      sendCount: 0,
    }

    try {
      const result = await createTemplate(newTemplate)
      if (result) {
        toast({
          title: "Template Created",
          description: "Email template has been created successfully.",
        })
        setShowCreateDialog(false)
        await loadTemplates()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create email template.",
      })
    }
  }

  const handleTestEmail = async (templateId: string) => {
    try {
      const success = await sendTestEmail(templateId, {
        name: "Test User",
        email: "test@example.com",
      })

      if (success) {
        toast({
          title: "Test Email Sent",
          description: "Check your inbox for the test email.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send test email.",
      })
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    try {
      const success = await deleteTemplate(id)
      if (success) {
        toast({
          title: "Template Deleted",
          description: "The email template has been deleted.",
        })
        await loadTemplates()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete template.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
              <DialogDescription>Create a new email template</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input id="name" name="name" placeholder="Enter template name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input id="subject" name="subject" placeholder="Enter email subject" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Template Type</Label>
                <Select name="type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  name="body"
                  placeholder="Enter email content..."
                  className="min-h-[200px] font-mono"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Use {'{{ variable }}'} syntax for dynamic content
                </p>
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 active templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5K</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value="transactional">Transactional</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="notification">Notification</TabsTrigger>
              </TabsList>

              <div className="relative">
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px]"
                />
              </div>
            </div>

            <div className="space-y-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                      </div>
                      <Badge
                        className={
                          template.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {template.status}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <pre className="text-sm whitespace-pre-wrap font-mono">{template.body}</pre>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Variables</p>
                          <div className="flex gap-2 mt-1">
                            {template.variables.map((variable) => (
                              <Badge key={variable} variant="outline">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Last Modified</p>
                          <p className="text-sm font-medium">{template.lastModified.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => handleTestEmail(template.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Test
                        </Button>
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
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

