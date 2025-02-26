import type { VisitorSession, TrackingEvent } from "@/types/tracking"

export class VisitorTracker {
  private static instance: VisitorTracker
  private currentSession: VisitorSession | null = null

  private constructor() {
    this.initializeTracking()
  }

  public static getInstance(): VisitorTracker {
    if (!VisitorTracker.instance) {
      VisitorTracker.instance = new VisitorTracker()
    }
    return VisitorTracker.instance
  }

  private initializeTracking() {
    if (typeof window === "undefined") return

    // Initialize session
    this.startSession()

    // Track scroll depth
    this.trackScrollDepth()

    // Track interactions
    this.trackInteractions()

    // Track performance
    this.trackPerformance()
  }

  private startSession() {
    const visitorId = this.getOrCreateVisitorId()
    this.currentSession = {
      id: crypto.randomUUID(),
      visitorId,
      startTime: new Date(),
      pagesViewed: [],
      device: this.getDeviceInfo(),
      location: { country: "Unknown" }, // Will be updated via API
      performance: {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
      },
    }

    // Save session start
    this.saveSession()
  }

  private trackScrollDepth() {
    if (typeof window === "undefined") return

    let maxScroll = 0
    window.addEventListener("scroll", () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        this.trackEvent("scroll", { depth: maxScroll })
      }
    })
  }

  private trackInteractions() {
    if (typeof window === "undefined") return

    window.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      this.trackEvent("click", {
        target: target.tagName,
        id: target.id,
        class: target.className,
        text: target.textContent?.slice(0, 50),
      })
    })
  }

  private trackPerformance() {
    if (typeof window === "undefined") return

    // Track Core Web Vitals
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.currentSession!.performance.firstContentfulPaint = entry.startTime
        }
        if (entry.name === "largest-contentful-paint") {
          this.currentSession!.performance.largestContentfulPaint = entry.startTime
        }
      }
      this.saveSession()
    }).observe({ entryTypes: ["paint"] })
  }

  private getDeviceInfo() {
    if (typeof window === "undefined")
      return {
        type: "unknown",
        browser: "unknown",
        os: "unknown",
        screenSize: "unknown",
      }

    const ua = navigator.userAgent
    const mobile =
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
    const tablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)

    return {
      type: mobile ? "mobile" : tablet ? "tablet" : "desktop",
      browser: this.getBrowser(ua),
      os: this.getOS(ua),
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
    }
  }

  private getBrowser(ua: string): string {
    // Implement browser detection
    return "unknown"
  }

  private getOS(ua: string): string {
    // Implement OS detection
    return "unknown"
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem("visitorId")
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      localStorage.setItem("visitorId", visitorId)
    }
    return visitorId
  }

  public trackEvent(type: TrackingEvent["type"], data: Record<string, any>) {
    if (!this.currentSession) return

    const event: TrackingEvent = {
      id: crypto.randomUUID(),
      sessionId: this.currentSession.id,
      visitorId: this.currentSession.visitorId,
      timestamp: new Date(),
      type,
      data,
    }

    // Save event
    this.saveEvent(event)
  }

  private async saveSession() {
    try {
      await fetch("/api/tracking/session", {
        method: "POST",
        body: JSON.stringify(this.currentSession),
      })
    } catch (error) {
      console.error("Failed to save session:", error)
    }
  }

  private async saveEvent(event: TrackingEvent) {
    try {
      await fetch("/api/tracking/event", {
        method: "POST",
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Failed to save event:", error)
    }
  }
}

export const visitorTracker = VisitorTracker.getInstance()

