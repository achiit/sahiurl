import { type NextRequest, NextResponse } from "next/server"
import { firestore } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shortCode } = body

    if (!shortCode) {
      return NextResponse.json({ error: "Short code is required" }, { status: 400 })
    }

    // Store the page view in Firestore
    await firestore.collection("pageviews").add({
      shortCode,
      timestamp: new Date(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: error.message || "Failed to track page view" }, { status: 500 })
  }
}

