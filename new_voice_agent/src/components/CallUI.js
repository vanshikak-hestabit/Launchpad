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
  const { transcript, reply, status, startListening, stopListening } =
    useVoiceLoop(agent?.system_prompt);

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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8 p-6">
      {/* Agent name */}
      <h1 className="text-white text-2xl font-semibold">{agent?.name || "Voice Agent"}</h1>

      {/* Connection indicator dot */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${callActive ? statusColors[status] : "bg-gray-600"}`} />
        <span className="text-gray-400 text-sm">
          {callActive ? statusLabels[status] : "Not connected"}
        </span>
      </div>

      {/* What user said */}
      {transcript && (
        <div className="bg-gray-800 rounded-xl p-4 w-full max-w-md">
          <p className="text-gray-400 text-xs mb-1">You said</p>
          <p className="text-white">{transcript}</p>
        </div>
      )}

      {/* What agent replied */}
      {reply && (
        <div className="bg-indigo-900 rounded-xl p-4 w-full max-w-md">
          <p className="text-indigo-300 text-xs mb-1">Agent replied</p>
          <p className="text-white">{reply}</p>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex gap-4 mt-4">
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
                muted ? "bg-yellow-600 hover:bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"
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