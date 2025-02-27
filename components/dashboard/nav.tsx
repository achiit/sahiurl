"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  Wallet,
  LineChart,
  Percent,
  Clock,
  Activity,
  Link2,
  DollarSign,
  FileText,
  Megaphone,
  Image,
  LayoutIcon,
  FileSearch,
  AlertTriangle,
  Key,
  Settings,
  Sliders,
  Mail,
  Webhook,
  Database,
  Headphones,
  Ticket,
  HelpCircle,
  AlertOctagon,
  Gauge,
  Server,
  ChevronDown,
  LogOut,
  Lock,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type NavItem = {
  name: string
  href: string
  icon: any
  badge?: string
  children?: NavItem[]
  onClick?: () => void
}

const adminLinks: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Link Management",
    href: "/dashboard/links",
    icon: Link2,
    children: [
      {
        name: "All Links",
        href: "/dashboard/links",
        icon: Link2,
        badge: "124",
      },
      {
        name: "Create Link",
        href: "/dashboard/links/create",
        icon: Plus,
      },
      {
        name: "Campaigns",
        href: "/dashboard/campaigns",
        icon: LayoutIcon,
      },
    ],
  },
  {
    name: "Earnings",
    href: "/dashboard/payment",
    icon: Wallet,
    badge: "₹15K",
  },
  {
    name: "Tools",
    href: "/dashboard/tools",
    icon: Settings,
    children: [
      {
        name: "API Access",
        href: "/dashboard/tools#api",
        icon: Key,
      },
      {
        name: "Integrations",
        href: "/dashboard/tools#integration",
        icon: Webhook,
      },
    ],
  },
  {
    name: "Referrals",
    href: "/dashboard/referrals",
    icon: Users,
    badge: "+12",
  },
  {
    name: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
]

