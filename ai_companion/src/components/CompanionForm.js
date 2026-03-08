"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function CompanionForm({ companion = null, onSuccess }) {

  const [name, setName] = useState(companion?.name || "")
  const [traits, setTraits] = useState(companion?.personality_traits || "")
  const [communicationStyle, setCommunicationStyle] = useState(companion?.communications_style || "")
  const [systemPrompt, setSystemPrompt] = useState(companion?.system_prompt || "")
  const [backgroundStory, setBackgroundStory] = useState(companion?.background_story || "")
  const [relationshipStory, setRelationshipStory] = useState(companion?.relationship_story || "")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const personalityOptions = [
    "Friendly",
    "Funny",
    "Wise",
    "Motivational",
    "Sarcastic",
    "Calm",
    "Intellectual",
    "Creative"
  ]

  const communicationOptions = [
    "Casual",
    "Professional",
    "Playful",
    "Formal",
    "Supportive",
    "Straightforward"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      name,
      personality_traits: traits,
      communications_style: communicationStyle,
      system_prompt: systemPrompt,
      background_story: backgroundStory,
      relationship_story: relationshipStory,
      user_id: user.id
    }

    let result

    if (companion?.id) {
      result = await supabase
        .from("companions")
        .update(payload)
        .eq("id", companion.id)
    } else {
      result = await supabase
        .from("companions")
        .insert([payload])
    }

    setLoading(false)

    if (result.error) {
      setMessage(result.error.message)
    } else {
      setMessage("Companion saved successfully")
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">

      <input
        type="text"
        placeholder="Companion Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <select
        value={traits}
        onChange={(e) => setTraits(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Personality Trait</option>
        {personalityOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <select
        value={communicationStyle}
        onChange={(e) => setCommunicationStyle(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Communication Style</option>
        {communicationOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <textarea
        placeholder="System Prompt (how the AI should behave)"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        className="border p-2 rounded"
      />

      <textarea
        placeholder="Background Story"
        value={backgroundStory}
        onChange={(e) => setBackgroundStory(e.target.value)}
        className="border p-2 rounded"
      />

      <textarea
        placeholder="Relationship Story"
        value={relationshipStory}
        onChange={(e) => setRelationshipStory(e.target.value)}
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