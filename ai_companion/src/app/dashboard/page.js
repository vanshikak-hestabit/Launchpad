"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import DashboardNavbar from "@/components/dashboardNav"

export default function DashboardPage() {
  const [companions, setCompanions] = useState([])

  useEffect(() => {
    const fetchCompanions = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
    .from("companions")
    .select("*")
    .eq("user_id", user.id)

      if (error) console.error(error)
      else setCompanions(data)
    }

    fetchCompanions()
  }, [])

  return (
    <div>
      <DashboardNavbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Your Companions</h1>
        <Link href="/dashboard/companion" className="text-primary mb-4 inline-block">
          + Create New Companion
        </Link>
        <ul className="flex flex-col gap-2">
          {companions.map((c) => (
            <li key={c.id} className="border p-2 rounded flex justify-between items-center">
              <span>{c.name}</span>
              <Link
                href={`/dashboard/companion/${c.id}`}
                className="text-sm text-primary"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}