import type { SecurityStatus, AlertSeverity } from "@/types/security"

export function validateIPAddress(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

export function generateAPIKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const segments = 4
  const segmentLength = 8
  const segments_arr = []

  for (let i = 0; i < segments; i++) {
    let segment = ""
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments_arr.push(segment)
  }

  return segments_arr.join("-")
}

export function getStatusColor(status: SecurityStatus) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700"
    case "inactive":
      return "bg-yellow-100 text-yellow-700"
    case "blocked":
      return "bg-red-100 text-red-700"
    case "pending":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function getSeverityColor(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700"
    case "high":
      return "bg-orange-100 text-orange-700"
    case "medium":
      return "bg-yellow-100 text-yellow-700"
    case "low":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

export function validatePermissions(permissions: string[]): boolean {
  const validPermissions = ["read", "write", "delete", "admin"]
  return permissions.every((p) => validPermissions.includes(p))
}

