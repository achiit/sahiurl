import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/firebase/admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { idToken } = body

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken)
    
    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000 // 7 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    
    // Set the session cookie
    cookies().set({
      name: "sahiurl-user",
      value: JSON.stringify({
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || "user",
      }),
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
} 