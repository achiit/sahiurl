"use client"

import type React from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/50 dark:via-zinc-900 dark:to-zinc-900">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0478571a_1px,transparent_1px),linear-gradient(to_bottom,#0478571a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-emerald-300/20 dark:bg-emerald-800/20 rounded-full blur-3xl" />
      </div>

      {/* Fixed sidebar with glass effect */}
      <div className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20">
        <DashboardNav />
      </div>

      {/* Main content with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 relative">
        {/* Fixed header with glass effect */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <Header />
        </div>
        {/* Scrollable content */}
        <main className="relative p-6">{children}</main>
      </div>
    </div>
  )
}

