"use client"

import { useState } from "react"
import Link from "next/link"
import { Mic, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            AI Companion
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="#features"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Right side - Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground hover:text-foreground">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="font-semibold">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="my-2 h-px bg-border/50" />
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/signup">New Customer? Sign Up Here</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
