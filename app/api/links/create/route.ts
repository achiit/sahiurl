import { type NextRequest, NextResponse } from "next/server"
import { createLink } from "@/lib/firebase/links"
import { auth } from "@/lib/firebase/admin"

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]

    // Verify the token
    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(token)
    } catch (error) {
      console.error("Token verification failed:", error)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decodedToken.uid

    // Parse the request body
    const body = await request.json()
    const { originalUrl, title, customCode, expiresAt, redirectDelay, password, campaign, blogPages } = body

    if (!originalUrl) {
      return NextResponse.json({ error: "Original URL is required" }, { status: 400 })
    }

    try {
      // Validate URL
      new URL(originalUrl);
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Create the short link
    const link = await createLink(userId, originalUrl, {
      title: title || `Link to ${new URL(originalUrl).hostname}`,
      customCode,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      redirectDelay,
      password,
      campaign,
      blogPages,
    })

    return NextResponse.json({ success: true, link }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating link:", error)
    return NextResponse.json({ error: error.message || "Failed to create link" }, { status: 500 })
  }
}

