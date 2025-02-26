import { type NextRequest, NextResponse } from "next/server"
import { getUser, updateUser } from "@/lib/firebase/users"
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

    // Get the user
    const user = await getUser(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return only the settings
    return NextResponse.json({ 
      success: true, 
      settings: user.settings 
    })
  } catch (error: any) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch user settings" }, { status: 500 })
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
    const updatedSettings = await request.json()

    // Update the user settings
    await updateUser(userId, { 
      settings: updatedSettings 
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: error.message || "Failed to update user settings" }, { status: 500 })
  }
} 