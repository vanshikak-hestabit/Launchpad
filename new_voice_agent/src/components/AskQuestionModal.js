"use client";

import { useState } from "react";

export default function AskQuestionModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false);

  const loadAgents = async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data || []);
  };

  const askQuestion = async () => {
    if (!question.trim() || !selectedAgentId) return;

    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/knowledge/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: question,
        agent_id: selectedAgentId,
        top_k: 5,
      }),
    });

    const data = await res.json();

    const combined = data?.results
      ?.map((r) => r.chunk_text)
      .join("\n\n");

    setAnswer(combined || "No answer found.");
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[420px] space-y-4">

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

            {mode === "ask" && (
              <>
                <h2 className="text-lg font-semibold">Select Agent</h2>

                {agents.map((agent) => (
                  <button
                    key={agent.agent_id}
                    onClick={() => setSelectedAgentId(agent.agent_id)}
                    className={`w-full text-left border px-3 py-2 rounded ${
                      selectedAgentId === agent.agent_id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {agent.system_prompt}
                    </div>
                  </button>
                ))}

                {selectedAgentId && (
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
                  onClick={() => {
                    setMode(null);
                    setSelectedAgentId(null);
                    setQuestion("");
                    setAnswer("");
                  }}
                >
                  Back
                </button>
              </>
            )}

            <button
              className="text-sm text-gray-500"
              onClick={() => {
                setOpen(false);
                setMode(null);
                setAgents([]);
                setSelectedAgentId(null);
                setQuestion("");
                setAnswer("");
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
