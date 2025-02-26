import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shortCode, position, timestamp } = body

    if (!shortCode || !position) {
      return NextResponse.json({ error: "Short code and position are required" }, { status: 400 })
    }

    // Store the ad click in Firestore
    await db.collection("adclicks").add({
      shortCode,
      position,
      timestamp: new Date(timestamp),
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Update earnings for the link owner
    // This would be implemented in a real system with actual ad revenue calculations

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error tracking ad click:", error)
    return NextResponse.json({ error: error.message || "Failed to track ad click" }, { status: 500 })
  }
}

