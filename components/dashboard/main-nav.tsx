"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Link2 } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      title: "Links",
      href: "/dashboard/links",
      active: pathname === "/dashboard/links" || pathname.startsWith("/dashboard/links/"),
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/dashboard" className="hidden md:flex items-center space-x-2">
        <Link2 className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          LinkShortener
        </span>
      </Link>
      <nav className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              item.active ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
} 