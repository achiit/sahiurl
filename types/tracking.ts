export interface VisitorSession {
  id: string
  visitorId: string
  startTime: Date
  endTime?: Date
  duration?: number
  pagesViewed: {
    url: string
    title: string
    timeSpent: number
    scrollDepth: number
    interactions: {
      type: string
      target: string
      timestamp: number
    }[]
  }[]
  source: {
    referrer?: string
    campaign?: string
    medium?: string
    term?: string
  }
  device: {
    type: "desktop" | "mobile" | "tablet"
    browser: string
    os: string
    screenSize: string
  }
  location: {
    country: string
    region?: string
    city?: string
  }
  performance: {
    pageLoadTime: number
    firstContentfulPaint: number
    largestContentfulPaint: number
  }
}

export interface VisitorProfile {
  id: string
  firstSeen: Date
  lastSeen: Date
  visits: number
  totalTimeSpent: number
  interests: {
    category: string
    score: number
  }[]
  behavior: {
    averageTimePerVisit: number
    averagePagesPerVisit: number
    commonPages: {
      url: string
      visits: number
    }[]
    preferredTimes: {
      dayOfWeek: number
      hourOfDay: number
      visits: number
    }[]
  }
}

export interface TrackingEvent {
  id: string
  sessionId: string
  visitorId: string
  timestamp: Date
  type:
    | "pageview"
    | "scroll"
    | "click"
    | "ad_impression"
    | "ad_click"
    | "social_share"
    | "comment"
    | "poll_vote"
    | "quiz_complete"
  data: Record<string, any>
}

