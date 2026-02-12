"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Layout from "@/components/Layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push("/dashboard");
  };

  return (
    <Layout>
      <Card className="w-[500px] min-h-[600px]">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Login</h1>
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="bg-yellow-500 text-white hover:bg-yellow-600">Login</Button>
        </form>
        {message && <p className="mt-8 text-red-500">{message}</p>}
      </Card>
    </Layout>
  );
}
