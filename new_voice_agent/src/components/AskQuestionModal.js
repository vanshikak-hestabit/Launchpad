"use client";

import { useState } from "react";

export default function AskQuestionModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Load agents from API
  const loadAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load agents", err);
    }
  };

  // Ask question using selected agent
  const askQuestion = async () => {
    if (!question.trim() || !selectedAgent) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: question,
          agent_id: selectedAgent.agent_id,
          system_prompt: selectedAgent.system_prompt,
          top_k: 5,
        }),
      });

      const data = await res.json();

      const combined =
        data?.results?.map((r) => r.chunk_text).join("\n\n") ||
        "No answer found.";

      setAnswer(combined);
    } catch (err) {
      console.error("Question failed", err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const resetAll = () => {
    setMode(null);
    setAgents([]);
    setSelectedAgent(null);
    setQuestion("");
    setAnswer("");
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Have a question?
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-hidden flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[420px] max-h-[80vh] overflow-y-auto space-y-4">

            {/* STEP 1 */}
            {mode === null && (
              <>
                <h2 className="text-lg font-semibold">Choose an option</h2>

                <button
                  className="w-full border px-4 py-2 rounded"
                  onClick={() => {
                    setMode("ask");
                    loadAgents();
                  }}
                >
                  Ask from existing data
                </button>

                <button
                  className="w-full border px-4 py-2 rounded"
                  onClick={() => setMode("upload")}
                >
                  Upload your own data
                </button>
              </>
            )}

            {/* STEP 2 */}
            {mode === "ask" && (
              <>
                <h2 className="text-lg font-semibold">Select Agent</h2>

                {agents.map((agent) => (
                  <button
                    key={agent.agent_id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left border px-3 py-2 rounded ${
                      selectedAgent?.agent_id === agent.agent_id
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {agent.system_prompt}
                    </div>
                  </button>
                ))}

                {selectedAgent && (
                  <>
                    <textarea
                      className="w-full border rounded p-2"
                      rows={4}
                      placeholder="Type your question..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />

                    <button
                      className="bg-black text-white px-4 py-2 rounded w-full"
                      onClick={askQuestion}
                      disabled={loading}
                    >
                      {loading ? "Thinking..." : "Ask"}
                    </button>
                  </>
                )}

                {answer && (
                  <div className="border rounded p-3 text-sm whitespace-pre-wrap">
                    {answer}
                  </div>
                )}

                <button
                  className="text-sm text-gray-500"
                  onClick={resetAll}
                >
                  Back
                </button>
              </>
            )}

            <button
              className="text-sm text-gray-500"
              onClick={() => {
                setOpen(false);
                resetAll();
              }}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}
