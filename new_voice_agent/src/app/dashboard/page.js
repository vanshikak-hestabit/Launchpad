"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AskQuestionModal from "@/components/AskQuestionModal";
import { supabase } from "@/lib/supabase";
import DashboardCards from "@/components/dashboardCard";
import DashboardActivity from "@/components/dashboardActivity";
import VoiceModal from "@/components/VoiceModal";

export default function DashboardPage() {
  const [name, setName] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [calls, setCalls] = useState([]);

  const totalCalls = calls.length;

  const avgDuration =
    calls.length > 0
      ? Math.floor(
          calls.reduce((sum, c) => sum + c.duration, 0) / calls.length
        )
      : 0;
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setName(user.user_metadata?.display_name || "User");

      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        setCalls(data);
      }
    };

    getUser();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex w-full items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Mic Button */}
          <button
            onClick={() => setVoiceOpen(true)}
            className="rounded-full bg-black p-3 text-white"
            aria-label="Voice"
          >
            🎤
          </button>
          <VoiceModal
            open={voiceOpen}
            onClose={() => setVoiceOpen(false)}
          />

          <AskQuestionModal />

          <button
            onClick={() => router.push("/agents")}
            className="bg-black text-white px-5 py-2.5 rounded-md"
          >
            + Create Agent
          </button>
        </div>
      </div>

        <DashboardCards
          totalCalls={totalCalls}
          avgDuration={avgDuration}
        />

      <div className="mt-8">
        <DashboardActivity />
      </div>
    </div>
  );
}