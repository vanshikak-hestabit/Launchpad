"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import CallUI from "@/components/CallUI";
import { LiveKitRoom } from "@livekit/components-react";

export default function CallPage() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchAgentAndToken() {
      const { data, error } = await supabase
        .from("Agents")
        .select("*")
        .eq("agent_id", agentId)

        console.log("agentId:", agentId, typeof agentId)
        console.log("data:", data)
        console.log("error:", error)

      setAgent(data);

      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      const json = await res.json();
      setToken(json.token);
      setLoading(false);
    }

    fetchAgentAndToken();
  }, [agentId]);

  if (loading || !token) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading agent...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400">Agent not found.</p>
      </div>
    );
  }
  const saveCall = async (durationInSeconds, transcriptText) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase.from("calls").insert([
    {
      user_id: user.id,
      duration: durationInSeconds,
      transcript: transcriptText,
    },
  ])

  if (error) {
    console.error("Error saving call:", error.message)
  }
}

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      audio
    >
      <CallUI agent={agent} />
    </LiveKitRoom>
  );
}
