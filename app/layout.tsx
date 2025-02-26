import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <AuthProvider>
        <body className={inter.className}>
          {children}
        </body>
      </AuthProvider>
    </html>
  )
}

import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
