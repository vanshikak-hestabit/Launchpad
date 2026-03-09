"use client"
import { useState } from "react"
import { User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function CompanionForm({ companion = null, onSuccess }) {

  const [name, setName] = useState(companion?.name || "")
  const [traits, setTraits] = useState(companion?.personality_traits || "")
  const [communicationStyle, setCommunicationStyle] = useState(companion?.communications_style || "")
  const [systemPrompt, setSystemPrompt] = useState(companion?.system_prompt || "")
  const [backgroundStory, setBackgroundStory] = useState(companion?.background_story || "")
  const [relationshipStory, setRelationshipStory] = useState(companion?.relationship_story || "")
  const [avatarUrl, setAvatarUrl] = useState(companion?.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const router = useRouter()

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

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file)

    if (error) {
      console.error(error)
      setMessage("Image upload failed")
      return
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName)

    setAvatarUrl(data.publicUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser() // gets logged-in user info

    const payload = {
      name,
      personality_traits: traits,
      communications_style: communicationStyle,
      system_prompt: systemPrompt,
      background_story: backgroundStory,
      relationship_story: relationshipStory,
      avatar_url: avatarUrl,
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
      router.push("/dashboard")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">

{/* Avatar Upload UI */}
<div className="flex items-center gap-4">

  <div className="w-20 h-20 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100">
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <User className="w-8 h-8 text-gray-400" />
    )}
  </div>

  <label className="bg-black text-white px-4 py-2 rounded-md cursor-pointer text-sm">
    Upload Avatar
    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarUpload}
      className="hidden"
    />
  </label>

</div>

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