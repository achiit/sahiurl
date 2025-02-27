import { type NextRequest, NextResponse } from "next/server"
import { getUserAnalytics } from "@/lib/firebase/analytics"
import { getUserLinks } from "@/lib/firebase/links"
import { auth } from "@/lib/firebase/admin"
import { getUser } from "@/lib/firebase/users"
import type { AuthUser } from "@/lib/auth-context"

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

    // Get user data
    const user = await getUser(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Updated type casting
    const authUser = (user as unknown) as AuthUser

    // Get recent links (last 5)
    const recentLinks = await getUserLinks({
      userId,
      limit: 5,
      orderBy: 'createdAt',
      orderDir: 'desc'
    })

    // Get user analytics
    const analytics = await getUserAnalytics(userId)

    // Get top performing links
    const topLinks = await getUserLinks({
      userId,
      limit: 5,
      orderBy: 'clicks',
      orderDir: 'desc'
    })

    return NextResponse.json({
      success: true,
      dashboardData: {
        user: {
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          stats: user.stats,
          finances: user.finances
        },
        recentLinks,
        topLinks,
        analytics
      }
    })
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error)
    
    // Special handling for index errors
    if (error.code === 'failed-precondition') {
      return NextResponse.json({ 
        error: "Database index missing. Please try again in a few minutes.",
        indexUrl: error.message.match(/https:\/\/[^\s]+/)[0]
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: error.message || "Failed to fetch dashboard data" }, { status: 500 })
  }
} 