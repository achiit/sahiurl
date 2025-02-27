// Common Types
export type SecurityStatus = "active" | "inactive" | "blocked" | "pending"
export type AlertSeverity = "low" | "medium" | "high" | "critical"
export type ActivityType = "authentication" | "api_access" | "system" | "security"

// Suspicious Activity Types
export interface SuspiciousActivity {
  id: string
  timestamp: Date
  type: ActivityType
  severity: AlertSeverity
  description: string
  source: {
    ip: string
    location?: string
    userAgent?: string
  }
  status: "investigating" | "resolved" | "blocked"
  affectedResource?: string
  actionTaken?: string
  metadata?: Record<string, any>
}

// IP Whitelist Types
export interface WhitelistedIP {
  id: string
  ipAddress: string
  description: string
  addedBy: string
  addedAt: Date
  expiresAt?: Date
  lastAccessed?: Date
  status: SecurityStatus
  location?: string
  purpose?: string
  metadata?: Record<string, any>
}

// API Security Types
export interface APIKey {
  id: string
  name: string
  key: string
  status: "active" | "revoked"
  permissions: string[]
  scopes: string[]
  lastUsed?: Date
  expiresAt?: Date
  createdAt: Date
  rateLimits: {
    requests: number
    interval: string
  }
  metadata?: Record<string, any>
}

export interface SecurityLog {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error"
  category: string
  message: string
  source: string
  metadata?: Record<string, any>
}

// Security Alert Types
export interface SecurityAlert {
  id: string
  timestamp: Date
  severity: AlertSeverity
  title: string
  description: string
  status: "active" | "resolved" | "dismissed"
  category: "access" | "authentication" | "system" | "network"
  affectedComponents?: string[]
  recommendedAction?: string
  metadata?: Record<string, any>
}

// Security Metrics
export interface SecurityMetrics {
  timestamp: Date
  activeThreats: number
  blockedIPs: number
  failedLogins: number
  suspiciousActivities: number
  averageResponseTime: number
  securityScore: number
  vulnerabilities: {
    high: number
    medium: number
    low: number
  }
  complianceScore: number
}

// Security Policy
export interface SecurityPolicy {
  id: string
  name: string
  description: string
  type: "access" | "authentication" | "network" | "data"
  status: "active" | "inactive" | "draft"
  rules: SecurityRule[]
  createdAt: Date
  updatedAt: Date
  lastReviewed?: Date
  metadata?: Record<string, any>
}

export interface SecurityRule {
  id: string
  name: string
  description: string
  condition: string
  action: "allow" | "deny" | "alert" | "block"
  priority: number
  enabled: boolean
}

