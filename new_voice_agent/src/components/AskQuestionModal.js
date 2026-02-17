"use client";

import { useState } from "react";

export default function AskQuestionModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [question, setQuestion] = useState("");

  const loadAgents = async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data || []);
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
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`w-full text-left border px-3 py-2 rounded ${
                      selectedAgentId === agent.id ? "bg-gray-100" : ""
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
                      onClick={() =>
                        console.log(
                          "AGENT:",
                          selectedAgentId,
                          "QUESTION:",
                          question
                        )
                      }
                    >
                      Ask
                    </button>
                  </>
                )}

                <button
                  className="text-sm text-gray-500"
                  onClick={() => {
                    setMode(null);
                    setSelectedAgentId(null);
                    setQuestion("");
                  }}
                >
                  Back
                </button>
              </>
            )}

            {/* CLOSE */}
            <button
              className="text-sm text-gray-500"
              onClick={() => {
                setOpen(false);
                setMode(null);
                setAgents([]);
                setSelectedAgentId(null);
                setQuestion("");
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
