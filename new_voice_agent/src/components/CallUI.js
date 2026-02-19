"use client";
import { useState } from "react";
import { useVoiceLoop } from "@/hooks/useVoiceLoop";

// Color for each status
const statusColors = {
  idle: "bg-gray-400",
  listening: "bg-green-500 animate-pulse",
  thinking: "bg-yellow-400 animate-pulse",
  speaking: "bg-blue-500 animate-pulse",
};

const statusLabels = {
  idle: "Ready",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
};

export default function CallUI({ agent }) {
  const [callActive, setCallActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const {
    messages,
    status,
    draft,
    setDraft,
    startListening,
    stopListening,
    handleLLM,
  } = useVoiceLoop(agent?.system_prompt);

  function handleSend() {
    if (!draft.trim()) return;

    // show user message immediately
    handleLLM(draft);
    setDraft("");
  }


  function handleStart() {
    setCallActive(true);
    startListening();
  }

  function handleEnd() {
    setCallActive(false);
    stopListening();
  }

  function handleMute() {
    setMuted((m) => !m);
    // just stop sending audio when muted
    if (!muted) stopListening();
    else startListening();
  }

    function handleSend() {
    if (!draft.trim()) return;

    // show user message immediately
    handleLLM(draft);
    setDraft("");
  }

 return (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 p-6">
    {/* Agent name */}
    <h1 className="text-white text-2xl font-semibold">
      {agent?.name || "Voice Agent"}
    </h1>

    {/* Connection indicator */}
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          callActive ? statusColors[status] : "bg-gray-600"
        }`}
      />
      <span className="text-gray-400 text-sm">
        {callActive ? statusLabels[status] : "Not connected"}
      </span>
    </div>

    {/* Messages */}
    <div className="w-full max-w-md space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`rounded-xl p-4 ${
            msg.role === "user" ? "bg-gray-800" : "bg-indigo-900"
          }`}
        >
          <p className="text-xs mb-1 text-gray-400">
            {msg.role === "user" ? "You said" : "Agent replied"}
          </p>
          <p className="text-white">{msg.content}</p>
        </div>
      ))}
    </div>

    {/* INPUT BOX (always visible when call is active) */}
    {callActive && (
      <div className="w-full max-w-md flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Speak or type your question..."
          className="flex-1 rounded-lg bg-gray-800 text-white px-4 py-3 outline-none"
        />
    <button
      onClick={handleSend}
      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg font-medium"
    >
      Send
    </button>
      </div>
    )}

    {/* Control buttons */}
    <div className="flex gap-4">
      {!callActive ? (
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Start Call
        </button>
      ) : (
        <>
          <button
            onClick={handleMute}
            className={`px-6 py-3 rounded-full font-medium transition ${
              muted
                ? "bg-yellow-600 hover:bg-yellow-500"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>

          <button
            onClick={handleEnd}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-medium transition"
          >
            End Call
          </button>
        </>
      )}
    </div>
  </div>
);
}