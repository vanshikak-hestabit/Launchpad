"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <Layout>
      <Card className="w-[600px] min-h-[600px]">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>
        <p className="text-gray-700 mb-8 text-lg">You are logged in.</p>
        <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">Logout</Button>
      </Card>
    </Layout>
  );
}
