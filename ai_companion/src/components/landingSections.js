"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Phone,
  Mic,
  BarChart3,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* navbar */
export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            SoulChat
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3">
            <Button variant="ghost" asChild className="w-full justify-center text-muted-foreground">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="w-full justify-center">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}


/* companion avatars */
function CompanionAvatars() {
  const companions = [
    { name: "Luna", emoji: "👩🏻‍💻" },
    { name: "Nova", emoji: "🧠" },
    { name: "Kai", emoji: "👩🏻‍🔬" },
    { name: "Zara", emoji: "🤖" },
    { name: "Orion", emoji: "👩🏻‍⚕" },
  ]

  return (
    <div className="flex h-32 items-center justify-center gap-6">
      {companions.map((c, i) => (
        <div
          key={i}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white text-xl shadow-md animate-float"
        >
          {c.emoji}
        </div>
      ))}
    </div>
  )
}

/* hero section*/
export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary animate-glow" />
          AI-Powered Intelligence
        </div>

        <h1 className="font-display text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          AI Companion
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Transform every customer call into a seamless, intelligent conversation.
          Automate support, qualify leads, and scale your voice operations with
          AI that sounds truly human.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="min-w-[200px] text-base">
            <Link href="/register">
              New Customer? Register Here
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[200px] text-base border-border text-foreground hover:bg-secondary">
            <Link href="/login">Log In to Dashboard</Link>
          </Button>
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          <CompanionAvatars />
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6 border-t border-border/60 pt-10">
          {[
            { value: "10M+", label: "Calls Handled" },
            { value: "99.7%", label: "Uptime SLA" },
            { value: "<200ms", label: "Response Time" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* features*/

const FEATURES = [
  {
    icon: Phone,
    title: "Smart Call Routing",
    description:
      "Intelligently route inbound calls to the right agent or department based on real-time intent detection.",
  },
  {
    icon: Mic,
    title: "Natural Speech",
    description:
      "Ultra-realistic voice synthesis that adapts tone and pace for truly human-like conversations.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description:
      "Real-time dashboards with sentiment analysis, call scoring, and actionable performance insights.",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description:
      "Go live in minutes with pre-built templates and seamless integration into your existing workflows.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption, role-based access, and full audit trails.",
  },
  {
    icon: Globe,
    title: "30+ Languages",
    description:
      "Break language barriers with multilingual voice agents that detect and switch languages automatically.",
  },
]

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:bg-secondary/50">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Everything You Need to Automate Voice
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Built for teams that demand reliability, performance, and scale from
            their voice infrastructure.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* how it works */
const STEPS = [
  {
    step: "01",
    title: "Connect Your System",
    description:
      "Link your phone system, CRM, or helpdesk in minutes with our pre-built integrations.",
  },
  {
    step: "02",
    title: "Configure Your Agent",
    description:
      "Define conversation flows, set response rules, and fine-tune personality to match your brand.",
  },
  {
    step: "03",
    title: "Go Live & Scale",
    description:
      "Deploy your voice agent and watch it handle thousands of calls while you focus on growth.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/50 bg-card/50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Live in Three Simple Steps
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((item, idx) => (
            <div key={item.step} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {idx < STEPS.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-px w-full translate-x-6 bg-border md:block" />
              )}
              <span className="font-display relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                {item.step}
              </span>
              <h3 className="font-display mt-5 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* pricing*/
const PLANS = [
  {
    name: "Starter",
    price: "$49",
    description: "For small teams getting started with voice AI.",
    features: ["500 minutes / mo", "1 Voice Agent", "Basic Analytics", "Email Support"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$199",
    description: "For growing businesses that need advanced features.",
    features: [
      "5,000 minutes / mo",
      "5 Voice Agents",
      "Advanced Analytics",
      "Priority Support",
      "Custom Integrations",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with high-volume requirements.",
    features: [
      "Unlimited minutes",
      "Unlimited Agents",
      "Dedicated Account Mgr",
      "SLA Guarantee",
      "On-Prem Option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start for free. Scale when you are ready. No hidden fees.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 transition-all ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-5 font-display text-4xl font-bold text-foreground">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="text-base font-normal text-muted-foreground">
                    /mo
                  </span>
                )}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* cta*/
export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-10 text-center sm:p-16">
        <h2 className="font-display text-balance text-3xl font-bold text-foreground sm:text-4xl">
          Ready to Transform Your Voice Operations?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Join thousands of businesses using VoiceAgent to deliver faster, smarter,
          and more personal customer experiences.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="min-w-[200px] text-base">
            <Link href="/signup">
              Create Free Account
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[200px] text-base border-border text-foreground hover:bg-secondary">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* footer section */
const FOOTER_LINKS = {
  Product: ["Features", "Pricing", "Integrations", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "API Reference", "Status", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-4 pb-10 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Mic className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                SoulChat
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI-powered voice agents that sound human and scale infinitely.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-foreground">{heading}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 SoulChat. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
