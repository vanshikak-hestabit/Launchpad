"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import DashboardCards from "@/components/dashboardCard"
import DashboardActivity from "@/components/dashboardActivity"

export default function DashboardPage() {
  const [name, setName] = useState("")

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setName(user.user_metadata?.display_name || "User")
      }
    }

    getUser()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {"Here's what's happening with your projects today."}
        </p>
      </div>

      <DashboardCards />

      <div className="mt-8">
        <DashboardActivity />
      </div>
    </div>
  )
}
