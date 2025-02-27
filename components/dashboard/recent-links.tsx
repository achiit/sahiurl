import { formatDistanceToNow } from "date-fns"
import { ExternalLink, LinkIcon as Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/firebase/database-schema"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentLinksProps {
  links?: Array<Link & { status: 'active' | 'inactive' | 'expired' | 'disabled' }>
}

export function RecentLinks({ links = [] }: RecentLinksProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [links]);

  return (
    <div className="space-y-2">
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))
      ) : (
        links.map((link) => (
          <div key={link.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline"
                >
                  {link.shortUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
              </p>
            </div>
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
        ))
      )}
    </div>
  )
} 
