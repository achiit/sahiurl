import axios from 'axios'

// In a production environment, you would use a paid IP geolocation service
// This is a simplified example
export async function getCountryFromIP(ip: string): Promise<string | undefined> {
  try {
    // Skip for localhost/internal IPs
    if (['localhost', '127.0.0.1', '::1', 'unknown'].includes(ip) ||
        ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return undefined
    }
    
    // Use free IP geolocation API (limited in production)
    const response = await axios.get(`https://ipapi.co/${ip}/json/`)
    
    if (response.status === 200 && response.data && response.data.country_code) {
      return response.data.country_code
    }
    
    return undefined
  } catch (error) {
    console.error('Error determining country from IP:', error)
    return undefined
  }
} 