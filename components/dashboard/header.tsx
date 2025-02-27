"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { quickActions, menuSections } from "@/lib/config/header-menu"
import type { QuickAction, MenuItem } from "@/lib/config/header-menu"
import { useToast } from "@/components/ui/use-toast"

// Dummy notifications data
const notifications = [
  {
    id: 1,
    title: "New payment received",
    description: "You received ₹1,500 from recent links",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Link milestone reached",
    description: "Your link 'marketing-campaign' reached 1000 clicks",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "System update",
    description: "New features have been added to your dashboard",
    time: "1 day ago",
    read: true,
  },
]

export function Header() {
  const router = useRouter()
  const { user, signOut } = useAuth() // Changed from logout to signOut
  const { toast } = useToast()
  const [unreadCount, setUnreadCount] = useState(notifications.filter((n) => !n.read).length)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Handle navigation with optional onClick handler
  const handleNavigation = (item: QuickAction | MenuItem) => {
    if (item.onClick) {
      item.onClick()
    }
    if (item.href) {
      router.push(item.href)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Searching...",
        description: `Searching for "${searchQuery}"`,
      })
      // Implement search functionality here
    }
  }

  // Handle notification click
  const handleNotificationClick = (notificationId: number) => {
    // Mark notification as read
    setUnreadCount((prev) => Math.max(0, prev - 1))
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return "₹0"
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800 px-6">
      <div className="flex flex-1 items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <Input
            type="search"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 pl-9"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
                  <Badge variant="destructive" className="h-4 min-w-[16px] rounded-full px-1 text-[10px]">
                    {unreadCount}
                  </Badge>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 p-4 cursor-pointer"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && (
                      <Badge variant="default" className="ml-auto">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">{notification.description}</p>
                  <p className="text-xs text-zinc-500">{notification.time}</p>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/settings")}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 dark:hover:ring-offset-zinc-900 transition-all"
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).click()}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={user?.name} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
            {/* User Info */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-zinc-500">{user?.email}</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Balance: {formatCurrency(user?.stats?.balance ?? 0)}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 p-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-start gap-2 h-9 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  onClick={() => handleNavigation(action)}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Menu Sections */}
            {menuSections.map((section, index) => (
              <div key={section.title || index}>
                <DropdownMenuSeparator />
                {section.items.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => handleNavigation(item)}
                    disabled={item.disabled}
                    className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </div>
            ))}

            {/* Logout */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await signOut() // Changed from logout to signOut
                  toast({
                    title: "Logged out",
                    description: "You have been successfully logged out.",
                  })
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to log out.",
                  })
                }
              }}
              className="text-red-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

