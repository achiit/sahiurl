"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Download, Code, Chrome, Globe } from "lucide-react"

export default function ToolsPage() {
  const { toast } = useToast()
  const [apiKey] = useState("sk_live_example_key")
  const websiteUrl = "https://yourdomain.com"

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: message,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tools</h1>
      </div>

      <Tabs defaultValue="integration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value="integration">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>JavaScript Integration</CardTitle>
                <CardDescription>Add this script to your website to enable automatic link shortening.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-zinc-950 text-white text-sm overflow-x-auto">
                    {`<script src="https://sahiurl.in/js/sdk.js"></script>
<script>
  SahiURL.init("${apiKey}");
</script>`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      handleCopy(
                        `<script src="https://sahiurl.in/js/sdk.js"></script>\n<script>\n  SahiURL.init("${apiKey}");\n</script>`,
                        "Code copied to clipboard",
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WordPress Plugin</CardTitle>
                <CardDescription>Install our WordPress plugin to automatically shorten all your links.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download Plugin
                  </Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Extension</CardTitle>
                <CardDescription>Shorten links directly from your browser.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex-1">
                    <Chrome className="mr-2 h-4 w-4" />
                    Chrome Extension
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Globe className="mr-2 h-4 w-4" />
                    Firefox Add-on
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Button</CardTitle>
                <CardDescription>Add a share button to your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-zinc-950 text-white text-sm overflow-x-auto">
                    {`<a href="https://sahiurl.in/share" 
  class="sahiurl-share-button" 
  data-url="${websiteUrl}">
  Share
</a>`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      handleCopy(
                        `<a href="https://sahiurl.in/share" class="sahiurl-share-button" data-url="${websiteUrl}">Share</a>`,
                        "Share button code copied",
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>Use these credentials to access the API.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input value={apiKey} readOnly />
                    <Button variant="outline" onClick={() => handleCopy(apiKey, "API key copied to clipboard")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Keep this key secret. Don't share it publicly.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Learn how to integrate with our API.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Code className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                  <Button variant="outline">View Examples</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="extensions">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chrome Extension</CardTitle>
                <CardDescription>Shorten links directly from your browser.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Chrome className="mr-2 h-4 w-4" />
                  Add to Chrome
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Firefox Add-on</CardTitle>
                <CardDescription>Firefox browser extension for quick link shortening.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Add to Firefox
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

