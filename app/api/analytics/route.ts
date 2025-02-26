import { type NextRequest, NextResponse } from "next/server"
import { getUserAnalytics } from "@/lib/firebase/analytics"
import { auth } from "@/lib/firebase/admin"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization token from the request
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]

    // Verify the token
    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(token)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decodedToken.uid

    // Get the user analytics
    const analytics = await getUserAnalytics(userId)

    return NextResponse.json({ success: true, analytics })
  } catch (error: any) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 })
  }
} 