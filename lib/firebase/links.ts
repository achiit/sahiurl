import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  increment,
  QueryConstraint,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "./config"
import type { Link as LinkType } from "@/types/database"
import { nanoid } from "nanoid"
import { updateUserStats } from "./users"
import { generateShortCode, getFullShortUrl, BASE_URL } from '../utils/url'

interface LinkAnalytics {
  clicks: number
  uniqueVisitors: number
  countries: Record<string, number>
  referrerDistribution: Record<string, number>
  browsers: Record<string, number>
  deviceDistribution: Record<string, number>
  earnings: number
}

interface LinkSettings {
  redirectDelay: number
  password?: string
  adEnabled: boolean
  blogPages?: number
}

export interface Link {
  id: string
  userId: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  title: string
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  status: 'active' | 'inactive' | 'disabled' | 'expired'
  settings: LinkSettings
  analytics: LinkAnalytics
  campaign?: string
  tags?: string[]
  fraudProtection: {
    suspiciousClicks: number
    blockedIPs: string[]
    lastFraudCheck: Date
  }
  revenueShare: {
    publisherRate: number
    platformRate: number
  }
}

export interface GetUserLinksOptions {
  userId: string
  status?: "active" | "archived"
  search?: string
  orderBy?: "clicks" | "createdAt" | "lastClickedAt"
  orderDir?: "asc" | "desc"
  limit?: number
}

