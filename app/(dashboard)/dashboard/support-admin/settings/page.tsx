"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Save, Clock, Users, MessageSquare, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Types for future integration
interface SupportHours {
  day: string
  isOpen: boolean
  start: string
  end: string
}

interface SLAConfig {
  priority: string
  responseTime: number
  resolutionTime: number
}

interface CustomField {
  id: string
  name: string
  type: "text" | "select" | "checkbox"
  required: boolean
  options?: string[]
}

// Dummy data - Replace with API call
const supportHours: SupportHours[] = [
  { day: "Monday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Thursday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Friday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Saturday", isOpen: false, start: "00:00", end: "00:00" },
  { day: "Sunday", isOpen: false, start: "00:00", end: "00:00" },
]

const slaConfigs: SLAConfig[] = [
  { priority: "High", responseTime: 1, resolutionTime: 4 },
  { priority: "Medium", responseTime: 4, resolutionTime: 8 },
  { priority: "Low", responseTime: 8, resolutionTime: 24 },
]

const customFields: CustomField[] = [
  {
    id: "1",
    name: "Operating System",
    type: "select",
    required: true,
    options: ["Windows", "macOS", "Linux", "Other"],
  },
  {
    id: "2",
    name: "Browser",
    type: "select",
    required: true,
    options: ["Chrome", "Firefox", "Safari", "Edge", "Other"],
  },
]

export default function SupportSettingsPage() {
  const [showFieldDialog, setShowFieldDialog] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    try {
      // Implement settings save
      // await fetch('/api/support/settings', {
      //   method: 'POST',
      //   body: JSON.stringify(settings)
      // })

      toast({
        title: "Settings Saved",
        description: "Support settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      })
    }
  }

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Implement custom field creation
      // await fetch('/api/support/custom-fields', {
      //   method: 'POST',
      //   body: formData
      // })

      toast({
        title: "Field Added",
        description: "Custom field has been added successfully.",
      })
      setShowFieldDialog(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add custom field.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Settings</h1>
        <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mon-Fri</div>
            <p className="text-xs text-muted-foreground">9:00 AM - 5:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 online now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Support Hours</TabsTrigger>
          <TabsTrigger value="sla">SLA Settings</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Support Portal</Label>
                    <p className="text-sm text-muted-foreground">Allow users to access the support portal</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assign Tickets</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign tickets to available agents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow File Attachments</Label>
                    <p className="text-sm text-muted-foreground">Let users attach files to tickets</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Category</Label>
                <Select defaultValue="general">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Support</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportHours.map((hours) => (
                  <div key={hours.day} className="flex items-center gap-4">
                    <div className="w-32">
                      <Label>{hours.day}</Label>
                    </div>
                    <Switch checked={hours.isOpen} />
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input type="time" value={hours.start} disabled={!hours.isOpen} />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input type="time" value={hours.end} disabled={!hours.isOpen} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <Card>
            <CardHeader>
              <CardTitle>SLA Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {slaConfigs.map((sla) => (
                  <div key={sla.priority} className="space-y-4">
                    <Label>{sla.priority} Priority</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Response Time (hours)</Label>
                        <Input type="number" value={sla.responseTime} min="0" step="0.5" />
                      </div>
                      <div className="space-y-2">
                        <Label>Resolution Time (hours)</Label>
                        <Input type="number" value={sla.resolutionTime} min="0" step="0.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Fields</CardTitle>
                <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Custom Field</DialogTitle>
                      <DialogDescription>Add a new custom field to support tickets</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddField} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Field Name</Label>
                        <Input id="name" placeholder="Enter field name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Field Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="required" />
                        <Label htmlFor="required">Required Field</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowFieldDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                          Add Field
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h3 className="font-medium">{field.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{field.type}</Badge>
                        {field.required && <Badge>Required</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for ticket updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SLA Breach Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when SLA thresholds are breached</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Agent Assignment</Label>
                    <p className="text-sm text-muted-foreground">Notify agents when tickets are assigned</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Template</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal Template</SelectItem>
                    <SelectItem value="branded">Branded Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select defaultValue="instant">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

