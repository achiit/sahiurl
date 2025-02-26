"use client"

import { useState, useCallback } from "react"
import { emailService } from "@/lib/services/email-service"
import type { EmailTemplate } from "@/types/email"

export function useEmailTemplates() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleError = useCallback((error: any) => {
    console.error("Email template operation failed:", error)
    setError(error instanceof Error ? error : new Error("Operation failed"))
    setIsLoading(false)
  }, [])

  const getTemplates = useCallback(async () => {
    try {
      setIsLoading(true)
      const templates = await emailService.getTemplates()
      return templates
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  const createTemplate = useCallback(
    async (template: Omit<EmailTemplate, "id">) => {
      try {
        setIsLoading(true)
        const result = await emailService.createTemplate(template)
        return result
      } catch (error) {
        handleError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  const updateTemplate = useCallback(
    async (id: string, template: Partial<EmailTemplate>) => {
      try {
        setIsLoading(true)
        const result = await emailService.updateTemplate(id, template)
        return result
      } catch (error) {
        handleError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  const deleteTemplate = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true)
        await emailService.deleteTemplate(id)
        return true
      } catch (error) {
        handleError(error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  const sendTestEmail = useCallback(
    async (templateId: string, testData: Record<string, any>) => {
      try {
        setIsLoading(true)
        await emailService.sendTestEmail(templateId, testData)
        return true
      } catch (error) {
        handleError(error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  return {
    isLoading,
    error,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    sendTestEmail,
  }
}

