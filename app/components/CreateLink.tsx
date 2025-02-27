import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/firebase/auth"; // Assuming you have a user hook
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkIcon, Check, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateLink() {
    const { user } = useUser(); // Get the current user
    const { toast } = useToast();
    const [originalUrl, setOriginalUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [linkData, setLinkData] = useState<{ shortUrl: string } | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleCreateLink = async () => {
        if (!originalUrl) {
            toast({
                title: "Error",
                description: "Please enter a valid URL",
                variant: "destructive"
            });
            return;
        }

        // Basic URL validation
        try {
            new URL(originalUrl);
        } catch (e) {
            toast({
                title: "Error",
                description: "Please enter a valid URL with http:// or https://",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            if (!user?.getIdToken) {
                throw new Error("User not authenticated");
            }
            const token = await user?.getIdToken();
            
            if (!token) {
                toast({
                    title: "Error",
                    description: "You must be logged in to create links",
                    variant: "destructive"
                });
                return;
            }

            const response = await fetch("/api/links/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ originalUrl }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to create link");
            }

            setLinkData(data.link);
            setShowResult(true);
            setOriginalUrl("");
            
            toast({
                title: "Success",
                description: "Your link has been shortened successfully!",
                variant: "default"
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (linkData?.shortUrl) {
            navigator.clipboard.writeText(linkData.shortUrl);
            toast({
                title: "Copied!",
                description: "Link copied to clipboard",
                variant: "default"
            });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
                <Input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="Enter your long URL here..."
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button 
                    onClick={handleCreateLink}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {isLoading ? "Creating..." : "Shorten Link"}
                    {!isLoading && <LinkIcon className="ml-2 h-4 w-4" />}
                </Button>
            </div>

            {showResult && linkData && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                            <a
                                href={linkData.shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium break-all"
                            >
                                {linkData.shortUrl}
                            </a>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={copyToClipboard}
                                className="flex items-center"
                            >
                                <Copy className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">Copy</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center"
                                onClick={() => window.open(linkData.shortUrl, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">Open</span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
} 