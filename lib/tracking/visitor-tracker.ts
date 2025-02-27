import type { VisitorSession, TrackingEvent } from "@/types/tracking"
import UAParser from "ua-parser-js"

export class VisitorTracker {
  private static instance: VisitorTracker
  private currentSession: VisitorSession | null = null
  private readonly userAgent: string

  constructor(userAgent: string) {
    this.userAgent = userAgent
    this.initializeTracking()
  }

  public static getInstance(): VisitorTracker {
    if (!VisitorTracker.instance) {
      VisitorTracker.instance = new VisitorTracker(navigator.userAgent)
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
      device: this.parseDeviceInfo(),
      location: this.getGeoLocation(),
      source: this.getTrafficSource(),
      performance: {
        connectionType: this.getConnectionType(),
        memoryStatus: this.getMemoryStatus()
      }
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
    this.setupPerformanceObserver()
  }

  private setupPerformanceObserver() {
    // Remove firstContentfulPaint and largestContentfulPaint tracking
  }

  private parseDeviceInfo() {
    // Casting UAParser as a constructor to bypass type issues
    const Parser = UAParser as unknown as { new(ua: string): any }
    const parser = new Parser(this.userAgent)
    return {
      type: this.getDeviceType(parser) as 'mobile' | 'tablet' | 'desktop',
      browser: parser.getBrowser().name || 'unknown',
      os: parser.getOS().name || 'unknown',
      screenSize: `${window.screen.width}x${window.screen.height}`
    }
  }

  private getTrafficSource() {
    return {
      ip: '', // Will be populated server-side
      referrer: document.referrer,
      campaign: new URLSearchParams(window.location.search).get('utm_campaign') || 'direct'
    }
  }

  private getDeviceType(parser: any): "mobile" | "tablet" | "desktop" {
    const deviceType = parser.getDevice().type || 'desktop'
    return deviceType === 'mobile' ? 'mobile' : 
           deviceType === 'tablet' ? 'tablet' : 'desktop'
  }

  private getConnectionType(): string {
    // Implementation needed
    return "unknown"
  }

  private getMemoryStatus(): string {
    // Implementation needed
    return "unknown"
  }

  private getGeoLocation(): { country: string } {
    // Implementation needed
    return { country: "Unknown" }
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

