import React from "react"
import { useAuth } from "@/lib/auth-context"
import type { AuthUser } from "@/lib/auth-context"

// Wrapped the logic in a functional component with a default export
export default function CreateLink() {
  const { user } = useAuth()

  // Guard against undefined user before invoking getIdToken
  const handleGetToken = async () => {
    if (!user) return
    const token = await user.getIdToken()
    console.log("Token:", token)
  }

  return (
    <button onClick={handleGetToken}>
      Create Link
    </button>
  )
} 