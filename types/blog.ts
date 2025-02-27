export type BlogStatus = "draft" | "published" | "archived"
export type BlogCategory =
  | "technology"
  | "health"
  | "finance"
  | "lifestyle"
  | "education"
  | "entertainment"
  | "business"
  | "science"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  category: BlogCategory
  tags: string[]
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  status: BlogStatus
  publishedAt?: Date
  updatedAt: Date
  createdAt: Date
  readingTime: number
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  timeOnPage: number
  metadata: {
    seoTitle?: string
    seoDescription?: string
    keywords?: string[]
    canonicalUrl?: string
    ogImage?: string
  }
  interactiveElements?: {
    hasQuiz?: boolean
    hasPoll?: boolean
    hasCalculator?: boolean
    hasInfographic?: boolean
  }
  monetization: {
    adSlots: {
      header?: boolean
      sidebar?: boolean
      inContent?: string[] // Paragraph indexes for in-content ads
      footer?: boolean
    }
    sponsoredContent?: boolean
    affiliateLinks?: {
      url: string
      label: string
    }[]
  }
  sections: Array<{
    type: "intro" | "main" | "conclusion" | "interactive"
    elements: ("text" | "image" | "quote" | "list" | "poll" | "quiz" | "calculator")[]
  }>
}

export interface BlogComment {
  id: string
  postId: string
  parentId?: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  status: "pending" | "approved" | "spam"
  createdAt: Date
  updatedAt: Date
  likes: number
  replies?: BlogComment[]
}

export interface BlogAnalytics {
  postId: string
  views: number
  uniqueVisitors: number
  averageTimeOnPage: number
  bounceRate: number
  adClicks: number
  adImpressions: number
  adRevenue: number
  sources: {
    source: string
    count: number
  }[]
  deviceStats: {
    desktop: number
    mobile: number
    tablet: number
  }
  locationStats: {
    country: string
    count: number
  }[]
}

