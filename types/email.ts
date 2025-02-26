export type EmailTemplateType = "transactional" | "marketing" | "notification"
export type EmailTemplateStatus = "published" | "draft" | "archived"

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: EmailTemplateType
  status: EmailTemplateStatus
  variables: string[]
  lastModified: Date
  lastSent?: Date
  sendCount: number
  category?: string
  description?: string
  metadata?: Record<string, any>
}

export interface EmailStats {
  totalTemplates: number
  activeTemplates: number
  totalSent: number
  deliveryRate: number
}

