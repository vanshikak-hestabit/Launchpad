## Voice AI SaaS Dashboard

A modern SaaS dashboard built with Next.js (App Router) and Tailwind CSS, featuring authentication pages, a responsive navigation system, and a clean themed UI using design tokens.

## Overview

This project is a SaaS-style web application designed for a Voice AI Agent platform. It includes:

- Login and Signup authentication pages
- Responsive dashboard layout
- Mobile navigation with hamburger menu
- Themed UI using Tailwind design tokens (bg-background, bg-primary)
- Reusable component structure
- Modern blur glow background effects

The architecture follows production-level UI structure patterns used in real SaaS applications.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Shadcn UI / Themed Tailwind tokens
- Lucide Icons (if used in navigation)
 
## others 

- embedding model: gemini-embedding-001
- chunking - RecursiveCharacterTextSplitter
- chunkSize: 500
- chunkOverlap: 50
- Model: llama-3.1-8b-instant

## Project Structure

app/
 ├── login/
 │    └── page.js
 ├── signup/
 │    └── page.js
 ├── dashboard/
 │    └── page.js
components/
 ├── LoginForm.jsx
 ├── SignupForm.jsx
 ├── Navbar.jsx
 ├── Sidebar.jsx
 └── MobileMenu.jsx

## Authentication Pages

- Both Login and Signup pages follow the same layout shell:
- Full screen centered layout
- Background theme using bg-background
- Subtle glow effects using bg-primary/5
- Form component placed inside layout

## Responsive Navigation

- The dashboard includes:
- Desktop navigation menu
- Mobile hamburger menu
- Conditional rendering using state (mobileMenuOpen)
- Tailwind responsive utilities (md:hidden, hidden md:flex)
- This ensures proper mobile usability without UI clutter.

## Theming System

This project uses Tailwind theme tokens instead of hardcoded colors:
- bg-background
- bg-primary
- bg-primary/5

Benefits:
- Easy theme switching
- Consistent UI
- No color drift
- Scalable design system

## Architecture Philosophy

The UI follows a clean SaaS pattern:
- Auth Pages = Layout Shell + Replaceable Form

This ensures:
- Design consistency
- Easier scaling
- Maintainability
- Clean separation of concerns

Reusable components handle structure, while pages act as layout wrappers.

## Installation

- Clone the repository
- git clone <your-repo-url>
- Install dependencies
- npm install
- Run development server
- npm run dev
- Open in browser: http://localhost:3000

## Features

- Clean SaaS-style UI
- Dark themed dashboard
- Mobile responsive layout
- Reusable component architecture
- Production-ready folder structure
- Modern glow aesthetic using blur effects
- Accessible form structure

## Future Improvements

- Backend authentication (JWT / OAuth / Clerk / NextAuth)
- Protected dashboard routes
- Database integration
- Voice AI API integration
- Billing system
- User profile management
- Analytics dashboard


This structure is already solid. What matters next is feature depth, not layout.