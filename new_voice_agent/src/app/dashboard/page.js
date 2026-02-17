"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AskQuestionModal from "@/components/AskQuestionModal";
import { supabase } from "@/lib/supabase";
import DashboardCards from "@/components/dashboardCard";
import DashboardActivity from "@/components/dashboardActivity";

export default function DashboardPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setName(user.user_metadata?.display_name || "User");
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
          <AskQuestionModal />

          <button
            onClick={() => router.push("/agents")}
            className="bg-black text-white px-5 py-2.5 rounded-md"
          >
            + Create Agent
          </button>
        </div>
      </div>

      <DashboardCards />

      <div className="mt-8">
        <DashboardActivity />
      </div>
    </div>
  );
}
