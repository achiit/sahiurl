import { type NextRequest, NextResponse } from "next/server"
import { updateClickSession } from "@/lib/click-tracking"

export async function POST(request: NextRequest) {
  try {
    const { clickId, sessionDuration, pagesViewed, adImpressions, adClicks } = await request.json()
    
    if (!clickId) {
      return NextResponse.json({ error: "Click ID is required" }, { status: 400 })
    }
    
    await updateClickSession(clickId, {
      sessionDuration,
      pagesViewed,
      adImpressions,
      adClicks
    })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 