export async function createLink(
  userId: string,
  originalUrl: string,
  options: {
    title?: string
    customCode?: string
    expiresAt?: Date
    redirectDelay?: number
    password?: string
    campaign?: string
    blogPages?: number
    tags?: string[]
  } = {},
): Promise<LinkType> {
  try {
    // Generate or use custom short code
    let shortCode = options.customCode
    let attempts = 0
    const maxAttempts = 3

    // If no custom code provided or custom code is taken, generate a random one
    while (!shortCode || attempts < maxAttempts) {
      if (!shortCode) {
        shortCode = generateShortCode()
      }

      // Check if code exists
      const existingLink = await getLinkByShortCode(shortCode)
      if (!existingLink) break

      // If custom code was provided and exists, throw error
      if (options.customCode) {
        throw new Error("Custom code already exists")
      }

      // Reset for next attempt
      shortCode = undefined
      attempts++
    }

    if (!shortCode) {
      throw new Error("Failed to generate unique short code")
    }

    const link: Omit<LinkType, "id"> = {
      userId,
      originalUrl,
      shortCode,
      shortUrl: getFullShortUrl(shortCode),
      title: options.title || `Link to ${new URL(originalUrl).hostname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: options.expiresAt,
      status: "active",
      settings: {
        redirectDelay: options.redirectDelay || 10,
        password: options.password,
        adEnabled: true,
        blogPages: options.blogPages || 3,
      },
      analytics: {
        clicks: 0,
        uniqueVisitors: 0,
        earnings: 0,
        bounceRate: 0,
        averageTimeOnPage: 0,
        conversionRate: 0,
        geoDistribution: {},
        deviceDistribution: {},
        referrerDistribution: {},
        hourlyClickDistribution: new Array(24).fill(0),
        dailyClickDistribution: new Array(7).fill(0)
      },
      campaign: options.campaign,
      tags: options.tags,
      fraudProtection: {
        suspiciousClicks: 0,
        blockedIPs: [],
        lastFraudCheck: new Date()
      },
      revenueShare: {
        publisherRate: 0,
        platformRate: 0
      }
    }

    const docRef = await addDoc(collection(db, "links"), {
      ...link,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Update user stats
    await updateUserStats(userId, { links: 1 })

    return {
      id: docRef.id,
      ...link,
    }
  } catch (error: any) {
    console.error("Error creating link:", error)
    throw new Error(error.message || "Failed to create link")
  }
}

export async function getLinkByShortCode(shortCode: string): Promise<LinkType | null> {
  try {
    const q = query(collection(db, "links"), where("shortCode", "==", shortCode))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as LinkType
  } catch (error) {
    console.error("Error getting link:", error)
    return null
  }
}

export async function getUserLinks(options: GetUserLinksOptions): Promise<LinkType[]> {
  const linksRef = collection(db, "links")
  let constraints: QueryConstraint[] = []
  
  constraints.push(where("userId", "==", options.userId))
  
  if (options.status) {
    constraints.push(where("status", "==", options.status))
  }
  
  if (options.search) {
    constraints.push(where("keywords", "array-contains", options.search.toLowerCase()))
  }
  
  if (options.orderBy) {
    constraints.push(orderBy(options.orderBy, options.orderDir || "desc"))
  } else {
    constraints.push(orderBy("createdAt", "desc"))
  }
  
  if (options.limit) {
    constraints.push(limit(options.limit))
  }
  
  const q = query(linksRef, ...constraints)
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<LinkType, 'id'>
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
      expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : data.expiresAt ? new Date(data.expiresAt) : undefined,
      analytics: {
        ...data.analytics,
        lastClickedAt: data.analytics.lastClickedAt instanceof Timestamp
          ? data.analytics.lastClickedAt.toDate()
          : data.analytics.lastClickedAt ? new Date(data.analytics.lastClickedAt) : undefined,
      }
    } as LinkType
  })
}

export async function updateLink(id: string, updates: Partial<LinkType>): Promise<void> {
  const docRef = doc(db, "links", id)
  await updateDoc(docRef, updates)
}

export async function deleteLink(id: string): Promise<void> {
  const linkRef = doc(db, "links", id)
  await deleteDoc(linkRef)
}

export async function recordClick(linkId: string, clickData: {
  ip: string
  userAgent: string
  referer?: string
  country?: string
  device?: string
  browser?: string
}) {
  try {
    const linkRef = doc(db, "links", linkId)
    const linkDoc = await getDoc(linkRef)
    
    if (!linkDoc.exists()) {
      throw new Error("Link not found")
    }

    // Update analytics
    const analytics = linkDoc.data().analytics || {}
    
    await updateDoc(linkRef, {
      "analytics.clicks": increment(1),
      "analytics.uniqueVisitors": increment(1),
      [`analytics.countries.${clickData.country || 'unknown'}`]: increment(1),
      [`analytics.referrerDistribution.${clickData.referer || 'direct'}`]: increment(1),
      [`analytics.browsers.${clickData.browser || 'unknown'}`]: increment(1),
      [`analytics.deviceDistribution.${clickData.device || 'unknown'}`]: increment(1),
      updatedAt: serverTimestamp(),
    })

    // Record click in separate collection for detailed analytics
    await addDoc(collection(db, "clicks"), {
      linkId,
      ...clickData,
      timestamp: serverTimestamp(),
    })

  } catch (error) {
    console.error("Error recording click:", error)
    throw error
  }
}

export async function getLinkStats(linkId: string): Promise<{
  clicks: number
  uniqueVisitors: number
  earnings: number
  lastClickedAt?: Date
}> {
  try {
    const linkRef = doc(db, "links", linkId)
    const linkDoc = await getDoc(linkRef)

    if (!linkDoc.exists()) {
      throw new Error("Link not found")
    }

    const data = linkDoc.data()

    return {
      clicks: data.analytics?.clicks || 0,
      uniqueVisitors: data.analytics?.uniqueVisitors || 0,
      earnings: data.analytics?.earnings || 0,
      lastClickedAt: data.analytics?.lastClickedAt
        ? data.analytics.lastClickedAt instanceof Timestamp
          ? data.analytics.lastClickedAt.toDate()
          : new Date(data.analytics.lastClickedAt)
        : undefined,
    }
  } catch (error) {
    console.error("Error getting link stats:", error)
    return {
      clicks: 0,
      uniqueVisitors: 0,
      earnings: 0,
    }
  }
}

export async function getLinkById(id: string): Promise<LinkType | null> {
  const linkRef = doc(db, "links", id)
  const linkDoc = await getDoc(linkRef)
  
  if (!linkDoc.exists()) {
    return null
  }
  
  const data = linkDoc.data() as Omit<LinkType, 'id'>
  
  return {
    id: linkDoc.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    expiresAt: data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : data.expiresAt ? new Date(data.expiresAt) : undefined,
    analytics: {
      ...data.analytics,
      lastClickedAt: data.analytics.lastClickedAt instanceof Timestamp
        ? data.analytics.lastClickedAt.toDate()
        : data.analytics.lastClickedAt ? new Date(data.analytics.lastClickedAt) : undefined,
    }
  } as LinkType
}

export async function getTopLinks(userId: string) {
  const linksRef = collection(db, "links");
  const q = query(
    linksRef,
    where("userId", "==", userId),
    orderBy("analytics.clicks", "desc"),
    limit(5)
  );
  
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching top links:", error);
    throw error;
  }
}

function convertToLink(doc: DocumentSnapshot): LinkType {
  const data = doc.data()!
  return {
    id: doc.id,
    ...data,
    analytics: {
      clicks: data.analytics?.clicks || 0,
      uniqueVisitors: data.analytics?.uniqueVisitors || 0,
      lastClickedAt: data.analytics?.lastClickedAt ? parseTimestamp(data.analytics.lastClickedAt) : undefined,
      earnings: data.analytics?.earnings || 0,
      bounceRate: data.analytics?.bounceRate || 0,
      averageTimeOnPage: data.analytics?.averageTimeOnPage || 0,
      conversionRate: data.analytics?.conversionRate || 0,
      geoDistribution: data.analytics?.geoDistribution || {},
      deviceDistribution: data.analytics?.deviceDistribution || {},
      referrerDistribution: data.analytics?.referrerDistribution || {},
      hourlyClickDistribution: data.analytics?.hourlyClickDistribution || [],
      dailyClickDistribution: data.analytics?.dailyClickDistribution || []
    }
  } as LinkType
}

const parseTimestamp = (timestamp: Date | Timestamp | undefined): Date => {
  if (!timestamp) return new Date()
  return timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp)
}

