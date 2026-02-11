"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // destroys the session
    router.push("/login"); // redirect to login
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
