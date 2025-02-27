import { type NextRequest, NextResponse } from "next/server"
import { getUserLinks } from "@/lib/firebase/links"
import { auth, firestore } from "@/lib/firebase/admin"

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : undefined
    const orderBy = searchParams.get("orderBy") as any || undefined
    const orderDir = searchParams.get("orderDir") as any || undefined
    const status = searchParams.get("status") as any || undefined

    // Get the user's links
    const links = await getUserLinks({
      userId,
      limit,
      orderBy,
      orderDir,
      status,
    })

    return NextResponse.json({ success: true, links })
  } catch (error: any) {
    console.error("Error fetching links:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch links" }, { status: 500 })
  }
}

