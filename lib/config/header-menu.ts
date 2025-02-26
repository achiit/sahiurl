import {
  Link2,
  BarChart2,
  Wallet,
  Users,
  User2,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
  MessageSquare,
  Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface QuickAction {
  icon: LucideIcon
  label: string
  href: string
  onClick?: () => void
}

export interface MenuItem {
  icon: LucideIcon
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export interface MenuSection {
  title?: string
  items: MenuItem[]
}

export const quickActions: QuickAction[] = [
  {
    icon: Link2,
    label: "Create Link",
    href: "/dashboard/links/create",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    icon: Wallet,
    label: "Withdraw",
    href: "/dashboard/payment",
  },
  {
    icon: Users,
    label: "Referrals",
    href: "/dashboard/referrals",
  },
]

export const menuSections: MenuSection[] = [
  {
    title: "Account",
    items: [
      {
        icon: User2,
        label: "Profile Settings",
        href: "/dashboard/settings",
      },
      {
        icon: Shield,
        label: "Security Settings",
        href: "/dashboard/settings#security",
      },
      {
        icon: CreditCard,
        label: "Payment Methods",
        href: "/dashboard/payment#methods",
      },
      {
        icon: Bell,
        label: "Notification Preferences",
        href: "/dashboard/settings#notifications",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        icon: HelpCircle,
        label: "Help Center",
        href: "/help",
      },
      {
        icon: MessageSquare,
        label: "Contact Support",
        href: "/dashboard/support",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        icon: Settings,
        label: "System Settings",
        href: "/dashboard/settings#system",
      },
    ],
  },
]

