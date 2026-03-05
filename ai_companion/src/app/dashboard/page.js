"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Your Companions</h1>
            <Link href="/dashboard/companion">
            <Button>Create Companion</Button>
            </Link>
        </div>

        {/* List */}
        <ul className="flex flex-col gap-3">
        {companions.map((c) => (
            <li
            key={c.id}
            className="border p-3 rounded flex justify-between items-center max-w-md"
            >
            <span className="font-medium">{c.name}</span>
            <div className="flex flex-col gap-1">
                <Link
                href={`/dashboard/companion/${c.id}`}
                className="text-sm text-primary"
                >
                Edit
                </Link>
                <button
                onClick={() => handleDelete(c.id)}
                className="text-sm text-destructive"
                >
                Delete
                </button>
            </div>
            </li>
        ))}
        </ul>
        </div>
    </div>
  )
}