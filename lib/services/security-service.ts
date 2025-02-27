import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
  DocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { SuspiciousActivity, WhitelistedIP, APIKey, SecurityLog } from "@/types/security"

class SecurityService {
  private static instance: SecurityService

  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  // Suspicious Activity Methods
  async getSuspiciousActivities(): Promise<SuspiciousActivity[]> {
    try {
      const q = query(collection(db, "suspicious_activities"), orderBy("timestamp", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          timestamp: (data.timestamp as Timestamp).toDate(),
          type: data.type,
          severity: data.severity,
          description: data.description,
          source: data.source,
          status: data.status,
          affectedResource: data.affectedResource,
          actionTaken: data.actionTaken,
          metadata: data.metadata,
        } as SuspiciousActivity
      })
    } catch (error) {
      console.error("Failed to fetch suspicious activities:", error)
      throw error
    }
  }

  async resolveSuspiciousActivity(id: string): Promise<void> {
    try {
      const activityRef = doc(db, "suspicious_activities", id)
      await updateDoc(activityRef, {
        status: "resolved",
        actionTaken: "Manually resolved by admin",
        resolvedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Failed to resolve suspicious activity:", error)
      throw error
    }
  }

  async blockIP(ip: string, reason: string): Promise<void> {
    try {
      await addDoc(collection(db, "blocked_ips"), {
        ip,
        reason,
        blockedAt: serverTimestamp(),
        status: "blocked",
      })
    } catch (error) {
      console.error("Failed to block IP:", error)
      throw error
    }
  }

  // IP Whitelist Methods
  async getWhitelistedIPs(): Promise<WhitelistedIP[]> {
    try {
      const q = query(collection(db, "whitelisted_ips"), where("status", "==", "active"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ipAddress: data.ipAddress,
          description: data.description,
          addedBy: data.addedBy,
          addedAt: (data.addedAt as Timestamp).toDate(),
          expiresAt: data.expiresAt ? (data.expiresAt as Timestamp).toDate() : undefined,
          lastAccessed: data.lastAccessed ? (data.lastAccessed as Timestamp).toDate() : undefined,
          status: data.status,
          location: data.location,
          purpose: data.purpose,
          metadata: data.metadata,
        } as WhitelistedIP
      })
    } catch (error) {
      console.error("Failed to fetch whitelisted IPs:", error)
      throw error
    }
  }

  async addToWhitelist(ipData: Omit<WhitelistedIP, "id" | "addedAt" | "lastAccessed">): Promise<WhitelistedIP> {
    try {
      const docRef = await addDoc(collection(db, "whitelisted_ips"), {
        ...ipData,
        addedAt: serverTimestamp(),
        status: ipData.status || "active",
      })

      const doc = await getDoc(docRef)
      const data = doc.data()!

      return {
        id: doc.id,
        ip: data.ip,
        ipAddress: data.ipAddress,
        description: data.description,
        addedBy: data.addedBy,
        addedAt: (data.addedAt as Timestamp).toDate(),
        expiresAt: data.expiresAt ? (data.expiresAt as Timestamp).toDate() : undefined,
        lastAccessed: data.lastAccessed ? (data.lastAccessed as Timestamp).toDate() : undefined,
        status: data.status,
        location: data.location,
        purpose: data.purpose,
        metadata: data.metadata,
      } as WhitelistedIP
    } catch (error) {
      console.error("Failed to add IP to whitelist:", error)
      throw error
    }
  }

  // API Security Methods
  async getAPIKeys(): Promise<APIKey[]> {
    try {
      const q = query(collection(db, "api_keys"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          key: data.key,
          status: data.status,
          scopes: data.scopes || [],
          permissions: data.permissions || [],
          rateLimits: data.rateLimits || { requests: 100, interval: 'minute' },
          createdAt: (data.createdAt as Timestamp).toDate(),
          expiresAt: data.expiresAt ? (data.expiresAt as Timestamp).toDate() : undefined,
          lastUsed: data.lastUsed ? (data.lastUsed as Timestamp).toDate() : undefined,
          metadata: data.metadata || {}
        } as APIKey
      })
    } catch (error) {
      console.error("Failed to fetch API keys:", error)
      throw error
    }
  }

  async createAPIKey(data: Omit<APIKey, "id" | "createdAt">): Promise<APIKey> {
    const docRef = await addDoc(collection(db, "api_keys"), {
      ...data,
      createdAt: serverTimestamp(),
      scopes: data.scopes || [],
      status: data.status || 'active'
    })
    return this.convertToAPIKey(await getDoc(docRef))
  }

  private convertToAPIKey(doc: DocumentSnapshot): APIKey {
    const data = doc.data()!
    return {
      id: doc.id,
      name: data.name,
      key: data.key,
      status: data.status,
      scopes: data.scopes || [],
      permissions: data.permissions || [],
      rateLimits: data.rateLimits || { requests: 100, interval: 'minute' },
      createdAt: (data.createdAt as Timestamp).toDate(),
      expiresAt: data.expiresAt ? (data.expiresAt as Timestamp).toDate() : undefined,
      lastUsed: data.lastUsed ? (data.lastUsed as Timestamp).toDate() : undefined,
      metadata: data.metadata || {}
    } as APIKey
  }

  // Security Logs
  async getSecurityLogs(): Promise<SecurityLog[]> {
    try {
      const q = query(collection(db, "security_logs"), orderBy("timestamp", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          timestamp: (data.timestamp as Timestamp).toDate(),
          level: data.level,
          category: data.category,
          message: data.message,
          source: data.source,
          metadata: data.metadata,
        } as SecurityLog
      })
    } catch (error) {
      console.error("Failed to fetch security logs:", error)
      throw error
    }
  }

  async logSecurityEvent(log: Omit<SecurityLog, "id" | "timestamp">): Promise<void> {
    try {
      await addDoc(collection(db, "security_logs"), {
        ...log,
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error("Failed to log security event:", error)
      throw error
    }
  }
}

export const securityService = SecurityService.getInstance()

