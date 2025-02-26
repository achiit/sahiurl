"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Percent, Save, RefreshCw } from "lucide-react"

// Types for future API integration
interface CommissionTier {
  id: string
  name: string
  minAmount: number
  rate: number
  isActive: boolean
}

interface CommissionSettings {
  baseRate: number
  minimumPayout: number
  payoutFrequency: string
  autoApproval: boolean
  tiers: CommissionTier[]
}

// Dummy data - Replace with API call
const initialSettings: CommissionSettings = {
  baseRate: 70,
  minimumPayout: 1000,
  payoutFrequency: "weekly",
  autoApproval: true,
  tiers: [
    {
      id: "1",
      name: "Basic",
      minAmount: 0,
      rate: 70,
      isActive: true,
    },
    {
      id: "2",
      name: "Silver",
      minAmount: 10000,
      rate: 75,
      isActive: true,
    },
    {
      id: "3",
      name: "Gold",
      minAmount: 50000,
      rate: 80,
      isActive: true,
    },
    {
      id: "4",
      name: "Platinum",
      minAmount: 100000,
      rate: 85,
      isActive: true,
    },
  ],
}

export default function CommissionSettingsPage() {
  const [settings, setSettings] = useState<CommissionSettings>(initialSettings)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Function for future API integration
  const saveSettings = async () => {
    try {
      setIsLoading(true)
      // const response = await fetch('/api/settings/commission', {
      //   method: 'PUT',
      //   body: JSON.stringify(settings),
      // })
      // const data = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Updated",
        description: "Commission settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update commission settings.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateTier = (tierId: string, updates: Partial<CommissionTier>) => {
    setSettings((prev) => ({
      ...prev,
      tiers: prev.tiers.map((tier) => (tier.id === tierId ? { ...tier, ...updates } : tier)),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commission Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettings(initialSettings)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Base Settings</CardTitle>
            <CardDescription>Configure the basic commission settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Base Commission Rate</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.baseRate]}
                  onValueChange={([value]) => setSettings((prev) => ({ ...prev, baseRate: value }))}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <div className="w-20 flex items-center gap-1">
                  <Input
                    type="number"
                    value={settings.baseRate}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        baseRate: Number(e.target.value),
                      }))
                    }
                    className="h-8"
                  />
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Payout Amount (₹)</Label>
              <Input
                type="number"
                value={settings.minimumPayout}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    minimumPayout: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Payout Frequency</Label>
              <Select
                value={settings.payoutFrequency}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, payoutFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Approval</Label>
                <p className="text-sm text-muted-foreground">Automatically approve payouts when conditions are met</p>
              </div>
              <Switch
                checked={settings.autoApproval}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoApproval: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Tiers</CardTitle>
            <CardDescription>Set up tiered commission rates based on earnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.tiers.map((tier) => (
              <div key={tier.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">Min. Amount: ₹{tier.minAmount.toLocaleString()}</p>
                  </div>
                  <Switch
                    checked={tier.isActive}
                    onCheckedChange={(checked) => updateTier(tier.id, { isActive: checked })}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[tier.rate]}
                    onValueChange={([value]) => updateTier(tier.id, { rate: value })}
                    max={100}
                    step={1}
                    className="flex-1"
                    disabled={!tier.isActive}
                  />
                  <div className="w-20 flex items-center gap-1">
                    <Input
                      type="number"
                      value={tier.rate}
                      onChange={(e) => updateTier(tier.id, { rate: Number(e.target.value) })}
                      className="h-8"
                      disabled={!tier.isActive}
                    />
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

