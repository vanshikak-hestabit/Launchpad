"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import AnalyticsCards from "@/components/AnalyticsCards";
import AnalyticsGraphs from "@/components/AnalyticsGraphs";

export default function AnalyticsPage() {

  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
    .from("messages")
    .select(`
        *,
        conversations (
        companion_id,
        companions (
            name
        )
        )
    `)
    .eq("user_id", user.id)

    if (!error && data) {
      setConversations(data);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Analytics Overview
      </h1>

      <AnalyticsCards conversations={conversations} />
      <AnalyticsGraphs conversations={conversations} />

    </div>
  );
}