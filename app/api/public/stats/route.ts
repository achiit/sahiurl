import { type NextRequest, NextResponse } from "next/server"
import { getFirestoreStats } from "@/lib/firebase/analytics"

export const revalidate = 3600 // Revalidate at most every hour

export async function GET(request: NextRequest) {
  try {
    const stats = await getFirestoreStats()
    
    return NextResponse.json({ 
      success: true, 
      stats
    })
  } catch (error: any) {
    console.error("Error fetching public stats:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch statistics"
    }, { 
      status: 500 
    })
  }
} 