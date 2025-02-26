"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-12 px-4 md:py-20 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
          Create your account now and start shortening links in seconds.
        </p>
        <Button asChild className="mt-8 bg-background text-foreground hover:bg-background/90">
          <Link href="/signup">Sign Up Now</Link>
        </Button>
      </div>
    </section>
  )
}

