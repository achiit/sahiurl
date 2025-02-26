// Client-side tracking functions

/**
 * Track a page view for a specific short link
 * @param shortCode The short code of the link
 * @param pageNumber The page number being viewed
 */
export async function trackPageView(shortCode: string, pageNumber: number) {
  try {
    // Send tracking data to our API
    await fetch("/api/tracking/pageview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shortCode,
        pageNumber,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
      }),
    })
  } catch (error) {
    console.error("Failed to track page view:", error)
  }
}

/**
 * Track when a user clicks on an ad
 * @param position The position of the ad that was clicked
 * @param shortCode The short code of the link
 */
export async function trackAdClick(position: string, shortCode: string) {
  try {
    await fetch("/api/tracking/adclick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shortCode,
        position,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error("Failed to track ad click:", error)
  }
}

/**
 * Track user engagement metrics
 * @param shortCode The short code of the link
 * @param metrics Engagement metrics like time spent, scroll depth, etc.
 */
export async function trackEngagement(shortCode: string, metrics: any) {
  try {
    await fetch("/api/tracking/engagement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shortCode,
        ...metrics,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error("Failed to track engagement:", error)
  }
}

