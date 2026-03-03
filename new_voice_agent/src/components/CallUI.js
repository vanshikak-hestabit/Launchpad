"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useVoiceLoop } from "@/hooks/useVoiceLoop";
import { Mic } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);
  const isEndingRef = useRef(false);
  const {
    messages,
    status,
    draft,
    setDraft,
    startListening,
    stopListening,
    handleLLM,
    resetConversation,
    pauseSpeaking,
    resumeSpeaking,
  } = useVoiceLoop(agent);;

  useEffect(() => {
    fetchHistory();
  }, []);

  async function saveCall(durationInSeconds, transcriptText) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("calls").insert([
      {
        user_id: user.id,
        duration: durationInSeconds,
        transcript: transcriptText,
      },
    ]);

    if (error) {
      console.error("Error saving call:", error.message);
    }
  }

  async function fetchHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("calls")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error.message);
      return;
    }
    setChatHistory(data);
  }

  function handleStart() {
    setCallStartTime(Date.now());
    setCallActive(true);
  }

  async function handleEnd() {
    if (isEndingRef.current) return; //  prevent double execution
    isEndingRef.current = true;

    const transcriptText = messages
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Agent"}: ${msg.content}`
      )
      .join("\n\n");

    const durationInSeconds = callStartTime
      ? Math.floor((Date.now() - callStartTime) / 1000)
      : 0;

    if (durationInSeconds > 0 && transcriptText.length > 0) {
      await saveCall(durationInSeconds, transcriptText);
      await fetchHistory();
    }

    stopListening();
    resetConversation();
    setCallActive(false);

    isEndingRef.current = false; // release lock
  }

  function handleMute() {
    if (!callActive) return;

    if (!muted) {
      pauseSpeaking();   // going into mute
    } else {
      resumeSpeaking();  // coming out of mute
    }

    setMuted(!muted);
  }

    function handleSend() {
    if (!draft.trim()) return;

    // show user message immediately
    handleLLM(draft);
    setDraft("");
  }

  function downloadChat() {
    if (!messages.length) return;

    const formatted = messages
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Agent"}: ${msg.content}`
      )
      .join("\n\n");

    const blob = new Blob([formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

return (
  <div className="relative min-h-screen bg-gray-950 flex flex-col">

    {/* History Button */}
    <button
      onClick={() => setShowHistory(!showHistory)}
      className="fixed top-4 left-4 z-50 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
    >
      {showHistory ? "Close History" : "History"}
    </button>

    {/* History Panel */}
    {showHistory && (
      <div className="fixed top-16 left-4 w-80 max-h-[70vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl z-40">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Past Conversations
        </h2>

        {chatHistory.length === 0 && (
          <p className="text-gray-400 text-sm">No history yet.</p>
        )}

      {chatHistory.map((call) => (
        <div
          key={call.id}
          className="mb-3 p-3 bg-gray-800 rounded-lg"
        >
          <p className="text-xs text-gray-400 mb-2">
            {new Date(call.created_at).toLocaleString()}
          </p>

          <button
            onClick={() => {
              const blob = new Blob([call.transcript], {
                type: "text/plain",
              });

              const url = URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = `chat-${call.id}.txt`;
              a.click();

              URL.revokeObjectURL(url);
            }}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Download
          </button>
        </div>
      ))}
      </div>
    )}

    {/* Header Section */}
    <div className="fixed top-0 left-0 w-full bg-gray-950 border-b border-gray-800 pt-16 pb-4 px-4 flex flex-col items-center text-center z-30">
      <h1 className="text-white text-2xl font-semibold">
        {agent?.name || "Voice Agent"}
      </h1>

      <div className="flex items-center gap-2 mt-2">
        <div
          className={`w-3 h-3 rounded-full ${
            callActive ? statusColors[status] : "bg-gray-600"
          }`}
        />
        <span className="text-gray-400 text-sm">
          {callActive ? statusLabels[status] : "Not connected"}
        </span>
      </div>
    </div>

    {/* Messages Area */}
    <div className="flex-1 overflow-y-auto px-4 pt-40 mb-40 w-full max-w-md self-center space-y-3">
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

    {/* Bottom Controls */}
    <div className="fixed bottom-0 left-0 w-full bg-gray-950 border-t border-gray-800 p-4 flex flex-col gap-4 items-center z-30">

      {/* INPUT BOX */}
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
            onClick={startListening}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg"
          >
            <Mic size={18} />
          </button>

          <button
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg font-medium"
          >
            Send
          </button>
        </div>
      )}

      {/* Call Controls */}
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

  </div>
);
}