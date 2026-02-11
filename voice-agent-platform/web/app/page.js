"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Voice Agent Platform</h1>
      <p>Please choose an option to continue:</p>
      <div style={{ marginTop: "20px" }}>
        <button
          style={{ marginRight: "10px", padding: "10px 20px" }}
          onClick={() => router.push("/login")}
        >
          Login
        </button>
        <button
          style={{ marginLeft: "10px", padding: "10px 20px" }}
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
