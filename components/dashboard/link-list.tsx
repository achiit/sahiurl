import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const links = [
  {
    shortUrl: "sahiurl.in/mailtumatohero",
    originalUrl: "https://dribbble.com/shots/Mailumator-Email-Marketing-Hero",
    date: "012 Dec 2022 12:06",
  },
  {
    shortUrl: "sahiurl.in/FinanceHero",
    originalUrl: "https://dribbble.com/shots/19719600-Justadmin-Finance-SaaS-Hero",
    date: "02 Dec 2022 02:06",
  },
]

export function LinkList() {
  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div key={link.shortUrl} className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-emerald-600">{link.shortUrl}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{link.originalUrl}</p>
            <p className="text-xs text-muted-foreground">{link.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

