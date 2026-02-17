"use client";

import { useState } from "react";

export default function AskQuestionModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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
 
  // upload pdf
    const uploadFile = async () => {
    if (!file || !selectedAgent) {
      setUploadStatus("Please select agent and file.");
      return;
    }

    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("agent_id", selectedAgent.agent_id);

    try {
      const res = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadStatus(data.error || "Upload failed");
        return;
      }

      setUploadStatus(
        `Upload successful. ${data.chunks_added} chunks created.`
      );
      setFile(null);
      setSelectedAgent(null);

    } catch (err) {
      console.error(err);
      setUploadStatus("Something went wrong.");
    }
  };

  // Ask question using selected agent
    const askQuestion = async () => {
    if (!question.trim() || !selectedAgent) return;

    setLoading(true);
    setAnswer("");

    try {
        // Search (retrieve chunks)
        const searchRes = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: question,
            agent_id: selectedAgent.agent_id,
            top_k: 5,
        }),
        });

        const searchData = await searchRes.json();

        const chunks = searchData?.results
        ?.map((r) => r.chunk_text)
        .filter(Boolean);

        if (!chunks || chunks.length === 0) {
        setAnswer("No relevant information found in the documents.");
        setLoading(false);
        return;
        }

        // Answer (LLM formats the answer)
        const answerRes = await fetch("/api/knowledge/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question,
            chunks,
        }),
        });

        const answerData = await answerRes.json();

        setAnswer(answerData.answer || "No answer generated.");
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
                onClick={() => {
                    setMode("upload");
                    loadAgents();
                }}
                >
                Upload your own data
                </button>
              </>
            )}

            {/* STEP 2 — UPLOAD */}
            {mode === "upload" && (
            <>
                <h2 className="text-lg font-semibold">Upload Document</h2>

                {agents.map((agent) => (
                <button
                    key={agent.agent_id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left border px-3 py-2 rounded ${
                    selectedAgent?.agent_id === agent.agent_id ? "bg-gray-100" : ""
                    }`}
                >
                    <div className="font-medium">{agent.name}</div>
                </button>
                ))}

                <input
                type="file"
                accept=".pdf,.txt"
                className="w-full border p-2 rounded"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <button
                className="bg-black text-white px-4 py-2 rounded w-full"
                onClick={uploadFile}
                >
                Upload
                </button>

                {uploadStatus && (
                <div className="border rounded p-2 text-sm">{uploadStatus}</div>
                )}

                <button
                className="text-sm text-gray-500"
                onClick={resetAll}
                >
                Back
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
