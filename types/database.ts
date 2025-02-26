import { User as FirebaseUser } from "firebase/auth"

export interface User extends FirebaseUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'user' | 'admin' | 'superadmin'
  subscription?: Subscription
  stats?: UserStats
  createdAt: Date
  updatedAt: Date
  name: string
  balance: number
  totalEarnings: number
  pendingPayment: number
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
  shortUrl: string
  createdAt: Date
  updatedAt: Date
  clicks?: number
  title?: string
  tags?: string[]
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

export interface WhitelistedIP {
  id: string
  userId: string
  ipAddress: string
  addedBy: string
  lastAccessed: Date
  createdAt: Date
}

