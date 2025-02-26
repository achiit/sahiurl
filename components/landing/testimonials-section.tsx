"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote:
      "I was skeptical at first, but sahiurl.in has completely changed how I monetize my content. I'm earning more than ever!",
    author: "Priya Sharma",
    role: "Content Creator",
    avatar: "/placeholder.svg?height=64&width=64",
    earnings: "₹45,000/month",
  },
  {
    quote:
      "The platform is incredibly user-friendly and the earnings are consistent. Best decision I made for my online business.",
    author: "Rahul Verma",
    role: "Digital Marketer",
    avatar: "/placeholder.svg?height=64&width=64",
    earnings: "₹75,000/month",
  },
  {
    quote: "Their analytics tools and instant payouts make it the perfect platform for serious link monetization.",
    author: "Anita Patel",
    role: "Social Media Influencer",
    avatar: "/placeholder.svg?height=64&width=64",
    earnings: "₹92,000/month",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((current) => (current + 1) % testimonials.length)
  }

  const previous = () => {
    setCurrentIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-12 px-4 md:py-20 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center">
          What Our Users Say
        </h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900 rounded-3xl p-8 md:p-12">
                <Quote className="w-12 h-12 text-purple-600 mb-6" />
                <blockquote className="text-2xl font-medium mb-8">{testimonials[currentIndex].quote}</blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].author}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonials[currentIndex].author}</div>
                      <div className="text-zinc-600 dark:text-zinc-400">{testimonials[currentIndex].role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Average Earnings</div>
                    <div className="text-xl font-bold text-purple-600">{testimonials[currentIndex].earnings}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={previous}
              className="rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

