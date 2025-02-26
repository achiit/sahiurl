"use client"

import { useState, useCallback } from "react"
import { securityService } from "@/lib/services/security-service"
import type { WhitelistedIP, APIKey } from "@/types/security"

export function useSecurity() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleError = useCallback((error: any) => {
    console.error("Security operation failed:", error)
    setError(error instanceof Error ? error : new Error("Operation failed"))
    setIsLoading(false)
  }, [])

  // Suspicious Activity Handlers
  const getSuspiciousActivities = useCallback(async () => {
    try {
      setIsLoading(true)
      const activities = await securityService.getSuspiciousActivities()
      return activities
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  const resolveSuspiciousActivity = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true)
        await securityService.resolveSuspiciousActivity(id)
      } catch (error) {
        handleError(error)
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  // IP Whitelist Handlers
  const getWhitelistedIPs = useCallback(async () => {
    try {
      setIsLoading(true)
      const ips = await securityService.getWhitelistedIPs()
      return ips
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  const addToWhitelist = useCallback(
    async (ipData: Omit<WhitelistedIP, "id" | "addedAt" | "lastAccessed">): Promise<WhitelistedIP | null> => {
      try {
        setIsLoading(true)
        const result = await securityService.addToWhitelist(ipData)
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

  // API Security Handlers
  const getAPIKeys = useCallback(async () => {
    try {
      setIsLoading(true)
      const keys = await securityService.getAPIKeys()
      return keys
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  const createAPIKey = useCallback(
    async (key: Omit<APIKey, "id" | "key">) => {
      try {
        setIsLoading(true)
        const result = await securityService.createAPIKey(key)
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

  // Security Logs Handlers
  const getSecurityLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const logs = await securityService.getSecurityLogs()
      return logs
    } catch (error) {
      handleError(error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [handleError])

  return {
    isLoading,
    error,
    getSuspiciousActivities,
    resolveSuspiciousActivity,
    getWhitelistedIPs,
    addToWhitelist,
    getAPIKeys,
    createAPIKey,
    getSecurityLogs,
  }
}

