"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { signIn } from "next-auth/react";   
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    }

    if (res?.ok) {
      router.push("/"); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Welcome Back 👋
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */} 
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-black"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-black"
          />

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <p className="text-gray-500 text-center mb-3">Or sign in with</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => signIn("facebook")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Facebook
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-amber-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
