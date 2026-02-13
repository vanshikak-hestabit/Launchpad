"use client"

import { useState, useEffect } from "react"

export default function AgentsPage() {
  const [name, setName] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [voice, setVoice] = useState("voice1")
  const [agents, setAgents] = useState([])

  useEffect(() => {
    fetchAgents()
  }, [])

  async function fetchAgents() {
  const res = await fetch("/api/agents")
  const data = await res.json()

  console.log("API RESPONSE:", data)

  if (Array.isArray(data)) {
    setAgents(data)
  } else if (Array.isArray(data.data)) {
    setAgents(data.data)
  } else {
    console.error("Unexpected API response shape")
    setAgents([])
  }
}

  async function handleSubmit(e) {
    e.preventDefault()

    await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        system_prompt: systemPrompt,
        voice: voice,
      }),
    })

    setName("")
    setSystemPrompt("")
    setVoice("")
    fetchAgents()
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Agent</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Agent Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="System Prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <select
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        className="w-full border p-2 rounded"
        >
        <option value="voice1">Voice 1</option>
        <option value="voice2">Voice 2</option>
        <option value="voice3">Voice 3</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Agent
        </button>
      </form>

      {/* Agent List */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Your Agents</h2>

        {agents.map((agent) => (
          <div
            key={agent.agent_id}
            className="border p-4 rounded"
          >
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {agent.system_prompt}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Voice: {agent.voice}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
