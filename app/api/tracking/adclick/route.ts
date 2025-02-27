import { type NextRequest, NextResponse } from "next/server"
import { firestore } from "@/lib/firebase/admin"
import { updateClickSession } from "@/lib/click-tracking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shortCode, position, clickId, timestamp } = body

    if (!shortCode || !position || !clickId) {
      return NextResponse.json({ error: "Short code, position, and clickId are required" }, { status: 400 })
    }

    // Store the ad click in Firestore for historical tracking
    await firestore.collection("adclicks").add({
      shortCode,
      position,
      clickId, // Track which click resulted in this ad click
      timestamp: new Date(timestamp),
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Update the click session with this ad click info
    await updateClickSession(clickId, {
      sessionDuration: body.sessionDuration || 60, // Default 60 seconds if not provided
      pagesViewed: body.pagesViewed || 1,
      adImpressions: body.adImpressions || 1,
      adClicks: 1 // This is an ad click event
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error tracking ad click:", error)
    return NextResponse.json({ error: error.message || "Failed to track ad click" }, { status: 500 })
  }
}

