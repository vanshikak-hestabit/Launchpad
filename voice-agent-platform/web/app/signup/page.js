"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Layout from "@/components/Layout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <Layout>
      <Card className="w-[500px] min-h-[600px]">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Sign Up</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSignup}>
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Sign Up</Button>
        </form>
        {message && <p className="mt-8 text-red-500">{message}</p>}
      </Card>
    </Layout>
  );
}
