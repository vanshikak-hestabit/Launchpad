"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function CompanionForm({ companion = null, onSuccess }) {
  const [name, setName] = useState(companion?.name || "")
  const [traits, setTraits] = useState(companion?.personality_traits || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { name, personality_traits: traits, user_id: user.id }

    let result
    if (companion?.id) {
      result = await supabase
        .from("companions")
        .update(payload)
        .eq("id", companion.id)
    } else {
      result = await supabase.from("companions").insert([payload])
    }

    setLoading(false)
    if (result.error) setMessage(result.error.message)
    else {
      setMessage("Saved!")
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Traits (comma separated)"
        value={traits}
        onChange={(e) => setTraits(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white py-2 rounded"
      >
        {loading ? "Saving..." : "Save Companion"}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  )
}