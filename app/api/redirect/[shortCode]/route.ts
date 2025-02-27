import { type NextRequest, NextResponse } from "next/server"
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { recordClick } from "@/lib/click-tracking"
import { UAParser } from "ua-parser-js"
import { getCountryFromIP } from "@/lib/geo-location"

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const shortCode = params.shortCode
    
    // Find the link by shortCode
    const linksRef = collection(db, "links")
    const q = query(linksRef, where("shortCode", "==", shortCode))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }
    
    const linkDoc = querySnapshot.docs[0]
    const linkData = linkDoc.data()
    const linkId = linkDoc.id
    
    // Get visitor information
    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const referer = request.headers.get("referer") || undefined
    
    // Parse user agent
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "unknown"
    const os = parser.getOS().name || "unknown"
    const device = parser.getDevice().type || "desktop"
    
    // Get country info (simplified - would use a real IP geolocation service)
    const country = await getCountryFromIP(ip)
    
    // Record click with all this information
    const clickId = await recordClick(linkId, {
      ip,
      userAgent,
      referer,
      country,
      browser,
      os,
      device
    })
    
    // Construct destination URL with tracking parameters
    const destination = new URL(linkData.blogPage || linkData.originalUrl)
    destination.searchParams.append("clickId", clickId)
    destination.searchParams.append("src", "shortlink")
    
    // Return redirect with click ID for tracking
    return NextResponse.redirect(destination.toString())
  } catch (error: any) {
    console.error("Error handling redirect:", error)
    return NextResponse.json({ error: error.message || "Failed to process redirect" }, { status: 500 })
  }
} 