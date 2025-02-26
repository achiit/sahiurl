import { type NextRequest, NextResponse } from "next/server"
import { getLinkById } from "@/lib/firebase/links"
import { getClickStats } from "@/lib/firebase/analytics"
import { auth } from "@/lib/firebase/admin"

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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
    const linkId = params.id

    // Get the link to check ownership
    const link = await getLinkById(linkId)

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Check if the user owns the link
    if (link.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") as 'day' | 'week' | 'month' | 'year' | 'all' || 'all'

    // Get the link analytics
    const analytics = await getClickStats(linkId, period)

    return NextResponse.json({ success: true, link, analytics })
  } catch (error: any) {
    console.error("Error fetching link analytics:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch link analytics" }, { status: 500 })
  }
} 