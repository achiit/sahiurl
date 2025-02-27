"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IndianRupee, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Dummy payment history
const paymentHistory = [
  {
    id: "1",
    amount: 5000,
    status: "Completed",
    date: "2024-01-15",
    method: "Bank Transfer",
  },
  {
    id: "2",
    amount: 3500,
    status: "Processing",
    date: "2024-01-10",
    method: "UPI",
  },
  {
    id: "3",
    amount: 7500,
    status: "Completed",
    date: "2024-01-05",
    method: "Bank Transfer",
  },
]

export default function PaymentPage() {
  const { user } = useAuth()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle withdrawal logic here
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments & Withdrawals</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline space-x-2">
              <IndianRupee className="h-4 w-4" />
              <div className="text-2xl font-bold">
                ₹{user?.finances?.availableBalance?.toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Minimum withdrawal amount: ₹1,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">₹{user?.finances?.totalEarnings?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold">₹{user?.finances?.pendingBalance?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    className="pl-9"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Withdrawals are processed within 24-48 hours. Minimum withdrawal amount is ₹1,000.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Request Withdrawal
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{payment.method}</p>
                </div>
                <div className="text-right space-y-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      payment.status === "Completed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

