"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase/config"
import { getAuthToken, createAuthHeader } from "@/lib/auth-helpers"

interface CreateLinkFormProps {
  onClose?: () => void
  onSuccess?: (link: any) => void
}

export function CreateLinkForm({ onClose, onSuccess }: CreateLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState("")
  const [title, setTitle] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Basic validation
      if (!originalUrl) {
        throw new Error("Please enter a URL")
      }
      
      // Try to validate the URL format
      try {
        new URL(originalUrl)
      } catch (error) {
        throw new Error("Please enter a valid URL")
      }
      
      // Get the current user token
      const user = auth.currentUser
      if (!user) {
        throw new Error("You must be logged in to create links")
      }
      
      const token = await getAuthToken(user)
      
      // Make the API request
      const response = await fetch("/api/links/create", {
        method: "POST",
        headers: createAuthHeader(token),
        body: JSON.stringify({
          originalUrl,
          title: title || undefined,
          customCode: customCode || undefined,
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create link")
      }
      
      // Success! Show a toast and refresh the page/component
      toast({
        title: "Link created",
        description: "Your link has been successfully created.",
        variant: "default"
      })
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(data.link)
      }
      
      // Reset the form
      setOriginalUrl("")
      setTitle("")
      setCustomCode("")
      
      // Close the dialog if needed
      if (onClose) {
        onClose()
      }
      
      // Refresh the page to show the new link
      router.refresh()
      
    } catch (error: any) {
      console.error("Error creating link:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create link. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="originalUrl" className="block text-sm font-medium mb-1">
          Original URL<span className="text-red-500">*</span>
        </label>
        <Input
          id="originalUrl"
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/your-long-url"
          required
        />
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title (Optional)
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome link"
        />
        <p className="text-xs text-muted-foreground mt-1">
          A name to help you remember what this link is for
        </p>
      </div>
      
      <div>
        <label htmlFor="customCode" className="block text-sm font-medium mb-1">
          Custom Code (Optional)
        </label>
        <Input
          id="customCode"
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="custom-code"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Leave blank for a random code
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Link"}
        </Button>
      </div>
    </form>
  )
} 