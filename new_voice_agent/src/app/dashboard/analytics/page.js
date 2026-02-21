"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardActivity from "@/components/dashboardActivity";
import AnalyticsCards from "@/components/AnalyticsCards"

export default function AnalyticsPage() {
  const [calls, setCalls] = useState([]);

  const totalCalls = calls.length;

  const avgDuration =
    calls.length > 0
      ? Math.floor(
          calls.reduce((sum, c) => sum + c.duration, 0) / calls.length
        )
      : 0;

  useEffect(() => {
    const getCalls = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        setCalls(data);
      }
    };

    getCalls();
  }, []);

    return (
    <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
        Analytics Overview
        </h1>

        <AnalyticsCards calls={calls} />

        <div className="mt-8">
        <DashboardActivity calls={calls} />
        </div>
    </div>
    );
}