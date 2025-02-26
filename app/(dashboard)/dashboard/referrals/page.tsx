"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Share2, Users, IndianRupee } from "lucide-react"

// Dummy referral data
const referrals = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    joinDate: "2024-01-15",
    earnings: 2500,
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    joinDate: "2024-01-16",
    earnings: 1800,
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    joinDate: "2024-01-17",
    earnings: 0,
    status: "Pending",
  },
]

export default function ReferralsPage() {
  const { toast } = useToast()
  const referralCode = "REF123456"
  const referralLink = `https://sahiurl.in/join?ref=${referralCode}`

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: message,
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Join sahiurl.in",
        text: "Join sahiurl.in and start earning with your shortened links!",
        url: referralLink,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Referrals</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,300</div>
            <p className="text-xs text-muted-foreground">+₹800 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10%</div>
            <p className="text-xs text-muted-foreground">Per referral earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Share Your Referral Link</CardTitle>
          <CardDescription>Earn 10% of your referrals' earnings for life!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Referral Link</Label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly />
              <Button variant="outline" onClick={() => handleCopy(referralLink, "Referral link copied to clipboard")}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Referral Code</Label>
            <div className="flex gap-2">
              <Input value={referralCode} readOnly />
              <Button variant="outline" onClick={() => handleCopy(referralCode, "Referral code copied to clipboard")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Your Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-sm text-muted-foreground">{referral.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{referral.joinDate}</TableCell>
                  <TableCell>₹{referral.earnings.toLocaleString()}</TableCell>
                  <TableCell>₹{(referral.earnings * 0.1).toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        referral.status === "Active" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

