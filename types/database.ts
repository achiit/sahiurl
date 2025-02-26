export interface User {
  uid: string
  email: string
  name: string
  role: "user" | "admin" | "superadmin"
  balance: number
  totalEarnings: number
  pendingPayment: number
  createdAt: Date
  updatedAt: Date
  settings?: {
    emailNotifications: boolean
    paymentThreshold: number
    defaultRedirectDelay: number
  }
}

export interface Link {
  id: string
  userId: string
  originalUrl: string
  shortCode: string
  shortUrl: string // Add this field
  title?: string
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  status: 'active' | 'inactive' | 'disabled' | 'expired'
  settings: {
    redirectDelay: number
    password?: string
    customDomain?: string
    adEnabled: boolean
    blogPages: number
  }
  analytics: {
    clicks: number
    uniqueVisitors: number
    lastClickedAt?: Date
    earnings: number
  }
  campaign?: string
}

export interface Click {
  id: string
  linkId: string
  userId: string
  timestamp: Date
  ip: string
  userAgent: string
  referer?: string
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
  earned: number
}

export interface Payment {
  id: string
  userId: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  method: "bank_transfer" | "upi" | "paypal"
  createdAt: Date
  completedAt?: Date
  reference?: string
  accountDetails: {
    bankName?: string
    accountNumber?: string
    ifsc?: string
    upiId?: string
    paypalEmail?: string
  }
}

