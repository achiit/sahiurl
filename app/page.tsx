import HeroSection from "@/components/landing/hero-section"
import FeaturesSection from "@/components/landing/features-section"
import StatsSection from "@/components/landing/stats-section"
import TestimonialsSection from "@/components/landing/testimonials-section"
import FAQSection from "@/components/landing/faq-section"
import CTASection from "@/components/landing/cta-section"
import MissingComponent from "@/components/landing/missing-component"
import { Footer } from "@/components/landing/footer"
import { FloatingNav } from "@/components/landing/floating-nav"

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <FloatingNav />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <MissingComponent />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}

