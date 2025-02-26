"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LinkIcon, ArrowRight, Sparkles } from "lucide-react" // Add Sparkles here
import Link from "next/link"
import { SignupButton } from "@/components/auth/signup-button"

function FloatingElement({ className }: { className: string }) {
  return <div className={className} />
}

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [url, setUrl] = useState("")
  const [loginPromptVisible, setLoginPromptVisible] = useState(false)
  const y = 0

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleShortenUrl = () => {
    if (!url) {
      return
    }
    // Show login prompt as we're on landing page
    setLoginPromptVisible(true)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.1) 0%, rgba(4, 120, 87, 0) 50%)`,
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />

        {/* Floating Elements - Updated colors */}
        <FloatingElement className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl" />
        <FloatingElement className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-800/10 rounded-full blur-3xl" />

        {/* Decorative Elements - Updated colors */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-8 h-8 bg-emerald-200 dark:bg-emerald-800/30 rounded-full blur" />
          <div className="absolute top-40 right-40 w-6 h-6 bg-orange-200 dark:bg-orange-800/30 rounded-full blur" />
          <div className="absolute bottom-40 left-1/3 w-10 h-10 bg-emerald-200 dark:bg-emerald-800/30 rounded-full blur" />
        </div>

        {/* Grid Pattern - Updated colors */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#0478571a_1px,transparent_1px),linear-gradient(to_bottom,#0478571a_1px,transparent_1px)]"
          style={{ backgroundSize: "4rem 4rem" }}
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <motion.div style={{ y }} className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-4 py-1.5 mb-6">
              <span className="flex items-center text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-4 w-4 mr-2" />
                Turn Every Click into Cash
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              Monetize Your
              <span className="relative whitespace-nowrap">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[.58em] w-full fill-emerald-300/70 dark:fill-emerald-800/60"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative ml-4 text-emerald-700 dark:text-emerald-400">Links</span>
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Join thousands of creators earning through smart link sharing. Our platform turns your links into powerful
              income streams with advanced monetization features.
            </p>
          </motion.div>

          {/* URL Shortener Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative w-full max-w-2xl">
              <div className="flex items-center">
                <Input
                  type="url"
                  placeholder="Enter your long URL here..."
                  className="pr-32 h-14 text-base rounded-l-xl rounded-r-none border-r-0"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button 
                  onClick={handleShortenUrl}
                  className="h-14 px-6 rounded-l-none rounded-r-xl bg-emerald-600 hover:bg-emerald-700"
                >
                  <span className="hidden sm:inline mr-2">Shorten</span>
                  <LinkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Free to use, no registration required for basic shortening.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-8"
          >
            {[
              { label: "Trusted by 50K+ Users", value: "50K+" },
              { label: "99.9% Uptime", value: "99.9%" },
              { label: "Instant Payouts", value: "24h" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-zinc-800/50 rounded-full backdrop-blur-sm border border-emerald-100 dark:border-emerald-800/50"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Login Prompt Modal */}
      {loginPromptVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLoginPromptVisible(false)}
        >
          <motion.div
            className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <LinkIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h2 className="text-2xl font-bold">Create an Account</h2>
              
              <p className="text-zinc-600 dark:text-zinc-400">
                To shorten links and access premium features, you'll need to create an account or sign in.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/signup">
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">
                    Log In
                  </Link>
                </Button>
              </div>
              
              <button 
                onClick={() => setLoginPromptVisible(false)}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 mt-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

