import { User as FirebaseUser } from "firebase/auth"

export interface User {
  uid: string
  email: string
  name: string
  photoURL?: string | null
  role: 'user' | 'admin' | 'superadmin'
  status: 'active' | 'suspended' | 'pending_verification' | 'banned'
  createdAt: Date
  lastLoginAt: Date
  updatedAt?: Date
  // Extended user profile
  profile?: {
    bio?: string
    website?: string
    company?: string
    socialLinks?: {
      twitter?: string
      facebook?: string
      instagram?: string
      linkedin?: string
    }
    phoneNumber?: string
    address?: string
  }
  // Financial information
  finances?: {
    totalEarnings: number
    availableBalance: number
    pendingBalance: number
    lifetimeClicks: number
    lifetimeUniqueVisitors: number
    conversionRate: number
    lastPayoutDate?: Date
    preferredPaymentMethod?: 'bank_transfer' | 'upi' | 'paypal'
    paymentDetails?: {
      bankName?: string
      accountNumber?: string
      ifsc?: string
      upiId?: string
      paypalEmail?: string
    }
    taxInformation?: {
      panNumber?: string
      gstNumber?: string
      taxResidency?: string
    }
  }
  // Settings and preferences
  settings?: {
    emailNotifications: boolean
    paymentThreshold: number
    defaultRedirectDelay: number
    defaultAdSettings: {
      enabled: boolean
      preferredAdTypes: string[]
      blogTemplateId?: string
    }
    twoFactorEnabled: boolean
    ipWhitelisting: boolean
  }
  // Admin/Superadmin specific fields
  adminAccess?: {
    permissions: string[]
    managedUsers?: string[]
    accessLevel: number
    lastAdminAction?: Date
    securityLog: {
      lastIpAddress: string
      lastLoginTimestamp: Date
      failedAttempts: number
    }
  }
  // Rate limits and usage quotas
  usage?: {
    dailyLinkLimit: number
    linksCreatedToday: number
    monthlyBandwidth: number
    bandwidthUsed: number
    apiCallsLimit: number
    apiCallsUsed: number
  }
  stats?: {
    totalLinks: number
    totalClicks: number
    totalEarnings: number
    balance: number
    pendingPayment?: number
  }
  getIdToken?: () => Promise<string>
  metadata?: {
    authCreatedAt: string
    authLastLoginAt: string
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
    blogTemplateId?: string
    targetGeolocations?: string[]
    deviceTargeting?: {
      desktop: boolean
      mobile: boolean
      tablet: boolean
    }
    utmParameters?: {
      source?: string
      medium?: string
      campaign?: string
      term?: string
      content?: string
    }
    adSettings?: {
      adUnits: string[]
      adDensity: 'low' | 'medium' | 'high'
      adPosition: string[]
    }
  }
  analytics: {
    clicks: number
    uniqueVisitors: number
    lastClickedAt?: Date
    earnings: number
    bounceRate: number
    averageTimeOnPage: number
    conversionRate: number
    geoDistribution: Record<string, number>
    deviceDistribution: Record<string, number>
    referrerDistribution: Record<string, number>
    hourlyClickDistribution: number[]
    dailyClickDistribution: number[]
  }
  campaign?: string
  fraudProtection: {
    suspiciousClicks: number
    blockedIPs: string[]
    lastFraudCheck: Date
  }
  revenueShare: {
    publisherRate: number  // percentage of ad revenue shared with publisher
    platformRate: number   // percentage kept by platform
  }
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
  isUnique: boolean
  sessionDuration?: number
  pagesViewed?: number
  adInteractions?: {
    impressions: number
    clicks: number
    earnings: number
  }
  conversionData?: {
    converted: boolean
    conversionType?: string
    conversionValue?: number
  }
  // Flag for potentially fraudulent clicks
  fraudScore: number
  isFlagged: boolean
  flagReason?: string
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
  // Extended payment information
  paymentPeriod: {
    startDate: Date
    endDate: Date
  }
  transactionFee?: number
  currency: string
  taxAmount?: number
  taxInformation?: {
    taxDeducted: boolean
    taxPercentage?: number
    taxDocumentUrl?: string
  }
  notes?: string
  adminNotes?: string
  payoutInitiatedBy?: string
  approvalHistory?: {
    status: string
    timestamp: Date
    approvedBy?: string
    notes?: string
  }[]
}

export interface WhitelistedIP {
  id: string
  userId: string
  ipAddress: string
  addedBy: string
  lastAccessed: Date
  createdAt: Date
  expiresAt?: Date
  purpose?: string
  isActive: boolean
}

export interface AdUnit {
  id: string
  name: string
  adCode: string
  adType: 'display' | 'native' | 'video' | 'text'
  placement: 'header' | 'footer' | 'sidebar' | 'in-content' | 'interstitial'
  size: string
  status: 'active' | 'inactive' | 'testing'
  performance: {
    impressions: number
    clicks: number
    earnings: number
    ctr: number
    rpm: number
  }
  targeting?: {
    geolocations?: string[]
    devices?: string[]
    browsers?: string[]
    languages?: string[]
  }
}

export interface BlogTemplate {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  createdBy: string
  isDefault: boolean
  isPublic: boolean
  html: string
  css: string
  adPlacements: {
    position: string
    adUnitId: string
  }[]
  settings: {
    colors: {
      primary: string
      secondary: string
      background: string
      text: string
    }
    fonts: {
      heading: string
      body: string
    }
    layout: 'standard' | 'minimal' | 'magazine' | 'landing'
    customScripts?: string[]
  }
}

export interface RevenueReport {
  id: string
  periodType: 'daily' | 'weekly' | 'monthly'
  date: Date
  totalRevenue: number
  platformRevenue: number
  publisherRevenue: number
  adImpressions: number
  adClicks: number
  uniqueVisitors: number
  rpm: number  // Revenue per 1000 impressions
  breakdown: {
    byPublisher: Record<string, number>
    byCountry: Record<string, number>
    byAdUnit: Record<string, number>
    byDevice: Record<string, number>
  }
  status: 'draft' | 'final'
  generatedBy: string
  generatedAt: Date
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resourceType: 'user' | 'link' | 'payment' | 'setting' | 'adUnit' | 'template'
  resourceId: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  details: any
  changes?: {
    before: any
    after: any
  }
  status: 'success' | 'failure'
  errorMessage?: string
}

