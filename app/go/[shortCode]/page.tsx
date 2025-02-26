"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BlogContent } from "@/components/blog/blog-content"
import { AdUnit } from "@/components/monetization/ad-unit"
import { trackPageView } from "@/lib/tracking/client"

interface GoPageProps {
  params: {
    shortCode: string
  }
}

export default function GoPage({ params }: GoPageProps) {
  const { shortCode } = params
  const router = useRouter()
  const [linkData, setLinkData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [timeLeft, setTimeLeft] = useState(10) // Default 10 seconds
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const response = await fetch(`/api/links/${shortCode}`)
        if (!response.ok) {
          throw new Error("Link not found")
        }

        const data = await response.json()
        setLinkData(data.link)
        setTimeLeft(data.link.settings?.redirectDelay || 10)

        // Track page view
        trackPageView(shortCode, 1)
      } catch (error) {
        setError("This link is invalid or has expired")
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [shortCode])

  useEffect(() => {
    if (!linkData || currentPage > (linkData.settings?.blogPages || 3)) return

    // Track page view for subsequent pages
    if (currentPage > 1) {
      trackPageView(shortCode, currentPage)
    }

    let timer: NodeJS.Timeout
    let interval: NodeJS.Timeout

    // Start countdown
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        if (currentPage >= (linkData.settings?.blogPages || 3)) {
          // Final page, redirect to destination
          router.push(linkData.originalUrl)
        } else {
          // Move to next blog page
          setCurrentPage(currentPage + 1)
          setTimeLeft(10) // Reset timer for next page
          setProgress(0)
        }
      }, timeLeft * 1000)

      // Update progress bar
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 100 / timeLeft / 10
          return newProgress > 100 ? 100 : newProgress
        })
      }, 100)
    }

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [linkData, timeLeft, currentPage, router, shortCode])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with countdown */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold text-emerald-600">sahiurl.in</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Redirecting in <span className="font-bold">{timeLeft}</span> seconds
              </div>
              <Button onClick={() => router.push(linkData.originalUrl)} className="bg-emerald-600 hover:bg-emerald-700">
                Skip
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-1 mt-2" />
        </div>
      </header>

      {/* Blog content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            <BlogContent shortCode={shortCode} pageNumber={currentPage} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <AdUnit position="sidebar-top" />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">About This Page</h3>
              <p className="text-sm text-gray-600">
                You're being redirected to your destination. Please wait while we prepare your content.
              </p>
            </div>
            <AdUnit position="sidebar-middle" />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Related Content</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="text-emerald-600 hover:underline">
                    How to create your own short links
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-600 hover:underline">
                    Monetize your content effectively
                  </a>
                </li>
                <li>
                  <a href="#" className="text-emerald-600 hover:underline">
                    Digital marketing best practices
                  </a>
                </li>
              </ul>
            </div>
            <AdUnit position="sidebar-bottom" />
          </div>
        </div>
      </main>

      {/* Footer ad */}
      <div className="mt-8 border-t">
        <div className="container mx-auto px-4 py-6">
          <AdUnit position="footer" />
        </div>
      </div>
    </div>
  )
}

