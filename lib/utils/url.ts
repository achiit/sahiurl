export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sahiurl.in'

// Generate a random short code
export function generateShortCode(length: number = 6): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Get full short URL
export function getFullShortUrl(shortCode: string): string {
  return `${BASE_URL}/${shortCode}`
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
} 