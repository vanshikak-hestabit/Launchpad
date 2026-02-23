"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VoiceModal({ open, onClose }) {
  const router = useRouter();

  const [mode, setMode] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (open) {
      loadAgents();
    }
  }, [open]);

  const loadAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load agents", err);
      setAgents([]);
    }
  };

  const resetAll = () => {
    setMode(null);
    setSelectedAgent(null);
    setFile(null);
    setUploadStatus("");
  };

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
        `Upload successful. ${data.chunks_added} chunks created. Redirecting...`
      );

      // Redirect AFTER successful upload
      setTimeout(() => {
        resetAll();
        onClose();
        router.push(`/call/${selectedAgent.agent_id}`);
      }, 1000);

    } catch (err) {
      console.error(err);
      setUploadStatus("Something went wrong.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[420px] max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 space-y-4">

        {/* STEP 1 */}
        {mode === null && (
          <>
            <h2 className="text-lg font-semibold">Choose an option</h2>

            <button
              className="w-full border px-4 py-2 rounded"
              onClick={() => setMode("ask")}
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

        {/* STEP 2 ASK */}
        {mode === "ask" && (
          <>
            <h2 className="text-lg font-semibold">Select Agent</h2>

            {agents.map((agent) => (
              <button
                key={agent.agent_id}
                onClick={() => {
                  resetAll();
                  onClose();
                  router.push(`/call/${agent.agent_id}`);
                }}
                className="w-full text-left border px-3 py-2 rounded"
              >
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {agent.system_prompt}
                </div>
              </button>
            ))}

            <button
              className="text-sm text-gray-500"
              onClick={resetAll}
            >
              Back
            </button>
          </>
        )}

        {/* STEP 2 UPLOAD */}
        {mode === "upload" && (
          <>
            <h2 className="text-lg font-semibold">Upload Document</h2>

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
              <div className="border rounded p-2 text-sm">
                {uploadStatus}
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
            resetAll();
            onClose();
          }}
        >
          Close
        </button>

      </div>
    </div>
  );
}