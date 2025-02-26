import { type NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, createBlogPost } from "@/lib/firebase/blog"
import { auth } from "@/lib/firebase/admin"
import { getUser } from "@/lib/firebase/users"

// Get all blog posts (public)
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : undefined
    const tag = searchParams.get("tag") || undefined
    const status = searchParams.get("status") as 'draft' | 'published' || 'published'

    // For public access, we only show published posts
    const publicStatus = 'published'

    // Check if request has auth token (admin/editor can see drafts)
    const authHeader = request.headers.get("authorization")
    let isAdmin = false

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1]
      try {
        const decodedToken = await auth.verifyIdToken(token)
        const user = await getUser(decodedToken.uid)
        isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
      } catch (error) {
        // Token invalid, but we'll still return published posts
      }
    }

    // Get the blog posts
    const posts = await getAllBlogPosts({
      status: isAdmin ? status : publicStatus,
      limit,
      tag,
      orderBy: 'publishedAt',
      orderDir: 'desc',
    })

    return NextResponse.json({ success: true, posts })
  } catch (error: any) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch blog posts" }, { status: 500 })
  }
}

// Create a new blog post (admin only)
export async function POST(request: NextRequest) {
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

    // Check if user is admin
    const user = await getUser(userId)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse the request body
    const data = await request.json()

    // Create the blog post
    const post = await createBlogPost({
      ...data,
      author: user.displayName || user.email,
    })

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: error.message || "Failed to create blog post" }, { status: 500 })
  }
} 