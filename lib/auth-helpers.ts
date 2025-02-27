export async function getAuthToken(user: any | null): Promise<string | null> {
  if (!user) return null
  try {
    return await user.getIdToken()
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

export function createAuthHeader(token: string | null): Headers {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  if (token) {
    headers.append('Authorization', `Bearer ${token}`)
  }
  return headers
}

export function isFirebaseAuthUser(user: any): boolean {
  return user && typeof user.getIdToken === 'function'
} 