const superAdminLinks: NavItem[] = [
  {
    name: "Platform Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "Live",
  },
  {
    name: "Admin Management",
    href: "/dashboard/admins",
    icon: Users,
    children: [
      {
        name: "All Admins",
        href: "/dashboard/admins",
        icon: Users,
        badge: "150",
      },
      {
        name: "Verification Queue",
        href: "/dashboard/admins/verification",
        icon: Shield,
        badge: "12",
      },
      {
        name: "Performance",
        href: "/dashboard/admins/performance",
        icon: BarChart3,
      },
      {
        name: "Access Control",
        href: "/dashboard/admins/access",
        icon: Lock,
      },
    ],
  },
  {
    name: "Financial Control",
    href: "/dashboard/payments",
    icon: Wallet,
    children: [
      {
        name: "Payment Distribution",
        href: "/dashboard/payments",
        icon: Wallet,
        badge: "₹250K",
      },
      {
        name: "Revenue Analytics",
        href: "/dashboard/payments/analytics",
        icon: LineChart,
      },
      {
        name: "Commission Settings",
        href: "/dashboard/payments/commission",
        icon: Percent,
      },
      {
        name: "Payment History",
        href: "/dashboard/payments/history",
        icon: Clock,
      },
    ],
  },
  {
    name: "Platform Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    children: [
      {
        name: "Traffic Overview",
        href: "/dashboard/analytics",
        icon: Activity,
      },
      {
        name: "Link Performance",
        href: "/dashboard/analytics/links",
        icon: Link2,
      },
      {
        name: "User Behavior",
        href: "/dashboard/analytics/behavior",
        icon: Users,
      },
      {
        name: "Revenue Reports",
        href: "/dashboard/analytics/revenue",
        icon: DollarSign,
      },
    ],
  },
  {
    name: "Content Management",
    href: "/dashboard/content",
    icon: FileText,
    children: [
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: "New",
      },
      {
        name: "Blog Templates",
        href: "/dashboard/content/templates",
        icon: FileText,
      },
      {
        name: "Ad Management",
        href: "/dashboard/content/ads",
        icon: Image,
      },
      {
        name: "Landing Pages",
        href: "/dashboard/content/pages",
        icon: LayoutIcon,
      },
    ],
  },
  {
    name: "Security",
    href: "/dashboard/security",
    icon: Shield,
    children: [
      {
        name: "Access Logs",
        href: "/dashboard/security/logs",
        icon: FileSearch,
      },
      {
        name: "Suspicious Activity",
        href: "/dashboard/security/alerts",
        icon: AlertTriangle,
        badge: "3",
      },
      {
        name: "IP Whitelist",
        href: "/dashboard/security/whitelist",
        icon: Shield,
      },
      {
        name: "API Security",
        href: "/dashboard/security/api",
        icon: Key,
      },
    ],
  },
  {
    name: "System Settings",
    href: "/dashboard/settings",
    icon: Settings,
    children: [
      {
        name: "General Settings",
        href: "/dashboard/settings",
        icon: Sliders,
      },
      {
        name: "Email Templates",
        href: "/dashboard/settings/email",
        icon: Mail,
      },
      {
        name: "API Configuration",
        href: "/dashboard/settings/api",
        icon: Webhook,
      },
      {
        name: "Backup & Logs",
        href: "/dashboard/settings/backup",
        icon: Database,
      },
    ],
  },
  {
    name: "Support System",
    href: "/dashboard/support-admin",
    icon: Headphones,
    children: [
      {
        name: "Ticket Management",
        href: "/dashboard/support-admin/tickets",
        icon: Ticket,
        badge: "15",
      },
      {
        name: "Admin Support",
        href: "/dashboard/support-admin/admin",
        icon: Users,
      },
      {
        name: "FAQ Management",
        href: "/dashboard/support-admin/faq",
        icon: HelpCircle,
      },
      {
        name: "Support Settings",
        href: "/dashboard/support-admin/settings",
        icon: Settings,
      },
    ],
  },
  {
    name: "Monitoring",
    href: "/dashboard/monitoring",
    icon: Activity,
    children: [
      {
        name: "System Status",
        href: "/dashboard/monitoring/status",
        icon: Activity,
        badge: "Live",
      },
      {
        name: "Error Logs",
        href: "/dashboard/monitoring/errors",
        icon: AlertOctagon,
        badge: "2",
      },
      {
        name: "Performance",
        href: "/dashboard/monitoring/performance",
        icon: Gauge,
      },
      {
        name: "Server Resources",
        href: "/dashboard/monitoring/resources",
        icon: Server,
      },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const links = user?.role === "superadmin" ? superAdminLinks : adminLinks
  const [openItems, setOpenItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Toggle collapsible sections
  const toggleItem = (name: string) => {
    setOpenItems((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]))
  }

  // Check if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(href) && href !== "/dashboard"
  }

  // Handle navigation with loading state
  const handleNavigation = async (href: string, onClick?: () => void) => {
    try {
      if (onClick) {
        await onClick()
      }
      router.push(href)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description: "Failed to navigate to the requested page.",
      })
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
      })
    }
  }

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = isRouteActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openItems.includes(item.name)

    if (hasChildren) {
      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleItem(item.name)}>
          <CollapsibleTrigger className="w-full">
            <div
              className={cn(
                "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-800/20",
                isOpen && "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-800/20",
                isActive && "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-800/20",
              )}
            >
              <div className="flex items-center gap-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-800/20">
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-9 pt-2">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation(child.href, child.onClick)
                }}
                className={cn(
                  "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-800/20",
                  isRouteActive(child.href) && "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-800/20",
                )}
              >
                <child.icon className="h-4 w-4" />
                <span>{child.name}</span>
                {child.badge && (
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-800/20">
                    {child.badge}
                  </span>
                )}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                handleNavigation(item.href, item.onClick)
              }}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-800/20",
                isActive && "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-800/20",
              )}
            >
              <div className="flex items-center gap-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-800/20">
                  {item.badge}
                </span>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="hidden lg:block">
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex h-14 items-center border-b dark:border-zinc-800 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 transition-colors hover:text-emerald-600">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
            <Link2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg">sahiurl.in</span>
        </Link>
      </div>

      {/* Navigation Items - Scrollable */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {links.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>

      {/* User Section - Fixed at bottom */}
      <div className="border-t dark:border-zinc-800 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/20">
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-zinc-500">{user?.role}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-red-500/10 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

