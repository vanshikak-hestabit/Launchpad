"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("companions")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error)
      return
    }

    setCompanions((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
        <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Your Companions</h1>
            <Link href="/dashboard/companion">
            <Button>Create Companion</Button>
            </Link>
        </div>

        {/* List */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companions.map((c) => (
        <div
          key={c.id}
          className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between"
        >
      <div>
        <div className="flex items-center gap-3 mb-2">
          {c.avatar_url ? (
            <img
              src={c.avatar_url}
              alt={c.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {c.name?.charAt(0)}
            </div>
          )}

          <h2 className="text-lg font-semibold">{c.name}</h2>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Personality: {c.personality_traits || "Not set"}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          Communication: {c.communications_style || "Not set"}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          System Prompt:{" "}
          {c.system_prompt
            ? c.system_prompt.slice(0, 20) + (c.system_prompt.length > 20 ? "..." : "")
            : "Not set"}
        </p>
      </div>

          <div className="flex gap-2 mt-7">
            <Link href={`/chat/${c.id}`}>
              <Button size="sm">Chat</Button>
            </Link>

            <Link href={`/dashboard/companion/${c.id}`}>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </Link>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
        </div>
    </div>
  )
}