import {
  LandingNavbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  CtaSection,
  Footer,
} from "@/components/landingSections"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
