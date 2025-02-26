import { Link } from "@/lib/firebase/database-schema"
import { ExternalLink, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopLinksProps {
  links: Link[]
}

export default function TopLinks({ links }: TopLinksProps) {
  return (
    <div className="space-y-4">
      {links.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No links created yet</p>
        </div>
      ) : (
        links.map((link) => (
          <div key={link.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {link.title || link.shortUrl.replace(/^https?:\/\//, '')}
              </p>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {link.analytics?.clicks || 0} clicks
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <a href={`/dashboard/links/${link.id}/analytics`}>
                  <BarChart3 className="h-4 w-4" />
                  <span className="sr-only">Analytics</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Visit</span>
                </a>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
} 