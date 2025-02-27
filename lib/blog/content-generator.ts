import type { BlogPost, BlogCategory } from "@/types/blog"

interface ContentTemplate {
  id: string
  title: string
  content?: string
  featured: boolean
  category: BlogCategory
  structures: {
    title: string
    sections: {
      type: "intro" | "main" | "conclusion" | "interactive"
      subSections?: number
      elements: ("text" | "image" | "quote" | "list" | "poll" | "quiz" | "calculator")[]
    }[]
  }[]
}

// Unified template structure with proper typing
const contentTemplates: ContentTemplate[] = [
  {
    id: "tech-revolution",
    title: "Technology Revolution Template",
    featured: true,
    category: "technology",
    structures: [
      {
        title: "How [Technology] Is Revolutionizing [Industry]",
        sections: [
          {
            type: "intro",
            elements: ["text", "image"],
          },
          {
            type: "main",
            subSections: 3,
            elements: ["text", "image", "list", "quote"],
          },
          {
            type: "interactive",
            elements: ["poll", "calculator"],
          },
          {
            type: "conclusion",
            elements: ["text", "quote"],
          },
        ]
      }
    ]
  },
  // ... other templates
]

// Add validation middleware
class ContentValidator {
  static validateTemplate(template: ContentTemplate) {
    if (!template.structures.length) {
      throw new Error(`Template ${template.id} has no structures`)
    }
    template.structures.forEach(structure => {
      if (!structure.sections.length) {
        throw new Error(`Structure ${structure.title} has no sections`)
      }
    })
  }
}

// Update template initialization
contentTemplates.forEach(ContentValidator.validateTemplate)

export class ContentGenerator {
  private static instance: ContentGenerator
  private templates: Map<BlogCategory, ContentTemplate[]>

  private constructor() {
    this.templates = new Map()
    contentTemplates.forEach(template => {
      const categoryTemplates = this.templates.get(template.category) || []
      categoryTemplates.push(template)
      this.templates.set(template.category, categoryTemplates)
    })
  }

  public static getInstance(): ContentGenerator {
    if (!ContentGenerator.instance) {
      ContentGenerator.instance = new ContentGenerator()
    }
    return ContentGenerator.instance
  }

  async generateBlogStructure(category: BlogCategory): Promise<Partial<BlogPost>> {
    const template = this.getRandomTemplate(category)
    return this.buildStructureFromTemplate(template)
  }

  private buildStructureFromTemplate(template: ContentTemplate): Partial<BlogPost> {
    return {
      title: template.structures[0].title,
      content: template.content || '',
      sections: template.structures[0].sections.map(section => ({
        type: section.type,
        elements: section.elements
      }))
    }
  }

  async optimizeForAdsense(content: string): Promise<string> {
    // Actual implementation logic
    return content
      .replace(/(<p>.*?<\/p>)/g, (match) => {
        const wordCount = match.split(/\s+/).length
        return wordCount > 150 ? `${match}<div class="ad-break"></div>` : match
      })
      .replace(/<h\d>/g, (match) => `${match}<div class="ad-header">`)
      .replace(/<\/h\d>/g, (match) => `</div>${match}`)
  }

  private getRandomTemplate(category: BlogCategory): ContentTemplate {
    const categoryTemplates = this.templates.get(category)
    if (!categoryTemplates?.length) {
      throw new Error(`No templates found for category: ${category}`)
    }
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)]
  }

  // Add more content generation methods...
}

export const contentGenerator = ContentGenerator.getInstance()

// Fixed template accessor functions
export function getContentTemplate(templateId: string): ContentTemplate {
  const template = contentTemplates.find(t => t.id === templateId)
  if (!template) {
    throw new Error(`Template ${templateId} not found`)
  }
  return template
}

export function getFeaturedTemplates(): ContentTemplate[] {
  return contentTemplates.filter(t => t.featured)
}

interface BlogTemplate {
  id: string
  title: string
  content: string
  featured: boolean
  categories: string[]
  category: string
  structures: {
    title: string
    sections: {
      type: "intro" | "main" | "conclusion" | "interactive"
      subSections?: number
      elements: ("text" | "image" | "quote" | "list" | "poll" | "quiz" | "calculator")[]
    }[]
  }[]
}

const templates: BlogTemplate[] = [
  {
    id: "basic",
    title: "Basic Blog Template",
    content: "<h1>Blog Post</h1><p>Start writing...</p>",
    featured: true,
    categories: ["general"],
    category: "general",
    structures: [
      {
        title: "Default Template",
        sections: []
      }
    ]
  }
  // ... other templates
]

