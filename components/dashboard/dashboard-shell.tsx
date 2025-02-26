import { UserNav } from "./user-nav"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <UserNav />
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
} 