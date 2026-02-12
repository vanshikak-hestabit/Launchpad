"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Layout from "@/components/Layout";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <Card className="w-[500px] min-h-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Voice Agent Platform</h1>
        <p className="text-gray-600 mb-8">Please choose an option to continue:</p>

        <Button
          onClick={() => router.push("/login")}
          className="bg-purple-500 text-white hover:bg-purple-600 mb-4"
        >
          Login
        </Button>

        <p className="text-gray-700">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-pink-500 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </Card>
    </Layout>
  );
}
