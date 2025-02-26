import { type NextRequest, NextResponse } from "next/server"
import { getLinkByShortCode, recordClick } from "@/lib/firebase/links"
import { UAParser } from "ua-parser-js"

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
  try {
    const shortCode = params.shortCode

    // Get the link from the database
    const link = await getLinkByShortCode(shortCode)

    if (!link) {
      return NextResponse.redirect(new URL("/404", request.url))
    }

    // Check if the link is expired
    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.redirect(new URL("/expired", request.url))
    }

    // Parse user agent for analytics
    const ua = new UAParser(request.headers.get("user-agent") || "")
    const browser = ua.getBrowser().name || "unknown"
    const device = ua.getDevice().type || "desktop"
    
    // Get country from CF headers
    const country = request.headers.get("cf-ipcountry") || "unknown"

    // Record the click with enhanced analytics
    const clickData = {
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      referer: request.headers.get("referer") || "direct",
      country,
      browser,
      device,
    }

    // Record click without waiting
    recordClick(link.id, clickData).catch(err => {
      console.error("Error recording click:", err)
    })

    // Check if we should use the monetization system
    if (link.settings.adEnabled) {
      const monetizationUrl = new URL(`/go/${shortCode}`, request.url)
      return NextResponse.redirect(monetizationUrl)
    }

    // Direct redirect if ads are disabled
    return NextResponse.redirect(new URL(link.originalUrl))
  } catch (error: any) {
    console.error("Error processing redirect:", error)
    return NextResponse.redirect(new URL("/error", request.url))
  }
}

