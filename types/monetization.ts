export type AdNetwork = "adsense" | "media.net" | "outbrain" | "taboola"
export type AdType = "display" | "native" | "video" | "text"
export type AdPosition = "header" | "sidebar" | "in-content" | "footer"

export interface AdUnit {
  id: string
  name: string
  network: AdNetwork
  type: AdType
  position: AdPosition
  size: string // e.g., "300x250"
  responsive: boolean
  status: "active" | "paused" | "archived"
  settings: {
    autoOptimize?: boolean
    lazyLoad?: boolean
    refreshInterval?: number
  }
  performance: {
    impressions: number
    clicks: number
    ctr: number
    revenue: number
    rpm: number // Revenue per mille
  }
}

export interface MonetizationSettings {
  networks: {
    [key in AdNetwork]: {
      enabled: boolean
      publisherId: string
      autoAds: boolean
      adBlockerDetection: boolean
    }
  }
  adDensity: {
    maxAdsPerPage: number
    minWordsBetweenAds: number
    maxInlineAds: number
  }
  optimization: {
    autoOptimize: boolean
    abTesting: boolean
    lazyLoading: boolean
    viewabilityTracking: boolean
  }
  compliance: {
    gdprEnabled: boolean
    ccpaEnabled: boolean
    cookieConsent: boolean
    adChoices: boolean
  }
}

export interface RevenueStats {
  daily: {
    date: string
    pageviews: number
    adImpressions: number
    clicks: number
    revenue: number
    rpm: number
    ctr: number
  }[]
  monthly: {
    month: string
    pageviews: number
    adImpressions: number
    clicks: number
    revenue: number
    rpm: number
    ctr: number
  }[]
  byNetwork: {
    network: AdNetwork
    impressions: number
    clicks: number
    revenue: number
    rpm: number
  }[]
  byContent: {
    postId: string
    title: string
    pageviews: number
    revenue: number
    rpm: number
  }[]
}

