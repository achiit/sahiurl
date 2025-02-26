"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AuthBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Smooth mouse following effect
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950 dark:via-zinc-900 dark:to-zinc-900" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0478571a_1px,transparent_1px),linear-gradient(to_bottom,#0478571a_1px,transparent_1px)]"
        style={{ backgroundSize: "4rem 4rem" }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
            mousePosition.y * 100
          }%, rgba(4, 120, 87, 0.15) 0%, rgba(4, 120, 87, 0) 50%)`,
        }}
      />

      {/* Fixed position orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-emerald-300/20 dark:bg-emerald-800/20 rounded-full blur-3xl" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-4 h-4 bg-emerald-400/30 rounded-full"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-2/3 right-1/3 w-6 h-6 bg-emerald-400/30 rounded-full"
        animate={{
          y: [0, -30, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/2 w-8 h-8 bg-emerald-400/30 rounded-full"
        animate={{
          y: [0, 25, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}

