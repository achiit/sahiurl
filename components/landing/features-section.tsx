"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Link2, BarChart2, Wallet, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    icon: Link2,
    title: "Smart URL Shortener",
    description:
      "Create branded short links with our powerful URL shortener. Track clicks, location data, and device info in real-time.",
    color: "from-blue-600 to-blue-400",
  },
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your audience. Monitor traffic sources, peak hours, and user behavior to optimize your earnings.",
    color: "from-purple-600 to-purple-400",
  },
  {
    icon: Wallet,
    title: "Multiple Revenue Streams",
    description:
      "Earn through various monetization methods including CPM, CPC, and direct advertisers. Maximize your income potential.",
    color: "from-green-600 to-green-400",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Our platform ensures lightning-fast link processing and reliable redirects. Keep your users happy and your earnings steady.",
    color: "from-orange-600 to-orange-400",
  },
]

export default function FeaturesSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf60a_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf60a_1px,transparent_1px)] bg-[size:6rem_4rem]" />

      <motion.div style={{ y }} className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Maximize Earnings
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Our platform combines powerful tools with seamless monetization features to help you earn more from every
            link you share.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/50 dark:to-zinc-900 rounded-3xl transform transition-transform group-hover:scale-105" />
              <div className="relative p-8 rounded-3xl">
                <div className={`mb-4 inline-block p-3 rounded-2xl bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{feature.description}</p>
                <Button variant="ghost" className="group/button">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/signup">
              Start Monetizing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

