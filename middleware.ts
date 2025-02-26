import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for user authentication in different formats (cookie or session)
  const currentUser = request.cookies.get("sahiurl-user") || request.cookies.get("auth")
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/dashboard/admins") ||
    request.nextUrl.pathname.startsWith("/dashboard/payments") ||
    request.nextUrl.pathname.startsWith("/dashboard/monitoring")

  // Debug logging (remove in production)
  console.log("Middleware checking auth:", { 
    path: request.nextUrl.pathname,
    hasCookie: !!currentUser,
    isAuthPage
  })

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && currentUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If trying to access protected pages while not logged in, redirect to login
  if (!isAuthPage && !currentUser && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access admin routes without admin privileges
  if (isAdminRoute && currentUser) {
    try {
      const userData = JSON.parse(currentUser.value)
      if (userData.role !== "admin" && userData.role !== "superadmin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}

