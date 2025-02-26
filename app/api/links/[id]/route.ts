import { type NextRequest, NextResponse } from "next/server"
import { getLinkById, updateLink, deleteLink } from "@/lib/firebase/links"
import { auth } from "@/lib/firebase/admin"

// Get a single link
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

    // Get the link
    const link = await getLinkById(linkId)

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Check if the user owns the link
    if (link.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ success: true, link })
  } catch (error: any) {
    console.error("Error fetching link:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch link" }, { status: 500 })
  }
}

// Update a link
export async function PATCH(
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

    // Parse the request body
    const updates = await request.json()

    // Update the link
    const updatedLink = await updateLink(linkId, updates)

    return NextResponse.json({ success: true, link: updatedLink })
  } catch (error: any) {
    console.error("Error updating link:", error)
    return NextResponse.json({ error: error.message || "Failed to update link" }, { status: 500 })
  }
}

// Delete a link
export async function DELETE(
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

    // Delete the link
    await deleteLink(linkId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting link:", error)
    return NextResponse.json({ error: error.message || "Failed to delete link" }, { status: 500 })
  }
} 