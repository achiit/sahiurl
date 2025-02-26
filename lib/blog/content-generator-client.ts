// Client-side blog content generator

// List of trending topics for blog content
const trendingTopics = [
  {
    category: "technology",
    topics: [
      "The Future of AI in Everyday Life",
      "How 5G is Transforming Mobile Connectivity",
      "Cybersecurity Tips for Remote Workers",
      "The Rise of No-Code Development Platforms",
      "Understanding Blockchain Beyond Cryptocurrency",
    ],
  },
  {
    category: "health",
    topics: [
      "Mindfulness Practices for Better Mental Health",
      "Nutrition Myths Debunked by Science",
      "The Benefits of High-Intensity Interval Training",
      "Sleep Optimization Techniques for Busy Professionals",
      "Understanding the Gut-Brain Connection",
    ],
  },
  {
    category: "finance",
    topics: [
      "Personal Finance Strategies for Economic Uncertainty",
      "Investing Basics for Beginners",
      "Understanding Cryptocurrency Markets",
      "Retirement Planning in Your 30s",
      "How to Build and Maintain Good Credit",
    ],
  },
  {
    category: "lifestyle",
    topics: [
      "Minimalist Living: Decluttering Your Space and Mind",
      "Sustainable Fashion Choices for Eco-Conscious Consumers",
      "Work-Life Balance in the Remote Work Era",
      "Travel Hacks for Budget-Friendly Adventures",
      "Home Office Design Tips for Productivity",
    ],
  },
]

// Generate paragraphs based on a topic
function generateParagraphs(topic: string, count = 5): string[] {
  // This is a simplified version. In a real implementation, you might use an AI service
  // or have a database of pre-written content

  const paragraphs = [
    `${topic} is becoming increasingly important in our rapidly evolving world. As experts continue to research and develop new approaches, we're seeing significant advancements that impact our daily lives. The latest studies show promising results that could revolutionize how we think about this subject.`,

    `Many people don't realize the profound implications of ${topic.toLowerCase()} on various aspects of society. From economic considerations to social dynamics, the ripple effects are substantial. Researchers at leading institutions have documented these changes through extensive studies and real-world applications.`,

    `When examining ${topic.toLowerCase()} more closely, we find that there are several key factors to consider. First, the historical context provides valuable insights into how we arrived at our current understanding. Second, contemporary applications demonstrate practical benefits that weren't possible before. Finally, future projections suggest even more exciting developments on the horizon.`,

    `Experts in the field recommend several approaches to better understand and utilize the concepts related to ${topic.toLowerCase()}. By implementing these strategies, individuals and organizations can position themselves advantageously. The data supports these recommendations, showing significant improvements in outcomes when these principles are applied correctly.`,

    `As we look toward the future of ${topic.toLowerCase()}, it's clear that continued research and development will yield even more impressive results. Those who stay informed and adaptable will be best positioned to benefit from these advancements. The community of professionals in this area continues to grow, fostering collaboration and innovation.`,

    `One interesting aspect of ${topic.toLowerCase()} that often goes unnoticed is its interconnectedness with other domains. This cross-disciplinary nature creates opportunities for novel applications and insights. By thinking holistically, we can leverage these connections for greater impact and understanding.`,

    `Critics and skeptics have raised valid concerns about certain aspects of ${topic.toLowerCase()}, which deserve thoughtful consideration. Addressing these challenges head-on will strengthen the field and lead to more robust solutions. Transparent discussion of limitations is a hallmark of intellectual honesty in any serious discipline.`,

    `The practical applications of ${topic.toLowerCase()} extend to everyday scenarios that affect millions of people. From improving efficiency to enhancing quality of life, the benefits are tangible and measurable. Case studies from around the world provide compelling evidence of these positive outcomes.`,

    `Learning about ${topic.toLowerCase()} doesn't have to be overwhelming. By breaking down complex concepts into manageable components, anyone can develop a functional understanding. Resources are increasingly available to support this learning journey, from online courses to community forums.`,

    `The ethical dimensions of ${topic.toLowerCase()} warrant careful consideration as we move forward. Responsible implementation requires balancing innovation with principles that protect individual rights and promote collective well-being. Leading thinkers in the field have proposed frameworks to guide these important decisions.`,
  ]

  // Shuffle and take the requested number of paragraphs
  return shuffleArray(paragraphs).slice(0, count)
}

// Helper function to generate a list
function generateList(topic: string, count = 3): string[] {
  const listItems = [
    `Understand the basics of ${topic.toLowerCase()}`,
    `Explore real-world applications of ${topic.toLowerCase()}`,
    `Learn from experts in the field of ${topic.toLowerCase()}`,
    `Discover the latest trends in ${topic.toLowerCase()}`,
    `Find resources for further learning about ${topic.toLowerCase()}`,
  ]
  return shuffleArray(listItems).slice(0, count)
}

// Helper function to generate a quote
function generateQuote(topic: string): string {
  const quotes = [
    `"The only way to do great work is to love what you do." - Steve Jobs on ${topic}`,
    `"Innovation distinguishes between a leader and a follower." - Steve Jobs on ${topic}`,
    `"The best way to predict the future is to create it." - Peter Drucker on ${topic}`,
    `"Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill on ${topic}`,
    `"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt on ${topic}`,
  ]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Generate tags based on the topic
function generateTags(topic: string): string[] {
  const allTags = [
    "technology",
    "health",
    "finance",
    "lifestyle",
    "education",
    "productivity",
    "innovation",
    "research",
    "development",
    "future",
    "trends",
    "insights",
    "analysis",
    "guide",
    "tips",
    "strategies",
    "best practices",
    "case study",
    "tutorial",
    "explanation",
  ]

  // Get category-specific tags
  const categoryTags = topic
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 3)

  // Combine with some general tags
  return [...categoryTags, ...shuffleArray(allTags).slice(0, 5 - categoryTags.length)]
}

/**
 * Generate blog content based on a short code and page number
 * @param shortCode The short code of the link
 * @param pageNumber The page number
 * @returns Generated blog content
 */
export async function generateBlogContent(shortCode: string, pageNumber: number) {
  // Use the shortCode to deterministically select a category
  const categoryIndex = shortCode.charCodeAt(0) % trendingTopics.length
  const category = trendingTopics[categoryIndex].category

  // Use the pageNumber to select a topic within that category
  const topicIndex = (shortCode.charCodeAt(1) + pageNumber) % trendingTopics[categoryIndex].topics.length
  const topic = trendingTopics[categoryIndex].topics[topicIndex]

  // Generate a subtitle
  const subtitles = [
    "Essential insights you need to know",
    "A comprehensive guide for beginners and experts",
    "Exploring the latest trends and developments",
    "What research reveals about this important topic",
    "Practical applications for everyday life",
  ]
  const subtitle = subtitles[(shortCode.charCodeAt(2) + pageNumber) % subtitles.length]

  // Generate paragraphs (5-7 paragraphs per page)
  const paragraphCount = 3 + (pageNumber % 3)
  const paragraphs = generateParagraphs(topic, paragraphCount)

  // Generate a list
  const list = generateList(topic, 3)

  // Generate a quote
  const quote = generateQuote(topic)

  // Generate tags
  const tags = generateTags(topic)

  // Generate image URL (placeholder for now)
  const imageId = (shortCode.charCodeAt(0) * pageNumber) % 1000
  const image = `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(topic)}`

  return {
    title: topic,
    subtitle,
    paragraphs,
    list,
    quote,
    tags,
    image,
    imageCaption: `Illustration related to ${topic.toLowerCase()}`,
    category,
  }
}

