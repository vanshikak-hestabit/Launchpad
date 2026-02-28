// app/components/AgentForm.jsx
"use client";
import { supabase } from "@/lib/supabase";

import { useState, useEffect } from "react";

export default function AgentForm() {
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  // voices from elevenlabs
  useEffect(() => {
    const fetchVoices = async () => {
      setVoices(["Voice 1", "Voice 2", "Voice 3"]);
    };
    fetchVoices();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase
    .from("Agents")
    .insert([
    {
        name: name,
        system_prompt: systemPrompt,
        voice: selectedVoice,
        user_id: null, 
    },
    ]);


  if (error) {
    console.error("Error inserting agent:", error);
    alert("Error creating agent");
    return;
  }

  console.log("Agent created:", data);
  alert("Agent created successfully!");

  // Reset form
  setName("");
  setSystemPrompt("");
  setSelectedVoice("");
};

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">Create Agent</h2>

      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter agent name"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter system prompt"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Select Voice</label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">Select a voice</option>
          {voices.map((voice) => (
            <option key={voice} value={voice}>
              {voice}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
      >
        Create Agent
      </button>
    </form>
  );
}
