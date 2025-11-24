"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
          Login
        </button>

        {/* Signup*/}
        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-700 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
