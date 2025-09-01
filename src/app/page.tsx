"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // User is not authenticated, redirect to signup
      router.push("/signup");
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is authenticated, show the home page
  if (session) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="text-center sm:text-left mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Zaira! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Hello, {session.user?.name || session.user?.email}! You&#39;re successfully logged in.
            </p>
          </div>

          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Dashboard</h2>
            <p className="text-gray-600 mb-4">
              This is your authenticated home page. You can now access all features of the application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Blog Posts</h3>
                <p className="text-gray-600">Create and manage your blog content</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Categories</h3>
                <p className="text-gray-600">Organize your content with categories</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="/blog"
            >
              View Blog
            </Link>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
              href="/admin"
            >
              Admin Panel
            </Link>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <Link
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <Link
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="/delete-account"
          >
            Delete Account
          </Link>
        </footer>
      </div>
    );
  }

  // This should not be reached, but just in case
  return null;
}
