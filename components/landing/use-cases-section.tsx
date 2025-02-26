"use client"

import { motion } from "framer-motion"
import { Users, Share2, ShoppingBag } from "lucide-react"

const useCases = [
  {
    icon: Users,
    title: "Social Media Influencers",
    description:
      "Maximize your social media presence by monetizing every link you share. Perfect for Instagram, YouTube, and TikTok creators.",
  },
  {
    icon: Share2,
    title: "Content Creators",
    description:
      "Turn your blog posts, videos, and digital content into revenue streams with our advanced link monetization.",
  },
  {
    icon: ShoppingBag,
    title: "Affiliate Marketers",
    description:
      "Boost your affiliate marketing income by adding an extra layer of monetization to your promotional links.",
  },
]

export function UseCasesSection() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-emerald-50 dark:from-zinc-900 dark:to-emerald-900/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Perfect for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Every Creator
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Whether you're just starting out or managing multiple channels, our platform scales with your needs.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl shadow-purple-200/50 dark:shadow-purple-900/20 transform transition-transform group-hover:scale-[1.02]" />
              <div className="relative p-8">
                <div className="mb-4 inline-block p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl">
                  <useCase.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

