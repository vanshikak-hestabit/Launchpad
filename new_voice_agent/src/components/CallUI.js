"use client";
import { useState } from "react";
import { useVoiceLoop } from "@/hooks/useVoiceLoop";
import { Mic } from "lucide-react";

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
  const {
    messages,
    status,
    draft,
    setDraft,
    startListening,
    stopListening,
    handleLLM,
    resetConversation,
  } = useVoiceLoop(agent?.system_prompt);

  function handleStart() {
    setCallActive(true);
  }

  function handleEnd() {
    if (messages.length > 0) {
      const session = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        messages: messages,
      };

      setChatHistory((prev) => [session, ...prev]);
    }

    stopListening();
    resetConversation();   
    setCallActive(false);
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

  <div className="relative min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 p-6">
    <button
      onClick={() => setShowHistory(!showHistory)}
      className="absolute top-4 left-4 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
    >
      {showHistory ? "Close History" : "History"}
      </button>
      {showHistory && (
            <div className="absolute top-16 left-4 w-80 max-h-[70vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl">
              <h2 className="text-lg font-semibold mb-3 text-white">Past Conversations</h2>

              {chatHistory.length === 0 && (
                <p className="text-gray-400 text-sm">No history yet.</p>
              )}

              {chatHistory.map((session) => (
                <div
                  key={session.id}
                  className="mb-3 p-3 bg-gray-800 rounded-lg"
                >
                  <p className="text-xs text-gray-400 mb-2">
                    {session.date}
                  </p>

                  <button
                    onClick={() => {
                      const formatted = session.messages
                        .map(
                          (msg) =>
                            `${msg.role === "user" ? "User" : "Agent"}: ${msg.content}`
                        )
                        .join("\n\n");

                      const blob = new Blob([formatted], {
                        type: "text/plain",
                      });
                      const url = URL.createObjectURL(blob);

                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `chat-${session.id}.txt`;
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
    {messages.length > 0 && (
      <button
        onClick={downloadChat}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        Download Chat
      </button>
    )}

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