import { type NextRequest, NextResponse } from "next/server"
import { getUser, updateUser } from "@/lib/firebase/users"
import { auth, storage } from "@/lib/firebase/admin"

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

    // Get the user
    const user = await getUser(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return a sanitized user object
    return NextResponse.json({ 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        createdAt: user.createdAt,
        stats: user.stats,
        subscription: {
          plan: user.subscription.plan,
          status: user.subscription.status,
          endsAt: user.subscription.endsAt
        }
      }
    })
  } catch (error: any) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    // Parse the request body
    const updates = await request.json()
    
    // Only allow certain fields to be updated
    const allowedFields = ["displayName", "photoURL"];
    const sanitizedUpdates: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    // Update the user
    await updateUser(userId, sanitizedUpdates)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: error.message || "Failed to update user profile" }, { status: 500 })
  }
} 