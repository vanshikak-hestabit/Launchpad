# AI Companion Dashboard

A web application to create and chat with AI companions. Built with **Next.js**, **Supabase**, and **Groq AI**.

## Features

- Create, update, and delete AI companions
- Assign personality traits, communication style, and background story
- Upload companion avatars
- Chat with companions with AI-generated responses
- Automatic to-do and note handling via AI commands
- Manage conversations and messages

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons  
- **Backend:** Supabase (Authentication, Database, Storage)  
- **AI:** Groq API (Llama 3.1 Instant)  

## Setup

- Clone the repository  
```bash
git clone <your-repo-url>

## Install dependencies

npm install

## Setup environment variables in .env.local

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key

## Run the development server

npm run dev

Folder Structure
/app
  /dashboard
    page.js
  /companions
    CompanionForm.js
/lib
  supabase
    client.js
    server.js
  groq_client.js
/components
  ChatPage.js
  DashboardCards.js
  DashboardActivity.js
  VoiceModal.js

## Usage

Go to /dashboard to view companions

Click Create Companion to add a new AI companion

Chat with companions and manage conversations

Use commands like add buy milk to todo or add meeting note to trigger AI automation