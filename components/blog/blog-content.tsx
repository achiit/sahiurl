"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AdUnit } from "@/components/monetization/ad-unit"
import { generateBlogContent } from "@/lib/blog/content-generator-client"

interface BlogContentProps {
  shortCode: string
  pageNumber: number
}

export function BlogContent({ shortCode, pageNumber }: BlogContentProps) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      try {
        // Generate blog content based on the short code and page number
        const blogContent = await generateBlogContent(shortCode, pageNumber)
        setContent(blogContent)
      } catch (error) {
        console.error("Error loading blog content:", error)
        // Fallback content if generation fails
        setContent({
          title: "Interesting Content",
          subtitle: "Discover something new today",
          paragraphs: [
            "We're preparing your content. This won't take long.",
            "Thank you for your patience as we redirect you to your destination.",
            "In the meantime, feel free to explore our website for more useful tools and resources.",
          ],
          image: "/placeholder.svg?height=400&width=800",
          tags: ["content", "redirect", "waiting"],
        })
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [shortCode, pageNumber])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <article className="prose prose-emerald lg:prose-lg max-w-none">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p className="text-lg text-gray-600 mb-6">{content.subtitle}</p>

      {/* Header Ad */}
      <AdUnit position="in-content-top" />

      {content.image && (
        <figure>
          <img
            src={content.image || "/placeholder.svg"}
            alt={content.title}
            className="rounded-lg w-full h-auto object-cover"
          />
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {content.imageCaption || "Image related to the content"}
          </figcaption>
        </figure>
      )}

      {/* First paragraph */}
      {content.paragraphs && content.paragraphs[0] && <p>{content.paragraphs[0]}</p>}

      {/* List */}
      {content.list && content.list.length > 0 && (
        <ul className="list-disc list-inside my-4">
          {content.list.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {/* Middle Ad */}
      <AdUnit position="in-content-middle" />

      {/* Quote */}
      {content.quote && <blockquote className="italic text-gray-700 my-6">{content.quote}</blockquote>}

      {/* Remaining paragraphs */}
      {content.paragraphs &&
        content.paragraphs.slice(1).map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}

      {/* Bottom Ad */}
      <AdUnit position="in-content-bottom" />

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {content.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

